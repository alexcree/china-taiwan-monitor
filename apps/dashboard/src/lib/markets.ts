import {
  SEED_MARKETS,
  type MarketQuote,
  type MarketSnapshot,
} from "@ctm/brief-schema";
import {
  getAnonClient,
  getMarketSnapshot,
  isDbConfigured,
  type MarketQuoteRow,
} from "@ctm/db";

/** Render order used on the ticker. Mirrors @ctm/brief-schema SEED_MARKETS. */
const ORDER: readonly string[] = SEED_MARKETS.quotes.map((q) => q.symbol);

function rowToQuote(r: MarketQuoteRow): MarketQuote {
  const q: MarketQuote = {
    symbol: r.symbol,
    label: r.label,
    region: r.region,
    category: r.category,
    last: r.last,
    change_pct: r.change_pct,
    as_of: r.as_of,
  };
  if (r.note) q.note = r.note;
  return q;
}

/**
 * Loads the latest market snapshot. Live data when configured (populated by
 * worker-ingestion's markets refresh step), seed snapshot otherwise.
 */
export async function getLatestMarkets(): Promise<MarketSnapshot> {
  if (isDbConfigured()) {
    const client = getAnonClient();
    if (client) {
      try {
        const rows = await getMarketSnapshot(client);
        if (rows && rows.length > 0) {
          const orderIndex = new Map<string, number>(
            ORDER.map((s, i) => [s, i]),
          );
          const quotes = rows
            .map(rowToQuote)
            .sort(
              (a, b) =>
                (orderIndex.get(a.symbol) ?? 999) -
                (orderIndex.get(b.symbol) ?? 999),
            );
          const asOf = quotes.reduce(
            (max, q) => (q.as_of > max ? q.as_of : max),
            "",
          );
          return {
            as_of: asOf || new Date().toISOString(),
            quotes,
            is_seed: false,
          };
        }
      } catch (err) {
        console.warn(
          "[markets] live read failed, falling back to seed:",
          err instanceof Error ? err.message : err,
        );
      }
    }
  }
  return SEED_MARKETS;
}
