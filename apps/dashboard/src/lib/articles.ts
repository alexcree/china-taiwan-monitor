import {
  getAnonClient,
  isDbConfigured,
  listLatestArticles,
  type ArticleWithSource,
} from "@ctm/db";
import { SEED_BRIEF } from "@ctm/brief-schema/seed";
import type { Sector } from "@ctm/brief-schema";

export interface FeedState {
  articles: ArticleWithSource[];
  source: "live" | "seed";
}

const SECTORS_IN_ORDER: Sector[] = [
  "economy",
  "tech",
  "consumer",
  "property",
  "defense",
  "politics",
  "diplomacy",
  "cyber",
  "influence",
];

/**
 * Builds the live feed view-model. Reads from Supabase when configured; falls
 * back to a flattened view over the seed brief otherwise so the route still
 * renders during local dev or before Phase 2 is wired up.
 */
export async function getFeed(
  opts: { limit?: number; sinceHours?: number } = {},
): Promise<FeedState> {
  const limit = opts.limit ?? 200;
  const sinceHours = opts.sinceHours ?? 24;
  if (isDbConfigured()) {
    const client = getAnonClient();
    if (client) {
      try {
        const articles = await listLatestArticles(client, {
          limit,
          sinceHours,
        });
        return { articles, source: "live" };
      } catch (err) {
        console.warn(
          "[feed] live read failed, falling back to seed:",
          err instanceof Error ? err.message : err,
        );
      }
    }
  }
  return { articles: flattenSeedToArticles(limit), source: "seed" };
}

/**
 * Reshape the seed brief into ArticleWithSource shape so we can render with
 * the same component regardless of whether the row came from Supabase.
 * Sourced sectors come in the prominence order used elsewhere.
 */
function flattenSeedToArticles(limit: number): ArticleWithSource[] {
  const out: ArticleWithSource[] = [];
  for (const sector of SECTORS_IN_ORDER) {
    const sec = SEED_BRIEF.sections[sector];
    if (!sec) continue;
    for (const src of sec.english_sources) {
      out.push(seedToArticle(src.url, "en", src.headline, src.summary_short, src.published_at, src.paywall, sector));
    }
    for (const src of sec.chinese_sources) {
      out.push(
        seedToArticle(
          src.url,
          src.url.includes(".tw") || src.url.includes("taipei") ? "zh-tw" : "zh-cn",
          src.headline_original,
          src.summary_short_en,
          src.published_at,
          src.paywall,
          sector,
          src.headline_en,
        ),
      );
    }
  }
  return out
    .sort((a, b) =>
      (b.published_at ?? "").localeCompare(a.published_at ?? ""),
    )
    .slice(0, limit);
}

function seedToArticle(
  url: string,
  lang: "en" | "zh-cn" | "zh-tw",
  title: string,
  summary: string,
  publishedAt: string | undefined,
  paywall: boolean | undefined,
  sector: Sector,
  titleEn?: string,
): ArticleWithSource {
  return {
    id: `seed:${url}`,
    source_id: null,
    url,
    url_canonical: url,
    lang,
    title_original: title,
    title_en: titleEn ?? null,
    summary,
    summary_en: titleEn ? summary : null,
    full_text: null,
    full_text_en: null,
    paywall: paywall ?? null,
    content_hash: null,
    dup_of: null,
    sectors: [sector],
    importance: null,
    breaking: false,
    triaged_at: null,
    posted_to_x: false,
    published_at: publishedAt ?? null,
    fetched_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    primary_topic: null,
    subtopics: null,
    actors: null,
    countries: null,
    content_type: null,
    source: null,
  };
}
