/**
 * Source registry + scrapers — Phase 1.
 *
 * Will export:
 *   - SOURCES[]: the curated source list (English, mainland Chinese, Taiwan,
 *     Hong Kong) with slug, display name, country, language, rss_url
 *   - Per-outlet Playwright scrapers where RSS is unavailable
 *   - Robots-respecting fetch helpers with per-domain rate limits
 *
 * Used to seed the `sources` table and drive the ingestion loop.
 */

export type SourceCountry = "us" | "cn" | "tw" | "hk" | "intl";
export type SourceLang = "en" | "zh-cn" | "zh-tw";

export interface Source {
  slug: string;
  display_name: string;
  country: SourceCountry;
  lang: SourceLang;
  rss_url: string | null;
  enabled: boolean;
  notes?: string;
}

/** Seed registry — expand in Phase 1 ingestion work. */
export const SEED_SOURCES: readonly Source[] = [
  // English priority
  {
    slug: "reuters",
    display_name: "Reuters",
    country: "intl",
    lang: "en",
    rss_url: "https://www.reuters.com/world/asia-pacific/rss",
    enabled: true,
  },
  {
    slug: "ft",
    display_name: "Financial Times",
    country: "intl",
    lang: "en",
    rss_url: "https://www.ft.com/world/asia-pacific?format=rss",
    enabled: true,
  },
  {
    slug: "nikkei-asia",
    display_name: "Nikkei Asia",
    country: "intl",
    lang: "en",
    rss_url: "https://asia.nikkei.com/rss/feed/nar",
    enabled: true,
  },
  {
    slug: "focus-taiwan",
    display_name: "Focus Taiwan",
    country: "tw",
    lang: "en",
    rss_url: "https://focustaiwan.tw/RSS",
    enabled: true,
  },
  {
    slug: "taipei-times",
    display_name: "Taipei Times",
    country: "tw",
    lang: "en",
    rss_url: "https://www.taipeitimes.com/xml/index.rss",
    enabled: true,
  },

  // Mainland Chinese
  {
    slug: "xinhua",
    display_name: "新华社 Xinhua",
    country: "cn",
    lang: "zh-cn",
    rss_url: null,
    enabled: true,
    notes: "Scraper required (RSS deprecated).",
  },
  {
    slug: "people-daily",
    display_name: "人民日报 People's Daily",
    country: "cn",
    lang: "zh-cn",
    rss_url: null,
    enabled: true,
    notes: "Scraper required.",
  },
  {
    slug: "global-times-cn",
    display_name: "环球时报 Global Times (CN)",
    country: "cn",
    lang: "zh-cn",
    rss_url: null,
    enabled: true,
  },
  {
    slug: "caixin",
    display_name: "财新 Caixin",
    country: "cn",
    lang: "zh-cn",
    rss_url: null,
    enabled: true,
    notes: "Paywall; titles + lead extract only without subscription.",
  },
  {
    slug: "thepaper",
    display_name: "澎湃新闻 The Paper",
    country: "cn",
    lang: "zh-cn",
    rss_url: null,
    enabled: true,
  },

  // Taiwan press
  {
    slug: "udn",
    display_name: "聯合報 United Daily News",
    country: "tw",
    lang: "zh-tw",
    rss_url: "https://udn.com/rssfeed/news/2/6638?ch=news",
    enabled: true,
  },
  {
    slug: "liberty-times",
    display_name: "自由時報 Liberty Times",
    country: "tw",
    lang: "zh-tw",
    rss_url: "https://news.ltn.com.tw/rss/all.xml",
    enabled: true,
  },
];
