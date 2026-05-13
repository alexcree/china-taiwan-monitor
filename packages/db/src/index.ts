import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ArticleWithSource, SourceRow } from "./types.js";

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

const SOURCE_FIELDS = "slug, display_name, country, lang, paywall, category";

const ARTICLE_FIELDS = `
  id, source_id, url, url_canonical, lang,
  title_original, title_en, summary, summary_en,
  paywall, content_hash, sectors, importance, breaking,
  published_at, fetched_at, created_at,
  source:sources(${SOURCE_FIELDS})
`;

/** Last N articles, freshest-first. Used by `/feed`. */
export async function listLatestArticles(
  client: SupabaseClient,
  limit = 60,
): Promise<ArticleWithSource[]> {
  const { data, error } = await client
    .from("articles")
    .select(ARTICLE_FIELDS)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as ArticleWithSource[];
}

/**
 * Pull a window of recent articles and group them by source.category, with
 * a per-category cap so high-volume wires don't crowd out smaller desks.
 * Used by the home page to render an aggregator-style grouped layout.
 */
export async function listArticlesByCategory(
  client: SupabaseClient,
  opts: {
    sinceHours?: number;
    totalLimit?: number;
    perCategoryLimit?: number;
  } = {},
): Promise<Map<string, ArticleWithSource[]>> {
  const sinceHours = opts.sinceHours ?? 36;
  const totalLimit = opts.totalLimit ?? 600;
  const perCategoryLimit = opts.perCategoryLimit ?? 12;

  const sinceIso = new Date(
    Date.now() - sinceHours * 3600 * 1000,
  ).toISOString();

  const { data, error } = await client
    .from("articles")
    .select(ARTICLE_FIELDS)
    .gte("published_at", sinceIso)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(totalLimit);

  if (error) throw error;

  const buckets = new Map<string, ArticleWithSource[]>();
  for (const a of (data ?? []) as unknown as ArticleWithSource[]) {
    const cat = a.source?.category ?? "general";
    const bucket = buckets.get(cat) ?? [];
    if (bucket.length < perCategoryLimit) {
      bucket.push(a);
      buckets.set(cat, bucket);
    }
  }
  return buckets;
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
