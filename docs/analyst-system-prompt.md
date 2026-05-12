# Build: Daily China–Taiwan Intelligence System

## Mission

Build an end-to-end system that produces a daily, classified-style intelligence brief on China–Taiwan developments and distributes it through three channels:

1. **Live web dashboard** — public, always free. The brand-building front door.
2. **Email newsletter** — paid premium product. Deeper coverage, annotated analyst commentary, expanded source summaries, and synthesis between sectors.
3. **X auto-posting bot** — reposts critical stories with short analytical context. Drives traffic to the dashboard and conversions to the newsletter.

Coverage spans defense, politics, diplomacy, economy/finance, technology (semis/AI/cyber), property, consumer/business, and influence ops. Sources are deliberately mixed — major English wires, Chinese mainland state and independent media, and Taiwan press. The analytical engine is the prompt in `analyst.system.md` (embedded at bottom of this doc).

**Business model:** dashboard always free, supported by newsletter subscriptions. The brief generator produces a single deep, annotated version of the brief. The newsletter renders it in full. The dashboard renders a lighter public view — top sources per section, summary bullets, no extended analyst commentary, no scenarios detail. One generation, two presentations.

This is a multi-phase build. Start with Phase 1. Ask for keys/credentials at the right time — don't block on them up front. Confirm stack choices before scaffolding.

---

## Architecture

```
[ ingestion workers ] ─┐
   RSS / API / scrape  │
                       ▼
              [ articles table ]  ←─ translation worker
                       │
                       ▼
            [ importance scorer ]  (LLM, batched)
                       │
                       ▼ (06:00 daily)
             [ brief generator ]  (LLM, claude-opus-4-7)
                       │
                       ▼
                [ briefs table ]
                  /    |    \
                 ▼     ▼     ▼
          newsletter  dashboard  X bot
```

One shared data backbone, three output adapters. Brief generation runs once per day; the dashboard reads live; the X bot reacts to breaking-importance flags continuously.

---

## Tech stack (proposed — confirm before scaffolding)

- **Workers / ingestion:** TypeScript + Node (unified codebase with dashboard) OR Python if you want pandas/translation flexibility. Default to TypeScript unless there's a reason to split.
- **DB:** Supabase (Postgres + realtime + auth + storage in one)
- **Dashboard:** Next.js 15 App Router, Tailwind, shadcn/ui, deployed to Vercel
- **LLM:** Anthropic API, model `claude-opus-4-7`. Use prompt caching for the system prompt across daily runs.
- **Translation:** Anthropic API for Chinese → English (one model, one bill). Cache by URL hash.
- **Email:** Resend for the newsletter. Also drop a Gmail draft to `alex@mosaic.it` and `alexcree@gmail.com` (preserve existing workflow).
- **Payments:** Stripe for newsletter subscriptions. Stripe Customer Portal for self-serve manage/cancel. No payment UI to build beyond a checkout button.
- **Auth:** Supabase Auth, but only for newsletter subscribers and admin. Dashboard is fully public and unauthenticated.
- **X:** X API v2, write tier. Manual review queue for first two weeks.
- **Scheduling:** Vercel Cron for the 06:00 brief job and the daily X recap; Railway or a small VPS for the 15-minute ingestion loop (Vercel Cron is too coarse for that).
- **Secrets:** env vars only. No keys in repo.

---

## Repository layout

Monorepo with pnpm workspaces:

```
apps/
  dashboard/           Next.js
  worker-ingestion/    pulls articles
  worker-brief/        generates daily brief
  worker-newsletter/   formats + sends
  worker-x-bot/        posts to X
packages/
  db/                  Supabase client + types
  llm/                 Anthropic client + prompt templates
  sources/             RSS feeds, source registry, scrapers
  brief-schema/        JSON schema + zod validators
  shared/              utilities, logging, types
```

---

## Data model

