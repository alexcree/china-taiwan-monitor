/**
 * One-off backfill: generate English summaries for every article in the
 * database that currently has summary_en IS NULL. Reuses the worker's
 * summarizer with the per-pass cap raised — loops until queue is empty.
 *
 * Usage:
 *   pnpm --filter @ctm/db backfill-summaries          # uses default 500/pass
 *   SUMMARIZER_MAX_PER_PASS=300 pnpm --filter @ctm/db backfill-summaries
 *
 * Requires ANTHROPIC_API_KEY + SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in
 * .env at the repo root.
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
      loadDotenv({ path: p, override: true });
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
})();

// Default the per-pass cap higher for backfill than for the cron worker.
if (!process.env.SUMMARIZER_MAX_PER_PASS) {
  process.env.SUMMARIZER_MAX_PER_PASS = "500";
}

import { getServiceClient } from "../index.js";
import { summarizeNewArticles } from "@ctm/llm";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "[backfill] ANTHROPIC_API_KEY missing in .env. Aborting.",
    );
    process.exit(1);
  }

  const supabase = getServiceClient();

  const { count: total } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .is("summary_en", null);
  console.log(`[backfill] ${total ?? "?"} articles need summaries.`);

  let totalWritten = 0;
  let totalFailed = 0;
  let passes = 0;
  while (true) {
    passes++;
    const r = await summarizeNewArticles(supabase);
    console.log(
      `[backfill] pass ${passes}: attempted=${r.attempted} written=${r.written} failed=${r.failed} batches=${r.batches}`,
    );
    totalWritten += r.written;
    totalFailed += r.failed;
    if (r.attempted === 0) break;
    // Brief pause between passes to be gentle on the API.
    await new Promise((s) => setTimeout(s, 1000));
  }

  console.log(
    `\n[backfill] done. passes=${passes} written=${totalWritten} failed=${totalFailed}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
