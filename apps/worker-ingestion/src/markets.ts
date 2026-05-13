import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Market quotes are pulled from TradingView's public scanner endpoint. The
 * endpoint accepts a list of exchange-prefixed tickers and returns last
 * price + percent change in a single POST — no auth, no key, no
 * cookie/crumb dance. Both Yahoo Finance's v8/chart endpoint and Yahoo's
 * v7/quote endpoint were rate-limiting our IPs aggressively (including
 * GitHub Actions runners) so we moved off them.
 *
 * Each instrument below maps its dashboard symbol/label to a TradingView
 * exchange ticker. Display order on the ticker is the array order.
 */
const INSTRUMENTS: ReadonlyArray<{
  tv: string;
  symbol: string;
  label: string;
  region: "cn" | "hk" | "tw" | "us" | "global";
  category: "equity" | "fx" | "commodity" | "rate" | "etf";
}> = [
  // Mainland China
  { tv: "SSE:000001", symbol: "000001.SS", label: "SSE Composite", region: "cn", category: "equity" },
  { tv: "SZSE:399001", symbol: "399001.SZ", label: "Shenzhen Component", region: "cn", category: "equity" },
  { tv: "SSE:000300", symbol: "000300.SS", label: "CSI 300", region: "cn", category: "equity" },
  // Hong Kong
  { tv: "TVC:HSI", symbol: "HSI", label: "Hang Seng", region: "hk", category: "equity" },
  { tv: "HSI:HSTECH", symbol: "HSTECH", label: "Hang Seng Tech", region: "hk", category: "equity" },
  { tv: "HKEX:700", symbol: "0700.HK", label: "Tencent", region: "hk", category: "equity" },
  { tv: "HKEX:9988", symbol: "9988.HK", label: "Alibaba", region: "hk", category: "equity" },
  // Taiwan
  { tv: "TWSE:2330", symbol: "2330.TW", label: "TSMC", region: "tw", category: "equity" },
  { tv: "TWSE:2317", symbol: "2317.TW", label: "Hon Hai", region: "tw", category: "equity" },
  // FX
  { tv: "FX_IDC:USDCNH", symbol: "USDCNH", label: "USD/CNH", region: "cn", category: "fx" },
  { tv: "FX_IDC:USDCNY", symbol: "USDCNY", label: "USD/CNY", region: "cn", category: "fx" },
  { tv: "FX_IDC:USDTWD", symbol: "USDTWD", label: "USD/TWD", region: "tw", category: "fx" },
  { tv: "FX_IDC:USDHKD", symbol: "USDHKD", label: "USD/HKD", region: "hk", category: "fx" },
  // US-listed China-exposure ETFs
  { tv: "AMEX:KWEB", symbol: "KWEB", label: "KWEB · China Internet", region: "us", category: "etf" },
  { tv: "AMEX:FXI", symbol: "FXI", label: "FXI · China Large-Cap", region: "us", category: "etf" },
  { tv: "NASDAQ:MCHI", symbol: "MCHI", label: "MCHI · MSCI China", region: "us", category: "etf" },
  { tv: "AMEX:EWT", symbol: "EWT", label: "EWT · MSCI Taiwan", region: "us", category: "etf" },
  // Semiconductor index
  { tv: "NASDAQ:SOX", symbol: "SOX", label: "PHLX Semiconductor", region: "us", category: "equity" },
  // Commodities
  { tv: "NYMEX:BZ1!", symbol: "BRENT", label: "Brent Crude", region: "global", category: "commodity" },
  { tv: "COMEX:GC1!", symbol: "GOLD", label: "Gold", region: "global", category: "commodity" },
  { tv: "COMEX:HG1!", symbol: "COPPER", label: "Copper", region: "global", category: "commodity" },
];

export interface MarketsResult {
  fetched: number;
  upserted: number;
  failed: number;
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36";

interface ScanRow {
  s: string;
  d: [number | null, number | null];
}

export async function refreshMarketQuotes(
  supabase: SupabaseClient,
): Promise<MarketsResult> {
  const tickers = INSTRUMENTS.map((i) => i.tv);
  const body = JSON.stringify({
    symbols: { tickers, query: { types: [] } },
    columns: ["close", "change"],
  });

  let payload: { totalCount: number; data: ScanRow[] };
  try {
    const res = await fetch("https://scanner.tradingview.com/global/scan", {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://www.tradingview.com",
        Referer: "https://www.tradingview.com/",
      },
      body,
    });
    if (!res.ok) {
      console.warn(`[markets] tv scan returned ${res.status}`);
      return { fetched: 0, upserted: 0, failed: INSTRUMENTS.length };
    }
    payload = (await res.json()) as typeof payload;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[markets] tv fetch failed: ${msg}`);
    return { fetched: 0, upserted: 0, failed: INSTRUMENTS.length };
  }

  const byTicker = new Map<string, ScanRow>();
  for (const row of payload.data ?? []) byTicker.set(row.s, row);

  const asOf = new Date().toISOString();
  const rows: Array<{
    symbol: string;
    label: string;
    region: string;
    category: string;
    last: number;
    change_pct: number;
    as_of: string;
  }> = [];
  let fetched = 0;
  let failed = 0;

  for (const inst of INSTRUMENTS) {
    const row = byTicker.get(inst.tv);
    if (!row || row.d[0] == null || row.d[1] == null) {
      failed++;
      continue;
    }
    fetched++;
    rows.push({
      symbol: inst.symbol,
      label: inst.label,
      region: inst.region,
      category: inst.category,
      last: row.d[0],
      change_pct: row.d[1],
      as_of: asOf,
    });
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
