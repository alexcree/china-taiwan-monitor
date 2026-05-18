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

import { createClient } from "@supabase/supabase-js";
import { clusterArticles, type ClusterInput } from "@ctm/shared";

async function main() {
  const c = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data } = await c
    .from("articles")
    .select("id, summary_en, title_original")
    .gte("published_at", since)
    .not("primary_topic", "is", null)
    .limit(1000);
  const rows = data ?? [];
  console.log("articles in 24h corpus:", rows.length);

  const inputs: ClusterInput[] = rows.map((a) => ({
    id: a.id as string,
    text: ((a.summary_en as string) ?? (a.title_original as string) ?? "").trim(),
  }));

  for (const thresh of [0.45, 0.35, 0.3, 0.25, 0.2, 0.15]) {
    const res = clusterArticles(inputs, { threshold: thresh });
    const sizes = [...res.members.values()].map((m) => m.length).sort((a, b) => b - a);
    const multi = sizes.filter((s) => s > 1).length;
    const top = sizes.slice(0, 8).join(",");
    console.log(
      `thresh=${thresh.toFixed(2)}  clusters=${sizes.length}  multi=${multi}  topSizes=${top}`,
    );
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
