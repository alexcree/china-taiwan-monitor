import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 23 instruments tracked on the dashboard market ticker. Each row maps a
 * Yahoo Finance symbol to a stable internal symbol used as the DB primary
 * key + the display label and region/category metadata.
 *
 * Display order on the ticker is preserved here.
 */
const INSTRUMENTS: ReadonlyArray<{
  yahoo: string;
  symbol: string;
  label: string;
  region: "cn" | "hk" | "tw" | "us" | "global";
  category: "equity" | "fx" | "commodity" | "rate" | "etf";
}> = [
  // Mainland China
  { yahoo: "000001.SS", symbol: "000001.SS", label: "SSE Composite", region: "cn", category: "equity" },
  { yahoo: "399001.SZ", symbol: "399001.SZ", label: "Shenzhen Component", region: "cn", category: "equity" },
  { yahoo: "000300.SS", symbol: "000300.SS", label: "CSI 300", region: "cn", category: "equity" },
  { yahoo: "000688.SS", symbol: "STAR50", label: "STAR 50", region: "cn", category: "equity" },
  // Hong Kong
  { yahoo: "^HSI", symbol: "HSI", label: "Hang Seng", region: "hk", category: "equity" },
  { yahoo: "^HSTECH", symbol: "HSTECH", label: "Hang Seng Tech", region: "hk", category: "equity" },
  { yahoo: "0700.HK", symbol: "0700.HK", label: "Tencent", region: "hk", category: "equity" },
  { yahoo: "9988.HK", symbol: "9988.HK", label: "Alibaba", region: "hk", category: "equity" },
  // Taiwan
  { yahoo: "^TWII", symbol: "TAIEX", label: "TAIEX", region: "tw", category: "equity" },
  { yahoo: "2330.TW", symbol: "2330.TW", label: "TSMC", region: "tw", category: "equity" },
  { yahoo: "2317.TW", symbol: "2317.TW", label: "Hon Hai", region: "tw", category: "equity" },
  // FX
  { yahoo: "CNH=X", symbol: "USDCNH", label: "USD/CNH", region: "cn", category: "fx" },
  { yahoo: "CNY=X", symbol: "USDCNY", label: "USD/CNY", region: "cn", category: "fx" },
  { yahoo: "TWD=X", symbol: "USDTWD", label: "USD/TWD", region: "tw", category: "fx" },
  { yahoo: "HKD=X", symbol: "USDHKD", label: "USD/HKD", region: "hk", category: "fx" },
  // US-listed China-exposure ETFs
  { yahoo: "KWEB", symbol: "KWEB", label: "KWEB · China Internet", region: "us", category: "etf" },
  { yahoo: "FXI", symbol: "FXI", label: "FXI · China Large-Cap", region: "us", category: "etf" },
  { yahoo: "MCHI", symbol: "MCHI", label: "MCHI · MSCI China", region: "us", category: "etf" },
  { yahoo: "EWT", symbol: "EWT", label: "EWT · MSCI Taiwan", region: "us", category: "etf" },
  // Semiconductor index
  { yahoo: "^SOX", symbol: "SOX", label: "PHLX Semiconductor", region: "us", category: "equity" },
  // Commodities
  { yahoo: "BZ=F", symbol: "BRENT", label: "Brent Crude", region: "global", category: "commodity" },
  { yahoo: "GC=F", symbol: "GOLD", label: "Gold", region: "global", category: "commodity" },
  { yahoo: "HG=F", symbol: "COPPER", label: "Copper", region: "global", category: "commodity" },
];

export interface MarketsResult {
  fetched: number;
  upserted: number;
  failed: number;
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36";

interface ChartMeta {
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketTime?: number;
  symbol?: string;
}

/**
 * Fetch a single quote via Yahoo's public chart endpoint. This endpoint does
 * not require the cookie/crumb dance that the v7 quote endpoint does and
 * remains reachable from worker contexts where the v7 endpoint gets blocked.
 */
async function fetchOne(yahooSymbol: string): Promise<ChartMeta | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    chart?: { result?: Array<{ meta?: ChartMeta }> };
  };
  return json.chart?.result?.[0]?.meta ?? null;
}

async function fetchOneWithRetry(
  yahooSymbol: string,
  attempts = 2,
): Promise<ChartMeta | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetchOne(yahooSymbol);
      if (r) return r;
    } catch {
      // fall through
    }
    if (i + 1 < attempts) await new Promise((s) => setTimeout(s, 600));
  }
  return null;
}

export async function refreshMarketQuotes(
  supabase: SupabaseClient,
): Promise<MarketsResult> {
  // Yahoo's chart endpoint tolerates a steady cadence but rate-limits
  // aggressively on burst concurrency. Serial requests with a small gap
  // (~300ms) reliably stay under the threshold from any IP we've seen.
  const GAP_MS = 300;
  const rows: Array<{
    symbol: string;
    label: string;
    region: string;
    category: string;
    last: number;
    change_pct: number;
    as_of: string;
  }> = [];
  let failed = 0;
  let fetched = 0;

  for (let i = 0; i < INSTRUMENTS.length; i++) {
    const inst = INSTRUMENTS[i]!;
    const meta = await fetchOneWithRetry(inst.yahoo);
    if (!meta) {
      failed++;
    } else {
      fetched++;
      const last = meta.regularMarketPrice;
      const prev = meta.chartPreviousClose ?? meta.previousClose;
      if (typeof last === "number" && typeof prev === "number" && prev !== 0) {
        const change_pct = ((last - prev) / prev) * 100;
        const asOf =
          typeof meta.regularMarketTime === "number" &&
          meta.regularMarketTime > 0
            ? new Date(meta.regularMarketTime * 1000).toISOString()
            : new Date().toISOString();
        rows.push({
          symbol: inst.symbol,
          label: inst.label,
          region: inst.region,
          category: inst.category,
          last,
          change_pct,
          as_of: asOf,
        });
      } else {
        failed++;
      }
    }
    if (i + 1 < INSTRUMENTS.length) {
      await new Promise((s) => setTimeout(s, GAP_MS));
    }
  }

  if (rows.length === 0) {
    return { fetched, upserted: 0, failed };
  }

  const { error } = await supabase
    .from("market_quotes")
    .upsert(rows, { onConflict: "symbol" });
  if (error) {
    console.warn(`[markets] upsert failed: ${error.message}`);
    return { fetched, upserted: 0, failed: INSTRUMENTS.length };
  }

  return { fetched, upserted: rows.length, failed };
}