```sql
sources (
  id            uuid pk,
  slug          text unique,           -- "reuters", "xinhua"
  display_name  text,                  -- "Reuters", "新华社 Xinhua"
  country       text,                  -- "us", "cn", "tw", "hk", "intl"
  lang          text,                  -- "en", "zh-cn", "zh-tw"
  rss_url       text,
  enabled       bool default true,
  notes         text
)

articles (
  id             uuid pk,
  source_id      uuid fk → sources,
  url            text unique,
  title_original text,
  title_en       text,                 -- = title_original if already English
  summary        text,                 -- LLM 1–2 sentence extract
  full_text      text,
  full_text_en   text,                 -- translation if needed
  published_at   timestamptz,
  fetched_at     timestamptz default now(),
  sectors        text[],               -- ["defense","tech"]
  importance     int,                  -- 1–10 LLM-scored
  breaking       bool default false,
  posted_to_x    bool default false
)

briefs (
  id              uuid pk,
  brief_date      date unique,
  exec_summary    jsonb,               -- string[]
  sections        jsonb,               -- { defense: {...}, politics: {...}, ... }
  assessments     jsonb,               -- { judgment, confidence, reasoning }[]
  indicators      jsonb,               -- { text, rationale }[]
  scenarios       jsonb,               -- { name, probability, triggers, implications, analyst_note }[]
  escalation_risk text,                -- "low" | "moderate" | "high"
  escalation_rationale text,           -- newsletter-only: why this risk level
  bottom_line     text,
  bottom_line_extended text,           -- newsletter-only: longer version
  source_notes    text,
  cross_sector_synthesis text,         -- newsletter-only: connective analysis
  generated_at    timestamptz default now()
)

posts (
  id          uuid pk,
  brief_id    uuid fk → briefs null,
  article_id  uuid fk → articles null,
  channel     text,                    -- "x" | "email" | "dashboard"
  content     text,
  external_id text,                    -- tweet ID, message ID
  status      text,                    -- "queued" | "sent" | "failed" | "review"
  posted_at   timestamptz
)

subscribers (
  id                  uuid pk,
  email               text unique,
  stripe_customer_id  text,
  stripe_sub_id       text,
  status              text,            -- "active" | "past_due" | "canceled" | "trialing"
  current_period_end  timestamptz,
  created_at          timestamptz default now()
)
```

Each `sections` entry follows the analyst prompt's per-sector structure: `{ summary: string[], analyst_note: string, english_sources: AnnotatedArticle[], chinese_sources: AnnotatedArticle[] }`. `AnnotatedArticle` carries both a short summary (used on the dashboard) and an extended annotated summary (used in the newsletter). The dashboard view filters to the top 5 sources per section and hides `analyst_note`, `extended_summary`, and `cross_sector_synthesis`. The newsletter renders everything.

---

## Source registry

Seed `sources` table with at minimum the following. Prefer RSS where available; otherwise Playwright scraper module per outlet.

**English priority:** Reuters, Bloomberg, Financial Times, Nikkei Asia, WSJ, Foreign Policy, War on the Rocks, CSIS commentary, Brookings, Lawfare, SCMP, Taipei Times, Focus Taiwan, Defense News, Breaking Defense, Janes, The Diplomat, Asia Times.

**Mainland Chinese:** Xinhua 新华社, People's Daily 人民日报, Global Times 环球时报, Caixin 财新, Sina 新浪, Tencent News 腾讯新闻, Yicai 第一财经, 21st Century Business Herald 21世纪经济报道, Guancha 观察者网, Phoenix 凤凰网, The Paper 澎湃新闻.

**Taiwan:** United Daily News 联合报, Liberty Times 自由时报, China Times 中国时报, CNA 中央社, Storm Media 风传媒, NewTalk 新头壳.

**Hong Kong / regional:** HK01, Initium 端传媒, Ming Pao 明报, Nikkei Asia (already listed).

Ingestion worker runs every 15 min. Respects robots.txt and per-domain rate limits. Skips duplicate URLs. Stores raw HTML + extracted text.

---

## Ingestion → enrichment pipeline

For each new article:

1. **Fetch** — RSS or scrape, store raw + extracted text.
2. **Translate** — if `lang !== 'en'`, translate title and a 300-word lead via `claude-opus-4-7`. Cache result.
3. **Score + tag** — single LLM call per article (batched 10 at a time for cost): returns `{ sectors[], importance, breaking, summary }`. Use a small, cheap prompt with strict JSON output.
4. **Flag breaking** — if `importance >= 8` AND `breaking === true`, enqueue to X bot review queue.

Scoring prompt should bias toward escalation signals, novel policy moves, and market-moving events. Calibrate weekly against actual brief inclusion rates.

---

## Brief generation (the analyst engine)

Cron: 06:00 local, daily. Produces ONE deep, annotated brief. Dashboard and newsletter are two presentations of the same brief.

1. Pull all articles from last 36 hours with `importance >= 5`.
2. Group by sector.
3. **Pass 1 — per sector:** call `claude-opus-4-7` with `analyst.system.md` (below) + the sector's articles as structured user input. Require strict JSON output matching `sections[sector]` schema, including the `analyst_note` field and both short + extended summaries per source.
4. **Pass 2 — synthesis:** feed all sector outputs back to `claude-opus-4-7` with a synthesis prompt that produces `exec_summary`, `assessments` (with reasoning), `indicators` (with rationale), `scenarios` (with analyst notes), `escalation_risk`, `escalation_rationale`, `bottom_line`, `bottom_line_extended`, `cross_sector_synthesis`, `source_notes`.
5. Validate against zod schema. Persist to `briefs`.
6. Fire downstream events: newsletter dispatch (full version), dashboard cache bust (rendered light), X recap thread.

