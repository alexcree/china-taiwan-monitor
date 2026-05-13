import { z } from "zod";

export const MarketRegionSchema = z.enum(["cn", "hk", "tw", "us", "global"]);
export type MarketRegion = z.infer<typeof MarketRegionSchema>;

export const MarketCategorySchema = z.enum([
  "equity",
  "fx",
  "commodity",
  "rate",
  "etf",
]);
export type MarketCategory = z.infer<typeof MarketCategorySchema>;

export const MarketQuoteSchema = z.object({
  symbol: z.string().min(1),
  label: z.string().min(1),
  region: MarketRegionSchema,
  category: MarketCategorySchema,
  last: z.number(),
  change_pct: z.number(),
  as_of: z.string().datetime(),
  /** Optional contextual note — e.g., "halted", "after-hours". */
  note: z.string().optional(),
});
export type MarketQuote = z.infer<typeof MarketQuoteSchema>;

export const MarketSnapshotSchema = z.object({
  as_of: z.string().datetime(),
  quotes: z.array(MarketQuoteSchema),
  /** Indicates the data is placeholder/seed, not live. */
  is_seed: z.boolean().default(false),
});
export type MarketSnapshot = z.infer<typeof MarketSnapshotSchema>;

/**
 * Seed market snapshot for dashboard development. Replace with a real-time
 * worker (e.g., reading from Alpha Vantage / Yahoo / TWSE / SSE feeds and
 * caching to a `market_quotes` table) in Phase 2.
 *
 * Values are illustrative — do not rely on these for any real-world signal.
 */
export const SEED_MARKETS: MarketSnapshot = {
  as_of: "2026-05-12T08:30:00.000Z",
  is_seed: true,
  quotes: [
    // Mainland China equities
    {
      symbol: "000001.SS",
      label: "SSE Composite",
      region: "cn",
      category: "equity",
      last: 3187.42,
      change_pct: -0.62,
      as_of: "2026-05-12T07:30:00.000Z",
    },
    {
      symbol: "399001.SZ",
      label: "Shenzhen Component",
      region: "cn",
      category: "equity",
      last: 10218.05,
      change_pct: -0.84,
      as_of: "2026-05-12T07:30:00.000Z",
    },
    {
      symbol: "000300.SS",
      label: "CSI 300",
      region: "cn",
      category: "equity",
      last: 3811.66,
      change_pct: -0.61,
      as_of: "2026-05-12T07:30:00.000Z",
    },
    {
      symbol: "STAR50",
      label: "STAR 50",
      region: "cn",
      category: "equity",
      last: 1043.7,
      change_pct: -1.18,
      as_of: "2026-05-12T07:30:00.000Z",
    },

    // Hong Kong equities
    {
      symbol: "HSI",
      label: "Hang Seng",
      region: "hk",
      category: "equity",
      last: 19842.31,
      change_pct: -1.82,
      as_of: "2026-05-12T08:10:00.000Z",
    },
    {
      symbol: "HSTECH",
      label: "Hang Seng Tech",
      region: "hk",
      category: "equity",
      last: 4317.06,
      change_pct: -2.41,
      as_of: "2026-05-12T08:10:00.000Z",
    },
    {
      symbol: "0700.HK",
      label: "Tencent",
      region: "hk",
      category: "equity",
      last: 387.4,
      change_pct: -2.18,
      as_of: "2026-05-12T08:10:00.000Z",
    },
    {
      symbol: "9988.HK",
      label: "Alibaba",
      region: "hk",
      category: "equity",
      last: 80.95,
      change_pct: -2.65,
      as_of: "2026-05-12T08:10:00.000Z",
    },

    // Taiwan equities
    {
      symbol: "TAIEX",
      label: "TAIEX",
      region: "tw",
      category: "equity",
      last: 19284.91,
      change_pct: -0.43,
      as_of: "2026-05-12T05:30:00.000Z",
    },
    {
      symbol: "2330.TW",
      label: "TSMC",
      region: "tw",
      category: "equity",
      last: 982.0,
      change_pct: -0.71,
      as_of: "2026-05-12T05:30:00.000Z",
    },
    {
      symbol: "2317.TW",
      label: "Hon Hai",
      region: "tw",
      category: "equity",
      last: 192.5,
      change_pct: -0.78,
      as_of: "2026-05-12T05:30:00.000Z",
    },

    // FX
    {
      symbol: "USDCNH",
      label: "USD/CNH",
      region: "cn",
      category: "fx",
      last: 7.3247,
      change_pct: 0.38,
      as_of: "2026-05-12T08:25:00.000Z",
    },
    {
      symbol: "USDCNY",
      label: "USD/CNY",
      region: "cn",
      category: "fx",
      last: 7.3018,
      change_pct: 0.21,
      as_of: "2026-05-12T08:25:00.000Z",
    },
    {
      symbol: "USDTWD",
      label: "USD/TWD",
      region: "tw",
      category: "fx",
      last: 32.41,
      change_pct: 0.18,
      as_of: "2026-05-12T08:25:00.000Z",
    },
    {
      symbol: "USDHKD",
      label: "USD/HKD",
      region: "hk",
      category: "fx",
      last: 7.812,
      change_pct: 0.02,
      as_of: "2026-05-12T08:25:00.000Z",
    },

    // US-listed China-exposure ETFs
    {
      symbol: "KWEB",
      label: "KWEB · China Internet",
      region: "us",
      category: "etf",
      last: 28.41,
      change_pct: -2.93,
      as_of: "2026-05-11T20:00:00.000Z",
    },
    {
      symbol: "FXI",
      label: "FXI · China Large-Cap",
      region: "us",
      category: "etf",
      last: 32.07,
      change_pct: -1.84,
      as_of: "2026-05-11T20:00:00.000Z",
    },
    {
      symbol: "MCHI",
      label: "MCHI · MSCI China",
      region: "us",
      category: "etf",
      last: 48.92,
      change_pct: -2.11,
      as_of: "2026-05-11T20:00:00.000Z",
    },
    {
      symbol: "EWT",
      label: "EWT · MSCI Taiwan",
      region: "us",
      category: "etf",
      last: 56.84,
      change_pct: -0.62,
      as_of: "2026-05-11T20:00:00.000Z",
    },

    // Semiconductor index (drives Taiwan equity risk)
    {
      symbol: "SOX",
      label: "PHLX Semiconductor",
      region: "us",
      category: "equity",
      last: 5183.27,
      change_pct: -1.27,
      as_of: "2026-05-11T20:00:00.000Z",
    },

    // Rates
    {
      symbol: "CN10Y",
      label: "China 10Y Yield",
      region: "cn",
      category: "rate",
      last: 2.187,
      change_pct: -1.4,
      as_of: "2026-05-12T07:30:00.000Z",
      note: "yield, bp move shown as pct of level",
    },

    // Commodities
    {
      symbol: "BRENT",
      label: "Brent Crude",
      region: "global",
      category: "commodity",
      last: 78.43,
      change_pct: 0.62,
      as_of: "2026-05-12T08:25:00.000Z",
    },
    {
      symbol: "GOLD",
      label: "Gold",
      region: "global",
      category: "commodity",
      last: 2417.5,
      change_pct: 0.41,
      as_of: "2026-05-12T08:25:00.000Z",
    },
    {
      symbol: "COPPER",
      label: "Copper",
      region: "global",
      category: "commodity",
      last: 4.682,
      change_pct: -0.83,
      as_of: "2026-05-12T08:25:00.000Z",
    },
  ],
};
