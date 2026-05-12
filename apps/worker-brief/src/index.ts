/**
 * Brief generator — Phase 2 (not yet implemented).
 *
 * Runs daily at 06:00 local via Vercel Cron:
 *   1. Pull articles from last 36 hours with importance >= 5.
 *   2. Group by sector.
 *   3. Pass 1 — per-sector LLM call (`claude-opus-4-7`) with analyst.system.md
 *      and sector articles. Strict JSON output matching SectorBriefSchema.
 *   4. Pass 2 — synthesis LLM call producing exec_summary, assessments,
 *      indicators, scenarios, escalation, bottom_line, cross_sector_synthesis.
 *   5. Validate against BriefSchema (zod). Persist to `briefs`.
 *   6. Fire downstream events: newsletter, dashboard cache bust, X recap.
 *
 * The analyst system prompt is in /docs/analyst-system-prompt.md and must
 * be used verbatim. Use prompt caching on the system prompt across runs.
 */

import { BriefSchema } from "@ctm/brief-schema";

async function main() {
  console.log("[brief] not yet implemented — Phase 2");
  console.log("[brief] schema validator loaded:", typeof BriefSchema.parse);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