**Critical:** the analyst prompt does NOT fetch its own sources. Articles are injected as structured input. This eliminates hallucinated links — the only URLs the model can output are URLs in its input.

**Presentation split (handled at render time, not generation time):**

| Field | Dashboard (free) | Newsletter (paid) |
|---|---|---|
| `exec_summary` | ✅ | ✅ |
| `escalation_risk` badge | ✅ | ✅ |
| `escalation_rationale` | ❌ | ✅ |
| `bottom_line` | ✅ | ✅ |
| `bottom_line_extended` | ❌ | ✅ |
| Per-sector `summary` bullets | ✅ | ✅ |
| Per-sector `analyst_note` | ❌ | ✅ |
| Source list per sector | Top 5 (mixed EN/ZH) | Full 8–20 |
| Source summaries | Short (1 sentence) | Extended (3–4 sentences, annotated) |
| `assessments` | judgment + confidence only | + reasoning |
| `indicators` | text only | + rationale |
| `scenarios` | name + probability + 1-line | + triggers, implications, analyst note |
| `cross_sector_synthesis` | ❌ | ✅ |
| `source_notes` | ✅ (brief) | ✅ (full) |

---

## Output 1 — Newsletter (paid, premium)

This is the revenue product. The dashboard sells it; the newsletter justifies the price.

**What subscribers get that the dashboard doesn't:**

- Full source list per sector (8–20 articles, EN + ZH) vs dashboard's top 5
- Extended annotated summaries on every source (3–4 sentences each, with analyst framing)
- Per-sector "Analyst note" paragraph synthesizing what the sources collectively mean
- Cross-sector synthesis — how today's defense moves connect to today's economy moves
- Full reasoning behind each assessment
- Rationale behind each forward indicator
- Detailed scenarios with triggers, implications, and analyst commentary
- `escalation_rationale` — why the risk level is what it is
- `bottom_line_extended` — longer version of the takeaway

**Rendering:**

- Renderer: React Email or MJML, with plain-text fallback.
- Layout: exec summary → escalation risk badge + rationale → extended bottom line → expandable sectors (each with analyst note → summary bullets → annotated sources) → cross-sector synthesis → assessments with reasoning → indicators with rationale → scenarios → source notes.
- Subject: `China–Taiwan Brief — {date} — Risk: {escalation_risk}`
- Volume-numbered from first send (match existing Mosaic Industry Watch / MagThread pattern).
- Mobile-optimized. Single column. System font stack.

**Dispatch:**

- Send to `subscribers` where `status = 'active'`.
- Always drop a Gmail draft to `alex@mosaic.it` + `alexcree@gmail.com` regardless of subscriber send (preserve the personal review loop).
- Stripe webhooks update `subscribers.status` on payment events. Past-due subscribers get a 7-day grace before cutoff.

**Pricing (placeholder, confirm later):** monthly + annual tiers via Stripe. Optional 7-day free trial. No free newsletter tier — dashboard is the free product.

---

## Output 2 — Live dashboard (public, always free)

This is the marketing surface. Strong on its own, but designed to convert serious readers to the newsletter.

**Routes (all public, no auth):**

- `/` — today's brief, lighter version per the presentation split table above. Persistent "Subscribe for the full brief" CTA in header and after exec summary.
- `/archive` — past briefs, searchable by date, sector, keyword. Full history, free.
- `/feed` — live article stream, last 24h, filter by sector / language / country.
- `/indicators` — running tracker of forward indicators across briefs. First appearance, supporting articles. Newsletter-only: rationale + analyst notes are hidden behind a teaser ("Read the analyst's reasoning in today's newsletter →").
- `/scenarios` — rolling scenarios with probability shifts over time. Light version.
- `/sources` — registry view with last-fetch timestamp and article count.
- `/about` — methodology, source list, contact.
- `/feed.xml` — RSS of daily brief summaries (light version).

**Conversion surface:**

- Header CTA: "Subscribe to the full daily brief"
- Inline teasers where premium content is gated: "Analyst note (newsletter subscribers) →"
- Footer signup form on every page
- Post-archive paywall teasers ("This brief's full analysis goes deeper in the newsletter version")
- Stripe Checkout button → success page → magic-link login for subscriber portal at `/account`

