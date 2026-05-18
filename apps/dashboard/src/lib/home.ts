import {
  getAnonClient,
  isDbConfigured,
  listEnabledSources,
  listLatestArticles,
  type ArticleWithSource,
  type SourceRow,
} from "@ctm/db";
import { clusterArticles, type ClusterInput } from "@ctm/shared";

/** Per-topic cap in the flat tile grid. */
const PER_TOPIC_GRID_CAP = 5;
/** Window for the headline grid + top lead. */
const HOME_WINDOW_HOURS = 24;
/** Window for the per-source "Latest by source" section. */
const SOURCE_LATEST_WINDOW_HOURS = 168; // 7 days
/** Headlines shown per source in the latest-by-source section. */
const SOURCE_LATEST_PER_SOURCE = 7;
/** Top lead banner: 1 lead + 3 secondaries. */
const TOP_LEAD_COUNT = 4;

export interface HomeTile {
  article: ArticleWithSource;
  /** Number of outlets covering the same underlying story (>=1). */
  cluster_size: number;
}

export interface SourceLatestGroup {
  slug: string;
  name: string;
  url: string;
  country: string;
  tier: number;
  paywall: boolean;
  articles: ArticleWithSource[];
}

export interface HomeState {
  /** Top Lead banner: 1 + 3. Excluded from the tile grid below. */
  leads: ArticleWithSource[];
  /** Flat tile grid for the main home area, sorted by cluster size desc. */
  tiles: HomeTile[];
  /** Bottom section: each source with its 7 latest articles. */
  bySource: SourceLatestGroup[];
  source: "live" | "seed";
  totalArticles: number;
}

export async function getHome(): Promise<HomeState> {
  if (!isDbConfigured()) return seedHome();
  const client = getAnonClient();
  if (!client) return seedHome();

  try {
    const [recentClassified, weekArticles, sources] = await Promise.all([
      // Classified 24h articles for the headline composition.
      listLatestArticles(client, {
        sinceHours: HOME_WINDOW_HOURS,
        limit: 1000,
        classifiedOnly: true,
      }),
      // 7-day pull for the per-source section (no classification required —
      // we want the source's latest regardless).
      listLatestArticles(client, {
        sinceHours: SOURCE_LATEST_WINDOW_HOURS,
        limit: 2000,
      }),
      listEnabledSources(client),
    ]);

    // ─── Story clustering on the 24h corpus ───────────────────────
    const inputs: ClusterInput[] = recentClassified.map((a) => ({
      id: a.id,
      text: cleanText(
        a.summary_en ?? a.title_en ?? a.title_original ?? "",
      ),
      weight: a.published_at ? Date.parse(a.published_at) : 0,
    }));
    // 0.30 hits the sweet spot on our summaries: ~30 multi-source clusters
    // with reasonable top sizes (6-7 outlets on a hot story) and minimal
    // false merges. Threshold probed via packages/worker-ingestion/src/
    // scripts/probe-clusters.ts.
    const clusters = clusterArticles(inputs, { threshold: 0.3 });
    const sizeOf = (id: string) => clusters.sizeOf.get(id) ?? 1;

    // ─── Top Lead: 4 articles by cluster size, deduped by source ──
    const leadCandidates = [...recentClassified].sort((a, b) => {
      const diff = sizeOf(b.id) - sizeOf(a.id);
      if (diff !== 0) return diff;
      return (b.published_at ?? "").localeCompare(a.published_at ?? "");
    });
    const leads = takeUniqueBySource(leadCandidates, TOP_LEAD_COUNT);
    const leadUrls = new Set(leads.map((l) => l.url));

    // ─── Flat tile grid ───────────────────────────────────────────
    // For each topic, sort by cluster size desc, dedupe to 1-per-source,
    // take top 5. Then merge all topics and re-sort by cluster size desc.
    const byTopic = new Map<string, ArticleWithSource[]>();
    for (const a of recentClassified) {
      if (leadUrls.has(a.url)) continue; // never show a lead twice
      const t = a.primary_topic ?? "general";
      const list = byTopic.get(t) ?? [];
      list.push(a);
      byTopic.set(t, list);
    }
    const tiles: HomeTile[] = [];
    for (const list of byTopic.values()) {
      const sorted = [...list].sort((a, b) => {
        const diff = sizeOf(b.id) - sizeOf(a.id);
        if (diff !== 0) return diff;
        return (b.published_at ?? "").localeCompare(a.published_at ?? "");
      });
      const picked = takeUniqueBySource(sorted, PER_TOPIC_GRID_CAP);
      for (const a of picked) {
        tiles.push({ article: a, cluster_size: sizeOf(a.id) });
      }
    }
    tiles.sort((a, b) => {
      if (b.cluster_size !== a.cluster_size)
        return b.cluster_size - a.cluster_size;
      return (b.article.published_at ?? "").localeCompare(
        a.article.published_at ?? "",
      );
    });

    // ─── Latest by source (bottom of page) ────────────────────────
    const bySource = composeLatestBySource(weekArticles, sources);

    return {
      leads,
      tiles,
      bySource,
      source: "live",
      totalArticles: tiles.length + leads.length,
    };
  } catch (err) {
    console.warn(
      "[home] live read failed:",
      err instanceof Error ? err.message : err,
    );
    return seedHome();
  }
}

function takeUniqueBySource(
  articles: ArticleWithSource[],
  cap: number,
): ArticleWithSource[] {
  const seen = new Set<string>();
  const picked: ArticleWithSource[] = [];
  for (const a of articles) {
    // Fall back to source_id, then a unique-per-article token, so missing
    // source rows don't all collapse to the same bucket.
    const key = a.source?.slug ?? a.source_id ?? `?${a.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(a);
    if (picked.length >= cap) break;
  }
  return picked;
}

function composeLatestBySource(
  weekArticles: ArticleWithSource[],
  sources: SourceRow[],
): SourceLatestGroup[] {
  const byId = new Map<string, SourceRow>();
  for (const s of sources) byId.set(s.id, s);

  const articlesByOwner = new Map<string, ArticleWithSource[]>();
  for (const a of weekArticles) {
    if (!a.source_id) continue;
    const list = articlesByOwner.get(a.source_id) ?? [];
    if (list.length < SOURCE_LATEST_PER_SOURCE) list.push(a);
    articlesByOwner.set(a.source_id, list);
  }

  const groups: SourceLatestGroup[] = [];
  for (const [sid, articles] of articlesByOwner) {
    const src = byId.get(sid);
    if (!src) continue;
    if (articles.length === 0) continue;
    groups.push({
      slug: src.slug,
      name: src.display_name,
      url: src.url,
      country: src.country,
      tier: src.tier,
      paywall: Boolean(src.paywall),
      articles,
    });
  }
  groups.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
  return groups;
}

function cleanText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function seedHome(): HomeState {
  // Local dev fallback. Empty state — the seed content was built around
  // sector buckets that are no longer the home shape.
  return {
    leads: [],
    tiles: [],
    bySource: [],
    source: "seed",
    totalArticles: 0,
  };
}
