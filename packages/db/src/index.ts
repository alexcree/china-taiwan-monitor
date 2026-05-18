import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  ArticleWithSource,
  MarketQuoteRow,
  SourceRow,
} from "./types.js";

export * from "./types.js";

/**
 * Resolve env across both Next.js server runtime and Node worker runtime.
 * Next exposes NEXT_PUBLIC_* to the browser bundle; the same vars on server
 * are read directly from process.env.
 */
function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export interface DbConfig {
  url: string;
  /**
   * Either the anon key (read-only, RLS-gated, fine for browser/dashboard SSR)
   * or the service-role key (full access, server/worker only — never ship to
   * a browser bundle).
   */
  key: string;
}

export function dbConfigFromEnv(
  variant: "anon" | "service",
): DbConfig | null {
  const url =
    env("SUPABASE_URL") ?? env("NEXT_PUBLIC_SUPABASE_URL") ?? null;
  const key =
    variant === "service"
      ? env("SUPABASE_SERVICE_ROLE_KEY")
      : env("SUPABASE_ANON_KEY") ?? env("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) return null;
  return { url, key };
}

/** Whether the runtime has enough configuration to talk to Supabase. */
export function isDbConfigured(variant: "anon" | "service" = "anon"): boolean {
  return dbConfigFromEnv(variant) !== null;
}

/**
 * Anon client — for server-side rendering / RLS-protected reads. Returns null
 * if not configured (callers should fall back to seed data).
 */
export function getAnonClient(): SupabaseClient | null {
  const cfg = dbConfigFromEnv("anon");
  if (!cfg) return null;
  return createClient(cfg.url, cfg.key, {
    auth: { persistSession: false },
  });
}

/**
 * Service-role client — bypasses RLS. ONLY for workers and trusted server
 * code. Never construct this in a browser bundle.
 */
export function getServiceClient(): SupabaseClient {
  const cfg = dbConfigFromEnv("service");
  if (!cfg) {
    throw new Error(
      "Supabase service-role config missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(cfg.url, cfg.key, {
    auth: { persistSession: false },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Query helpers used by both dashboard and workers.
// ────────────────────────────────────────────────────────────────────────────

const SOURCE_FIELDS =
  "slug, display_name, country, lang, paywall, category, tier";

const ARTICLE_FIELDS = `
  id, source_id, url, url_canonical, lang,
  title_original, title_en, summary, summary_en,
  paywall, content_hash, sectors, importance, breaking,
  published_at, fetched_at, created_at,
  primary_topic, subtopics, actors, countries, content_type,
  source:sources(${SOURCE_FIELDS})
`;

/** Articles within the last N hours, freshest-first. Used by `/feed`. */
export async function listLatestArticles(
  client: SupabaseClient,
  opts: {
    limit?: number;
    sinceHours?: number;
    /** Filter out rows where primary_topic IS NULL. */
    classifiedOnly?: boolean;
  } = {},
): Promise<ArticleWithSource[]> {
  const limit = opts.limit ?? 200;
  const sinceHours = opts.sinceHours ?? 24;
  const sinceIso = new Date(
    Date.now() - sinceHours * 3600 * 1000,
  ).toISOString();

  let q = client
    .from("articles")
    .select(ARTICLE_FIELDS)
    .gte("published_at", sinceIso)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(limit);
  if (opts.classifiedOnly) q = q.not("primary_topic", "is", null);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithSource[];
}

/**
 * Top "lead" stories for the Drudge-style banner: the most recent articles
 * from tier-1 sources, deduplicated by source so the lead and secondaries
 * come from different outlets. Returns up to `limit` items, freshest first.
 */
export async function listTopLeads(
  client: SupabaseClient,
  opts: { sinceHours?: number; limit?: number } = {},
): Promise<ArticleWithSource[]> {
  const sinceHours = opts.sinceHours ?? 24;
  const limit = opts.limit ?? 4;
  const sinceIso = new Date(
    Date.now() - sinceHours * 3600 * 1000,
  ).toISOString();

  // Pull a wider window than we need so we have material to dedupe by source.
  const { data, error } = await client
    .from("articles")
    .select(ARTICLE_FIELDS)
    .gte("published_at", sinceIso)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(80);

  if (error) throw error;

  const seen = new Set<string>();
  const leads: ArticleWithSource[] = [];
  for (const a of (data ?? []) as unknown as ArticleWithSource[]) {
    if (a.source?.tier !== 1) continue;
    const slug = a.source?.slug ?? "?";
    if (seen.has(slug)) continue;
    seen.add(slug);
    leads.push(a);
    if (leads.length >= limit) break;
  }
  return leads;
}

/**
 * Pull a window of recent articles and group them by source.category, with
 * a per-category cap so high-volume wires don't crowd out smaller desks.
 * Used by the home page to render an aggregator-style grouped layout.
 */
export async function listArticlesByTopic(
  client: SupabaseClient,
  opts: {
    sinceHours?: number;
    totalLimit?: number;
    perTopicLimit?: number;
  } = {},
): Promise<Map<string, ArticleWithSource[]>> {
  const sinceHours = opts.sinceHours ?? 24;
  const totalLimit = opts.totalLimit ?? 600;
  const perTopicLimit = opts.perTopicLimit ?? 12;

  const sinceIso = new Date(
    Date.now() - sinceHours * 3600 * 1000,
  ).toISOString();

  const { data, error } = await client
    .from("articles")
    .select(ARTICLE_FIELDS)
    .gte("published_at", sinceIso)
    .not("primary_topic", "is", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(totalLimit);

  if (error) throw error;

  const buckets = new Map<string, ArticleWithSource[]>();
  for (const a of (data ?? []) as unknown as ArticleWithSource[]) {
    const topic = a.primary_topic ?? "general";
    const bucket = buckets.get(topic) ?? [];
    if (bucket.length < perTopicLimit) {
      bucket.push(a);
      buckets.set(topic, bucket);
    }
  }
  return buckets;
}

/**
 * All articles for a single primary topic, freshest first. Used by the
 * dedicated per-topic pages (/military, /politics, etc.). Default window
 * is wider than the home (72h) to give topic pages meaningful depth.
 */
export async function listArticlesForTopic(
  client: SupabaseClient,
  topic: string,
  opts: { sinceHours?: number; limit?: number } = {},
): Promise<ArticleWithSource[]> {
  const sinceHours = opts.sinceHours ?? 72;
  const limit = opts.limit ?? 200;
  const sinceIso = new Date(
    Date.now() - sinceHours * 3600 * 1000,
  ).toISOString();

  const { data, error } = await client
    .from("articles")
    .select(ARTICLE_FIELDS)
    .eq("primary_topic", topic)
    .gte("published_at", sinceIso)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithSource[];
}

/** Current snapshot of every tracked market quote. Returns null if empty. */
export async function getMarketSnapshot(
  client: SupabaseClient,
): Promise<MarketQuoteRow[] | null> {
  const { data, error } = await client
    .from("market_quotes")
    .select("symbol, label, region, category, last, change_pct, note, as_of, fetched_at");
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data as MarketQuoteRow[];
}

/** Enabled sources, optionally filtered by tier. Used by the worker. */
export async function listEnabledSources(
  client: SupabaseClient,
  opts: { tier?: number; mode?: "rss" | "api" | "scrape" | "social" } = {},
): Promise<SourceRow[]> {
  let q = client.from("sources").select("*").eq("enabled", true);
  if (opts.tier !== undefined) q = q.eq("tier", opts.tier);
  if (opts.mode !== undefined) q = q.eq("mode", opts.mode);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as SourceRow[];
}
