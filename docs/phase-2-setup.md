# Phase 2 setup — live ingestion

This walks through standing up the live ingestion pipeline. After this, the
dashboard `/feed` route will show real RSS-pulled articles, refreshed every
15 minutes by a GitHub Actions cron.

**Time:** ~20 minutes. **Cost:** $0 (Supabase free tier + GitHub Actions free tier).

---

## 1. Create the Supabase project

1. Sign in at <https://supabase.com>.
2. Click **New project**.
3. Name: `china-taiwan-monitor`. Region: closest to you (US-West, US-East, or AP-Northeast all fine).
4. Generate a strong database password — save it in your password manager. You won't need it for the workers (those use the service role key), but Supabase will ask for it later if you ever connect over postgres directly.
5. Wait ~2 minutes for provisioning.

## 2. Apply the schema migration

1. In the Supabase dashboard, open the project, then **SQL Editor → New query**.
2. Paste the contents of [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) and run it.
3. Confirm in **Table Editor** that you now have these tables: `sources`, `articles`, `briefs`, `posts`, `subscribers`.

## 3. Grab the project URL and keys

In **Project Settings → API** you'll see:

- **Project URL** — looks like `https://abcd1234.supabase.co`
- **`anon` `public` key** — long JWT. Safe to expose to the browser; RLS-gated.
- **`service_role` `secret` key** — long JWT. **Never expose to a browser**. This is what the workers use.

Keep all three handy.

## 4. Local env setup

In the repo root:

```bash
cp .env.example .env
```

Open `.env` and paste in:

```
SUPABASE_URL=https://<your-ref>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

The `.env` file is gitignored. Never commit it.

## 5. Seed the sources table

This mirrors the curated `@ctm/sources` registry (70+ outlets) into the
Supabase `sources` table. Run once.

```bash
export PATH="$HOME/.local/bin:$PATH"
pnpm --filter @ctm/db seed-sources
```

Expected output:

```
[seed-sources] upserting 75 sources...
[seed-sources] done. rows touched: 75
[seed-sources] enabled sources in DB: 75
```

Verify in Supabase → **Table Editor → sources** that rows are present.

## 6. Run the ingestion worker once locally

```bash
pnpm --filter @ctm/worker-ingestion start
```

Expected output (numbers will vary):

```
[ingest] starting pass · 42 enabled RSS sources · concurrency=6
[ingest] done in 18.3s · ok=38/42 inserted=812 dedup_skipped=0 failed=0
```

A few sources will fail on the first pass — paywalled feeds without proper
RSS, geo-blocked outlets, sites that need a real browser. The worker keeps
going. Health columns (`last_fetched_at`, `last_status`) on the `sources`
row tell you which feeds are unhealthy; check them in the Table Editor.

Inspect the `articles` table — you should see hundreds of rows.

## 7. Wire the dashboard to Supabase on Vercel

In the Vercel dashboard, open the `china-taiwan-monitor-dashboard` project
→ **Settings → Environment Variables**. Add four entries (Production,
Preview, and Development):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | your project URL |
| `SUPABASE_ANON_KEY` | your anon key |
| `NEXT_PUBLIC_SUPABASE_URL` | same as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same as `SUPABASE_ANON_KEY` |

Then trigger a redeploy (push any commit, or use the Vercel UI). The
`/feed` route will switch from seed mode to live mode automatically.

## 8. Wire the GitHub Actions cron

In the GitHub repo, open **Settings → Secrets and variables → Actions →
New repository secret**. Add two:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | your service-role key |

The cron workflow at [`.github/workflows/ingest.yml`](../.github/workflows/ingest.yml)
is already in the repo and runs every 15 minutes once secrets are set.

Verify in **Actions → Ingest articles** that the next scheduled run succeeds.
You can also click **Run workflow** to fire one manually.

## 9. Verify end-to-end

- **`/feed`** on the live dashboard should now show live article headlines.
- **Source health** — open the Supabase `sources` table and sort by
  `last_fetched_at desc`. Anything not refreshed in 30+ minutes is unhealthy.
- **Pace** — `articles` table should grow by ~500–2000 rows per day.

## 10. Disable bad feeds (as needed)

In the Supabase `sources` table:

- Set `enabled = false` on any feed that consistently fails.
- Open an issue / send a PR if a feed needs a different mode (likely
  `scrape` — that's Phase 3).

---

## What's not in Phase 2 (and when it lands)

| Capability | Phase | Notes |
|---|---|---|
| Chinese state news scraping (Xinhua, People's Daily, PLA Daily, TAO, MFA, MND) | 3 | Needs Playwright + scrape patterns per outlet. |
| Translation (ZH → EN) | 3 | Anthropic batched calls; cache by content hash. |
| Importance / sector scoring | 3 | Anthropic triage prompt; gates brief inclusion. |
| Brief generator on real data | 3 | Replaces seed brief on the homepage. |
| Story clustering | 4 | Embeddings; consolidates duplicate-story coverage. |
| Breaking-news fast path | 4 | Sub-5-minute path to X bot review queue. |
| X auto-post | 5 | Currently dry-run only. |
| Newsletter dispatch | 3 | Resend + Gmail draft to personal addresses. |
| Stripe + Auth | 5 | Required to start charging. |

See [`docs/ingestion-strategy.md`](./ingestion-strategy.md) for the full plan.

## Troubleshooting

**`SUPABASE_URL` is missing.** Check `.env` is in the repo root (not in `apps/`), and that you ran the worker command from the repo root.

**A specific feed errors with `feed timeout`.** That outlet's feed is slow or down. The worker isolates failures — other sources continue. Mark the row `enabled = false` if it's persistent.

**Worker inserts 0 articles on second run.** That's correct — the unique URL constraint + content-hash dedup means re-fetching the same items is a no-op.

**Articles in `articles` but `/feed` still says "Seed mode".** Vercel env vars not picked up. Trigger a redeploy after adding them.

**GitHub Actions run says "no enabled RSS sources".** Did you run `seed-sources` in step 5? It needs to run once before the worker has anything to poll.
