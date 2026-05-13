/**
 * Apply the China-Taiwan relevance filter to existing rows in `articles`
 * and delete those that fail. Run after expanding or tightening the
 * keyword set in @ctm/shared/relevance.
 *
 * Usage:
 *   pnpm --filter @ctm/db clean-irrelevant           # dry run, default
 *   pnpm --filter @ctm/db clean-irrelevant -- --apply  # actually delete
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

const PAGE = 500;

async function main() {
  const apply = process.argv.includes("--apply");
  const supabase = getServiceClient();

  let scanned = 0;
  let irrelevant: string[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title_original, summary, url")
      .range(offset, offset + PAGE - 1);
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    for (const row of data) {
      scanned++;
      if (
        !isChinaTaiwanRelevant({
          title: row.title_original,
          summary: row.summary,
          url: row.url,
        })
      ) {
        irrelevant.push(row.id as string);
      }
    }
    if (data.length < PAGE) break;
    offset += PAGE;
  }

  console.log(
    `[clean-irrelevant] scanned ${scanned}; ${irrelevant.length} fail filter.`,
  );

  if (!apply) {
    console.log(
      `[clean-irrelevant] dry run. re-invoke with -- --apply to delete.`,
    );
    return;
  }

  // Delete in batches; Supabase doesn't impose an `in` cap but big arrays
  // can hit URL length limits.
  let deleted = 0;
  const BATCH = 200;
  for (let i = 0; i < irrelevant.length; i += BATCH) {
    const batch = irrelevant.slice(i, i + BATCH);
    const { error } = await supabase.from("articles").delete().in("id", batch);
    if (error) {
      console.error("[clean-irrelevant] batch delete failed:", error.message);
      process.exit(1);
    }
    deleted += batch.length;
    process.stdout.write(`\r[clean-irrelevant] deleted ${deleted}/${irrelevant.length}`);
  }
  console.log(`\n[clean-irrelevant] done. deleted ${deleted} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