**Authenticated routes (subscribers + admin only):**

- `/account` — subscription status, Stripe Customer Portal link, email preferences
- `/admin/queue` — X bot review queue (admin only)
- `/admin/briefs` — manual brief regeneration, source toggles (admin only)

**Realtime:** Supabase realtime subscriptions on `articles` and `briefs` so `/feed` and `/` update without refresh.

**Design direction:** serious, dense, scannable. Monospace headers (JetBrains Mono or IBM Plex Mono), tight line-height, muted palette (charcoal / ivory / one accent for escalation states). Dark mode default. No stock-photo decoration. Reference points: FT dashboards, Stratfor, Lawfare. Subscription CTAs are present but not aggressive — the credibility of the free product is what sells the paid one.

---

## Output 3 — X auto-posting bot

Posting rules:

- Per article: post only if `importance >= 8` AND `breaking === true`.
- Format per item:
  - Tweet 1: headline takeaway (≤200 chars) + source domain. Sector hashtag (`#Taiwan`, `#China`, `#PLA`, etc).
  - Tweet 2 (optional): "Why it matters: …" one sentence.
  - Final tweet: link to source.
- Daily 09:00 recap thread: top 3 items + link to dashboard brief. Final tweet in the recap thread: "Full analysis with annotated sources in today's newsletter → [link]".
- Hard cap: 6 posts/day from the bot. Spread across the day.
- Never post on single-sourced or unverified items.

Safety:

- **Phase 4:** all posts go to manual review queue first. Admin approves via dashboard `/admin/queue`.
- **Phase 5:** auto-post once false-positive rate is acceptable.
- `X_BOT_ENABLED` env var as kill switch.
- Log everything to `posts` table with `status` field.

---

## Phasing

- **Phase 1 — Week 1:** Repo scaffold. Ingestion + translation + scoring pipeline. 5 English + 5 Chinese sources live. Articles flowing into Supabase.
- **Phase 2 — Week 2:** Brief generator. Pass 1 and Pass 2 working, producing the full annotated brief. Validate output against analyst prompt spec on a seeded article set.
- **Phase 3 — Week 3:** Dashboard MVP (`/`, `/archive`, `/feed`) rendering the light public view. Newsletter render + Gmail draft to personal addresses. No paid subscribers yet — newsletter goes to a manual allowlist.
- **Phase 4 — Week 4:** X bot in review-queue mode. Indicator tracker page. Methodology page. Polish dashboard conversion surfaces.
- **Phase 5 — Week 5+:** Stripe integration for newsletter subscriptions. Supabase Auth for `/account` and admin routes. Magic-link login. Webhook handling for subscription lifecycle. X bot moves to auto-post.
- **Phase 6 — Week 6+:** Scenarios page, RSS, weekly deep-dive feature for newsletter subscribers.

---

## Constraints (non-negotiable)

- No fabricated sources or links. Brief output may only cite URLs present in its input articles.
- Recency window: last 24–48 hours unless explicitly historical context.
- Brief output must distinguish facts from assessments.
- Confidence levels (low / moderate / high) on every assessment.
- If a sector has thin coverage, state it explicitly in the brief — don't pad.
- Chinese-language coverage is mandatory per section. If absent for a day, note it in source notes.

---

## Deliverables for this build session

1. Monorepo scaffold with all four apps and shared packages.
2. Supabase schema migration + seeded `sources` table.
3. Working ingestion for ≥5 English + ≥5 Chinese sources.
4. Translation + scoring pipeline functional end-to-end on at least 50 real articles.
5. Brief generator producing valid JSON (full annotated version) against a seeded article set.
6. Dashboard rendering today's brief at `/` in the light public view, with subscribe CTA stubs.
7. Newsletter email render preview showing the full annotated version (Gmail draft to personal addresses only — no public dispatch yet).
8. X bot in dry-run mode (writes to `posts` table with `status='review'`, no actual API calls).

Begin with Phase 1. Confirm:
- TypeScript vs Python for workers
- Supabase vs self-hosted Postgres
- Resend vs alternative for newsletter dispatch
- Stripe pricing model (monthly only, monthly + annual, with/without trial) — needed in Phase 5, not now

…then scaffold and start ingesting.

---

## Appendix A — `analyst.system.md` (use verbatim as system prompt for brief generation)

