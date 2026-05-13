/**
 * Row types matching supabase/migrations/0001_init.sql. Hand-maintained for
 * now; in Phase 3 these can be replaced with `supabase gen types typescript`
 * output once the Supabase CLI is wired up.
 */

export type SourceCountry = "us" | "uk" | "cn" | "tw" | "hk" | "jp" | "intl";
export type SourceLang = "en" | "zh-cn" | "zh-tw";
export type SourceTier = 1 | 2 | 3 | 4;
export type SourceMode = "rss" | "api" | "scrape" | "social";
export type ArticleLang = SourceLang;

export interface SourceRow {
  id: string;
  slug: string;
  display_name: string;
  country: SourceCountry;
  lang: SourceLang;
  tier: SourceTier;
  mode: SourceMode;
  category: string;
  url: string;
  rss_url: string | null;
  paywall: boolean | null;
  enabled: boolean;
  cadence_min: number | null;
  notes: string | null;
  last_fetched_at: string | null;
  last_status: number | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: string;
  source_id: string | null;
  url: string;
  url_canonical: string | null;
  lang: ArticleLang;
  title_original: string;
  title_en: string | null;
  summary: string | null;
  summary_en: string | null;
  full_text: string | null;
  full_text_en: string | null;
  paywall: boolean | null;
  content_hash: string | null;
  dup_of: string | null;
  sectors: string[] | null;
  importance: number | null;
  breaking: boolean;
  triaged_at: string | null;
  posted_to_x: boolean;
  published_at: string | null;
  fetched_at: string;
  created_at: string;
}

export interface ArticleInsert {
  source_id?: string | null;
  url: string;
  url_canonical?: string | null;
  lang: ArticleLang;
  title_original: string;
  summary?: string | null;
  full_text?: string | null;
  paywall?: boolean | null;
  content_hash?: string | null;
  published_at?: string | null;
}

/**
 * ArticleRow joined with the source display fields the dashboard needs.
 * Produced by selecting `*, source:sources(slug, display_name, country, lang, paywall, category)`.
 */
export interface ArticleWithSource extends ArticleRow {
  source:
    | Pick<
        SourceRow,
        "slug" | "display_name" | "country" | "lang" | "paywall" | "category"
      >
    | null;
}
