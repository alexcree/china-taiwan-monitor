import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArticleInsert, SourceRow } from "@ctm/db";
import { isChinaTaiwanRelevant } from "@ctm/shared";
import { canonicalizeUrl, contentHash } from "./dedup.js";
import type { RssItem } from "./rss.js";

export interface IngestResult {
  inserted: number;
  skipped_duplicate: number;
  skipped_relevance: number;
  failed: number;
}

/**
 * Insert a batch of RSS items into the `articles` table. Idempotent — uses
 * the unique `url` constraint plus the `url_canonical`/`content_hash` columns
 * for near-dup detection. Items that violate the unique URL constraint are
 * silently skipped (already ingested).
 */
export async function ingestItems(
  supabase: SupabaseClient,
  source: SourceRow,
  items: RssItem[],
): Promise<IngestResult> {
  if (items.length === 0) {
    return {
      inserted: 0,
      skipped_duplicate: 0,
      skipped_relevance: 0,
      failed: 0,
    };
  }

  let skippedRelevance = 0;
  const relevantItems = items.filter((item) => {
    const ok = isChinaTaiwanRelevant({
      title: item.title,
      summary: item.summary,
      url: item.url,
    });
    if (!ok) skippedRelevance++;
    return ok;
  });

  if (relevantItems.length === 0) {
    return {
      inserted: 0,
      skipped_duplicate: 0,
      skipped_relevance: skippedRelevance,
      failed: 0,
    };
  }

  const rows: ArticleInsert[] = relevantItems.map((item) => {
    const url_canonical = canonicalizeUrl(item.url);
    return {
      source_id: source.id,
      url: item.url,
      url_canonical,
      lang: source.lang,
      title_original: item.title,
      summary: item.summary ?? null,
      paywall: source.paywall ?? null,
      content_hash: contentHash(item.title, item.summary),
      published_at: item.published_at,
    };
  });

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  // upsert with ignoreDuplicates + select returns ONLY the rows actually
  // inserted (existing URLs are silently skipped), giving an accurate count.
  const { data, error } = await supabase
    .from("articles")
    .upsert(rows, { onConflict: "url", ignoreDuplicates: true })
    .select("id");

  if (error) {
    // Fall back to per-row inserts to isolate the bad item.
    for (const row of rows) {
      const { error: rowError } = await supabase
        .from("articles")
        .insert(row);
      if (!rowError) {
        inserted++;
      } else if (rowError.code === "23505") {
        skipped++;
      } else {
        failed++;
        console.warn(
          `[ingest] ${source.slug}: row insert failed url=${row.url} code=${rowError.code} msg=${rowError.message}`,
        );
      }
    }
  } else {
    inserted = data?.length ?? 0;
    skipped = rows.length - inserted;
  }

  return {
    inserted,
    skipped_duplicate: skipped,
    skipped_relevance: skippedRelevance,
    failed,
  };
}