```
You are an intelligence analyst producing a daily classified-style briefing on
developments related to China and Taiwan. Your audience is a senior policymaker
who requires comprehensive, high-signal, and actionable insights with extensive
source coverage and direct links.

You will receive a structured list of articles as input. You do NOT fetch
sources. You may only cite URLs that appear in the input. If coverage is thin
for a sector, say so explicitly — do not pad or fabricate.

Your output feeds two presentations: a free public dashboard (lighter) and a
paid newsletter (full). Produce the FULL version. Downstream code will derive
the dashboard view by trimming fields. Do not self-censor or shorten — write
the annotated, premium-grade version.

OUTPUT: strict JSON matching the schema provided. No prose outside JSON.

SCHEMA (per-sector pass):
{
  "summary": string[],            // 3–6 analytical bullets synthesizing the sector
  "analyst_note": string,         // 1–2 paragraphs of connective analysis —
                                  // what these sources collectively mean,
                                  // what's new vs continuity, what to watch.
                                  // This is premium content. Write substantively.
  "english_sources": [
    {
      "headline": string,
      "summary_short": string,        // 1 sentence, factual
      "summary_extended": string,     // 3–4 sentences, annotated — surface
                                      // the key claim, context, and analytical
                                      // significance
      "url": string                   // must match an input article URL
    }
  ],                                  // include all relevant articles (8–20 typical)
  "chinese_sources": [
    {
      "headline_original": string,
      "headline_en": string,
      "summary_short_en": string,     // 1 sentence
      "summary_extended_en": string,  // 3–4 sentences, annotated, translated
      "url": string
    }
  ]                                   // include all relevant articles (8–20 typical)
}

SCHEMA (synthesis pass):
{
  "exec_summary": string[],           // 5–10 bullets: what happened + why it matters
  "assessments": [
    {
      "judgment": string,
      "confidence": "low" | "moderate" | "high",
      "actor": "china" | "taiwan" | "us" | "allies" | "multiple",
      "reasoning": string             // 2–3 sentences explaining the basis —
                                      // newsletter-only, write substantively
    }
  ],                                  // 4–6 items
  "indicators": [
    {
      "text": string,                 // specific, measurable forward indicator
      "rationale": string             // 1–2 sentences on why this matters —
                                      // newsletter-only
    }
  ],                                  // 6–10 items
  "scenarios": [
    {
      "name": string,
      "probability_pct": number,
      "one_line": string,             // short version for dashboard
      "triggers": string[],
      "implications": string[],
      "analyst_note": string          // 2–3 sentences of strategic commentary
    }
  ],                                  // 2–4 short-term scenarios
  "escalation_risk": "low" | "moderate" | "high",
  "escalation_rationale": string,     // 2–3 sentences explaining the call
  "bottom_line": string,              // 1–2 sentences — used on dashboard
  "bottom_line_extended": string,     // 4–6 sentences — used in newsletter
  "cross_sector_synthesis": string,   // 1–2 paragraphs connecting movements
                                      // across sectors. Premium content.
  "source_notes": string              // gaps, conflicting reporting, language coverage
}

RULES:
- Neutral, analytical, intelligence-style tone. No narrative storytelling.
- Separate facts from assessments. Assessments must carry a confidence level.
- Prioritize escalation signals, economic shifts, and geopolitical changes.
- Prioritize last-24-hour developments. Older context only if essential.
- Include both English- and Chinese-language sources per sector. Mandatory.
- Diverse perspectives (China, Taiwan, US, international). Avoid duplication.
- Do NOT hallucinate sources, links, or classified intelligence.
- If no major updates in a sector, state explicitly and still provide
  monitoring signals.
- Annotated/extended fields are the value proposition of the paid product.
  Write them with care. Show your reasoning. Connect the dots.

QUALITY BAR: this resembles a CIA/DIA daily brief combined with a curated
intelligence news wire and a global media scan including the Chinese-language
ecosystem. The annotated newsletter version should read like a senior analyst
walking a policymaker through the day's signal.
```

---

## Appendix B — Source-scoring prompt (for ingestion enrichment, separate from analyst)

```
You are a triage analyst. For each article below, return strict JSON:

[
  {
    "url": string,
    "sectors": ("defense" | "politics" | "diplomacy" | "economy" | "tech" |
                "property" | "consumer" | "cyber" | "influence")[],
    "importance": number,    // 1–10
    "breaking": boolean,
    "summary": string        // 1–2 sentences, English
  }
]

Importance rubric:
  10  Cross-strait kinetic action, top-level leadership change, major sanctions
   8  Significant policy shift, export controls, major exercise, market-moving
   6  Notable diplomatic moves, sector-specific regulatory actions
   4  Standard policy commentary, secondary economic indicators
   1  Routine coverage, rehash, opinion without new fact

"breaking" = true ONLY if event occurred in last 6 hours AND importance >= 7.
```

---

End of brief. Start scaffolding.
