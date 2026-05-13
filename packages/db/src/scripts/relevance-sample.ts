/**
 * One-off: print a sample of articles that pass vs. fail the relevance
 * filter, for spot-checking the keyword set before deletion.
 *
 * Usage:
 *   pnpm --filter @ctm/db relevance-sample
 */

import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

import { isChinaTaiwanRelevant } from "@ctm/shared";
import { getServiceClient } from "../index.js";

async function main() {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("articles")
    .select("title_original, url, source:sources(slug)")
    .order("published_at", { ascending: false })
    .limit(800);

  const fails: Array<{ title: string; src: string }> = [];
  const passes: Array<{ title: string; src: string }> = [];
  for (const row of data ?? []) {
    const ok = isChinaTaiwanRelevant({
      title: row.title_original,
      url: row.url,
    });
    const src = (row.source as { slug?: string } | null)?.slug ?? "?";
    const entry = { title: row.title_original as string, src };
    (ok ? passes : fails).push(entry);
  }

  console.log("=== 15 sample FAILS (would be deleted) ===");
  for (const r of fails.slice(0, 15))
    console.log(`  [${r.src}] ${r.title.slice(0, 110)}`);
  console.log("\n=== 15 sample PASSES (kept) ===");
  for (const r of passes.slice(0, 15))
    console.log(`  [${r.src}] ${r.title.slice(0, 110)}`);
  console.log(`\nTotals: pass=${passes.length}, fail=${fails.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
