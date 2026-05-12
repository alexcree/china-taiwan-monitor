import { SEED_BRIEF } from "@ctm/brief-schema/seed";
import { toPublicBrief, type Brief, type PublicBrief } from "@ctm/brief-schema";

/**
 * Loads today's brief. In Phase 1 this returns the seed brief. In Phase 2+
 * this will read from Supabase (briefs table, latest brief_date <= today).
 */
export async function getLatestBrief(): Promise<Brief> {
  return SEED_BRIEF;
}

export async function getLatestPublicBrief(): Promise<PublicBrief> {
  return toPublicBrief(await getLatestBrief());
}
