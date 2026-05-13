import {
  getAnonClient,
  isDbConfigured,
  listArticlesByCategory,
  listTopLeads,
  type ArticleWithSource,
} from "@ctm/db";
import { SEED_BRIEF } from "@ctm/brief-schema/seed";
import type { Sector } from "@ctm/brief-schema";

export interface HomeState {
  /** Map of source-category slug → ordered articles. */
  buckets: Map<string, ArticleWithSource[]>;
  /** Drudge-style banner: lead + secondaries, picked from tier-1 sources. */
  leads: ArticleWithSource[];
  source: "live" | "seed";
  totalArticles: number;
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
 * The home page reads live articles grouped by source category. Seed-mode
 * is a degenerate fallback that maps seed-brief sources into rough
 * categories so the page still renders during local dev / before workers
 * are wired up.
 */
export async function getHome(): Promise<HomeState> {
  if (isDbConfigured()) {
    const client = getAnonClient();
    if (client) {
      try {
        const [buckets, leads] = await Promise.all([
          listArticlesByCategory(client, {
            sinceHours: 24,
            totalLimit: 600,
            perCategoryLimit: 12,
          }),
          listTopLeads(client, { sinceHours: 24, limit: 4 }),
        ]);
        let total = 0;
        for (const v of buckets.values()) total += v.length;
        return { buckets, leads, source: "live", totalArticles: total };
      } catch (err) {
        console.warn(
          "[home] live read failed, falling back to seed:",
          err instanceof Error ? err.message : err,
        );
      }
    }
  }
  return seedHome();
}

/**
 * Map seed-brief sectors into source categories with a sensible heuristic
 * so the seed fallback still produces a multi-bucket layout for local dev.
 * Domain inference is conservative; anything ambiguous lands in "general".
 */
function seedHome(): HomeState {
  const buckets = new Map<string, ArticleWithSource[]>();
  let total = 0;

  for (const sector of SECTORS_IN_ORDER) {
    const sec = SEED_BRIEF.sections[sector];
    if (!sec) continue;
    for (const src of sec.english_sources) {
      const cat = categoryForSeed(src.url, sector);
      pushSeed(buckets, cat, makeSeedArticle(src.url, "en", src.headline, src.summary_short, src.published_at, src.paywall, sector));
      total++;
    }
    for (const src of sec.chinese_sources) {
      const cat = categoryForSeed(src.url, sector);
      pushSeed(
        buckets,
        cat,
        makeSeedArticle(
          src.url,
          src.url.includes(".tw") ? "zh-tw" : "zh-cn",
          src.headline_original,
          src.summary_short_en,
          src.published_at,
          src.paywall,
          sector,
          src.headline_en,
        ),
      );
      total++;
    }
  }

  for (const v of buckets.values()) {
    v.sort((a, b) =>
      (b.published_at ?? "").localeCompare(a.published_at ?? ""),
    );
  }

  // Pick a "lead pool" from the freshest seed articles — same shape as the
  // live path so the page renders identically. Dedupe by URL.
  const allSeed = Array.from(buckets.values()).flat();
  allSeed.sort((a, b) =>
    (b.published_at ?? "").localeCompare(a.published_at ?? ""),
  );
  const seenUrls = new Set<string>();
  const leads: ArticleWithSource[] = [];
  for (const a of allSeed) {
    if (seenUrls.has(a.url)) continue;
    seenUrls.add(a.url);
    leads.push(a);
    if (leads.length >= 4) break;
  }

  return { buckets, leads, source: "seed", totalArticles: total };
}

function pushSeed(
  buckets: Map<string, ArticleWithSource[]>,
  cat: string,
  article: ArticleWithSource,
) {
  const bucket = buckets.get(cat) ?? [];
  bucket.push(article);
  buckets.set(cat, bucket);
}

const WIRE_HOSTS = new Set([
  "reuters.com",
  "ft.com",
  "wsj.com",
  "bloomberg.com",
  "asia.nikkei.com",
  "nikkei.com",
  "scmp.com",
  "apnews.com",
  "xinhuanet.com",
  "chinadaily.com.cn",
  "globaltimes.cn",
  "focustaiwan.tw",
  "cna.com.tw",
  "people.cn",
]);
const DEFENSE_HOSTS = new Set([
  "defensenews.com",
  "breakingdefense.com",
  "warontherocks.com",
  "navalnews.com",
  "news.usni.org",
  "janes.com",
  "81.cn",
]);
const TECH_HOSTS = new Set([
  "asia.nikkei.com",
  "digitimes.com",
  "trendforce.com",
  "theinformation.com",
  "semianalysis.com",
  "thediplomat.com",
]);
const FINANCIAL_HOSTS = new Set([
  "caixin.com",
  "caixinglobal.com",
  "yicai.com",
  "yicaiglobal.com",
  "21jingji.com",
  "21cbh.com",
  "ft.com",
  "wsj.com",
  "bloomberg.com",
]);
const POLICY_HOSTS = new Set([
  "foreignpolicy.com",
  "thediplomat.com",
  "lawfaremedia.org",
  "asiatimes.com",
]);
const GOV_HOSTS = new Set([
  "gwytb.gov.cn",
  "fmprc.gov.cn",
  "mod.gov.cn",
  "mnd.gov.tw",
  "mofa.gov.tw",
  "mac.gov.tw",
  "president.gov.tw",
  "state.gov",
  "ait.org.tw",
  "ofac.treasury.gov",
  "bis.doc.gov",
  "mofcom.gov.cn",
]);

function categoryForSeed(url: string, sector: Sector): string {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }
  if (DEFENSE_HOSTS.has(host) || sector === "defense") return "defense";
  if (TECH_HOSTS.has(host) || sector === "tech" || sector === "cyber")
    return "tech";
  if (FINANCIAL_HOSTS.has(host) || sector === "economy" || sector === "property")
    return "financial";
  if (POLICY_HOSTS.has(host) || sector === "politics" || sector === "diplomacy")
    return "policy";
  if (GOV_HOSTS.has(host)) return "government";
  if (WIRE_HOSTS.has(host)) return "wire";
  return "general";
}

function makeSeedArticle(
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
    source: null,
  };
}
