/**
 * Seed (or refresh) the `sources` table from @ctm/sources SEED_SOURCES.
 *
 * Usage:
 *   pnpm --filter @ctm/db seed-sources
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env (loaded from
 * .env or .env.local in the repo root).
 */

import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Walk up from this file's location looking for .env in the repo root.
// pnpm --filter runs scripts with cwd = package dir, not repo root, so
// dotenv/config alone wouldn't find it.
(function loadEnv() {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i++) {
    const p = join(dir, ".env");
    if (existsSync(p)) {
      loadDotenv({ path: p });
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
})();

import { SEED_SOURCES, type Source } from "@ctm/sources";
import { getServiceClient } from "../index.js";

function toRow(s: Source) {
  return {
    slug: s.slug,
    display_name: s.display_name,
    country: s.country,
    lang: s.lang,
    tier: s.tier,
    mode: s.mode,
    category: s.category,
    url: s.url,
    rss_url: s.rss_url ?? null,
    paywall: s.paywall ?? false,
    enabled: s.enabled,
    cadence_min: s.cadence_min ?? null,
    notes: s.notes ?? null,
  };
}

async function main() {
  const supabase = getServiceClient();
  const rows = SEED_SOURCES.map(toRow);
  const slugs = new Set(rows.map((r) => r.slug));

  console.log(`[seed-sources] upserting ${rows.length} sources...`);
  const { error, count } = await supabase
    .from("sources")
    .upsert(rows, { onConflict: "slug", count: "exact" });

  if (error) {
    console.error("[seed-sources] failed:", error.message);
    process.exit(1);
  }
  console.log(`[seed-sources] done. rows touched: ${count ?? rows.length}`);

  // Disable any DB rows whose slug is no longer in SEED_SOURCES — e.g., sources
  // that have been renamed or retired. We disable rather than delete so the
  // foreign-key reference from `articles.source_id` stays intact.
  const { data: dbRows } = await supabase
    .from("sources")
    .select("slug")
    .eq("enabled", true);
  const orphans = (dbRows ?? [])
    .map((r) => r.slug as string)
    .filter((s) => !slugs.has(s));
  if (orphans.length > 0) {
    console.log(
      `[seed-sources] disabling ${orphans.length} orphan slug(s): ${orphans.join(", ")}`,
    );
    await supabase.from("sources").update({ enabled: false }).in("slug", orphans);
  }

  const { count: enabledCount } = await supabase
    .from("sources")
    .select("*", { count: "exact", head: true })
    .eq("enabled", true);
  console.log(`[seed-sources] enabled sources in DB: ${enabledCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
