import { SEED_MARKETS, type MarketSnapshot } from "@ctm/brief-schema";

/**
 * Loads the latest market snapshot. Phase 1 returns seed data; Phase 2+ will
 * read from a `market_quotes` table fed by a real-time worker.
 */
export async function getLatestMarkets(): Promise<MarketSnapshot> {
  return SEED_MARKETS;
}
