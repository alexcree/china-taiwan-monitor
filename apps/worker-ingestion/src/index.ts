/**
 * worker-ingestion — Phase 2 entrypoint.
 *
 * Polls every enabled RSS source in the `sources` table, fetches the feed,
 * canonicalizes URLs, computes content hashes for dedup, and upserts new
 * items into `articles`. Updates source health columns regardless of outcome.
 *
 * Designed to run on a 15-minute GitHub Actions cron in Phase 2; rehouse on
 * a small VPS in Phase 3 when scrapers and per-tier cadence are introduced.
 */

import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Walk up from this file's location looking for .env in the repo root.
// pnpm --filter runs scripts with cwd = package dir; in GitHub Actions cwd
// is already the repo root, so this works in both contexts.
(function loadEnv() {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i++) {
    const p = join(dir, ".env");
    if (existsSync(p)) {
      // override: true so .env values win over any pre-set shell vars
      // (e.g., a host-injected empty ANTHROPIC_API_KEY=).
      loadDotenv({ path: p, override: true });
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
})();

import { getServiceClient, listEnabledSources, type SourceRow } from "@ctm/db";
import { fetchFeed } from "./rss.js";
import { ingestItems, type IngestResult } from "./ingest.js";
import { refreshMarketQuotes } from "./markets.js";
import { summarizeNewArticles } from "@ctm/llm";

const CONCURRENCY = 10;
const PER_SOURCE_TIMEOUT_MS = 20_000;

async function pollSource(
  supabase: ReturnType<typeof getServiceClient>,
  source: SourceRow,
): Promise<IngestResult & { source: string; httpStatus: number }> {
  const url = source.rss_url;
  const empty: IngestResult = {
    inserted: 0,
    skipped_duplicate: 0,
    skipped_relevance: 0,
    failed: 0,
  };

  if (!url) {
    return { ...empty, source: source.slug, httpStatus: 0 };
  }

  let httpStatus = 0;
  try {
    const items = await Promise.race([
      fetchFeed(url),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("feed timeout")),
          PER_SOURCE_TIMEOUT_MS,
        ),
      ),
    ]);
    httpStatus = 200;
    const result = await ingestItems(supabase, source, items);

    await supabase
      .from("sources")
      .update({ last_fetched_at: new Date().toISOString(), last_status: 200 })
      .eq("id", source.id);

    return { ...result, source: source.slug, httpStatus };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[poll] ${source.slug} failed: ${msg}`);
    httpStatus = 599; // generic fetch failure
    await supabase
      .from("sources")
      .update({
        last_fetched_at: new Date().toISOString(),
        last_status: httpStatus,
      })
      .eq("id", source.id);
    return {
      ...empty,
      failed: 1,
      source: source.slug,
      httpStatus,
    };
  }
}

/**
 * Run pollers in a bounded-concurrency pool. Returns aggregate stats.
 */
async function runPool<T, R>(
  items: readonly T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;

  async function pull(): Promise<void> {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      results[i] = await worker(items[i]!);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => pull()),
  );
  return results;
}

export async function runIngestionPass(): Promise<void> {
  const supabase = getServiceClient();
  const sources = await listEnabledSources(supabase, { mode: "rss" });

  console.log(
    `[ingest] starting pass · ${sources.length} enabled RSS sources · concurrency=${CONCURRENCY}`,
  );
  const t0 = Date.now();

  const results = await runPool(sources, (s) => pollSource(supabase, s), CONCURRENCY);

  let okSources = 0;
  let totalInserted = 0;
  let totalDedup = 0;
  let totalRelevance = 0;
  let totalFailed = 0;

  for (const r of results) {
    if (r.httpStatus === 200) okSources++;
    totalInserted += r.inserted;
    totalDedup += r.skipped_duplicate;
    totalRelevance += r.skipped_relevance;
    totalFailed += r.failed;
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    `[ingest] done in ${elapsed}s · ok=${okSources}/${sources.length} ` +
      `inserted=${totalInserted} dedup_skipped=${totalDedup} ` +
      `relevance_skipped=${totalRelevance} failed=${totalFailed}`,
  );

  // Summarization: fill in summary_en for articles inside the display
  // window. Skip anything older than 24h — it won't appear on home / feed
  // / TopLead, so there's no reason to spend tokens on it. Per-pass budget
  // capped by SUMMARIZER_MAX_PER_PASS (default 200).
  const t2 = Date.now();
  const s = await summarizeNewArticles(supabase, { sinceHours: 24 });
  const elapsedS = ((Date.now() - t2) / 1000).toFixed(1);
  console.log(
    `[summarize] done in ${elapsedS}s · window=last ${s.window_hours}h · attempted=${s.attempted} written=${s.written} failed=${s.failed} batches=${s.batches}`,
  );

  // Market quotes: refresh after summarize.
  const t1 = Date.now();
  const m = await refreshMarketQuotes(supabase);
  const elapsedM = ((Date.now() - t1) / 1000).toFixed(1);
  console.log(
    `[markets] done in ${elapsedM}s · fetched=${m.fetched} upserted=${m.upserted} failed=${m.failed}`,
  );
}

runIngestionPass()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
