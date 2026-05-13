# Ingestion Strategy

How China–Taiwan Monitor stays current and authoritative.

## Goals

1. **Maximal credible coverage** — every story of cross-strait significance lands in our pipeline within minutes of publication.
2. **Source diversity by design** — every sector and every brief must include mainland Chinese, Taiwan, English-language wire, and specialist analytical perspectives. Any single perspective dominance is a quality failure, not a stylistic preference.
3. **Breaking-news freshness** — high-importance items reach the X bot and dashboard "Live feed" in under 5 minutes from publication.
4. **Deterministic provenance** — every headline on the dashboard carries publication date/time, source domain, paywall flag, and language pill. Nothing without attribution.
5. **Cost discipline** — we pay for LLM calls only on items that pass triage. No translation, scoring, or summarization on duplicates, low-importance feed traffic, or items we've already seen.

---

## Source tiers

We tier sources by editorial reliability and update frequency. Tier drives fetch cadence and weighting in the brief generator.

### Tier 1 — Authoritative wires & government primary

Pull-frequency target: **every 3 minutes** for breaking endpoints, every 15 minutes for general feeds.

- **English wires:** Reuters, AP, Bloomberg (terminal API where available, RSS otherwise), Financial Times, Wall Street Journal, Nikkei Asia, SCMP.
- **Chinese-state:** Xinhua 新华社, People's Daily 人民日报, China Daily 中国日报, Global Times 环球时报 (CN + EN), CCTV / 央视新闻, PLA Daily 解放军报, China Military Online 中国军网.
- **Government primary:** MFA / 外交部 spokesperson briefings, TAO / 国台办 briefings, State Council Information Office, MoD / 国防部, US State Department briefings, AIT statements, Taiwan Presidential Office, Taiwan MoFA / 中華民國外交部, Taiwan MND / 國防部, Taiwan MAC / 大陸委員會, US Treasury OFAC, Bureau of Industry & Security (BIS), USTR, European Commission DG Trade.
- **Taiwan state news:** CNA / 中央社 (Focus Taiwan is its English service).

### Tier 2 — Established media & specialist desks

Pull-frequency target: **every 15 minutes**.

- **English:** Defense News, Breaking Defense, Janes (paywalled), War on the Rocks, Lawfare, Foreign Policy, Foreign Affairs, The Diplomat, Asia Times, Nikkei Asia (already T1 — listed because of dual roles), The Economist, Politico Asia, Axios China, Semafor Asia.
- **Chinese commercial/financial:** Caixin 财新 (paywalled), 21st Century Business Herald 21世纪经济报道, Yicai 第一财经, Economic Observer 经济观察报, The Paper 澎湃新闻, Sina Finance 新浪财经, Tencent News 腾讯新闻, Phoenix 凤凰网, Guancha 观察者网 (state-aligned commentary), Sohu News, Caijing 财经.
- **Hong Kong:** Initium 端传媒 (paywalled, independent), HK01, Ming Pao 明报, Hong Kong Free Press, The Standard.
- **Taiwan press:** United Daily News 聯合報, Liberty Times 自由時報, China Times 中國時報, Storm Media 風傳媒, NewTalk 新頭殼, The Reporter 報導者 (membership), Mirror Media 鏡週刊, ETtoday, Taipei Times (English).
- **Defense / industry specialist:** USNI News, Naval News, Aviation Week.

### Tier 3 — Think tank & analyst-grade commentary

Pull-frequency target: **every 30 minutes** for blogs/feeds, daily digest for newsletters.

- **English-language think tanks & analysts:** CSIS (commentary + AMTI / Asia Maritime Transparency Initiative), Brookings, RAND, Stimson, CNAS, Council on Foreign Relations, Asia Society Policy Institute, Hudson Institute, Project 2049 Institute, German Marshall Fund, MERICS (China-focused).
- **Substack / curated newsletters:** Sinocism (Bill Bishop, paywalled), ChinaTalk (Jordan Schneider), China Leadership Monitor, China Media Project, Made in China Journal, SemiAnalysis (paywalled, tech), The Information (paywalled, tech).
- **Taiwan-side think tanks:** INDSR (Institute for National Defense and Security Research) / 國防安全研究院, New Taiwan Foundation, 9DASHLINE.

### Tier 4 — Open social signal (curated allowlist)

Pull-frequency target: **continuous polling** for designated accounts, but filtered hard against an importance threshold before triage.

- **Allowlist only.** No general scraping of X/Twitter. Maintain a curated list of credible analyst accounts (cross-strait researchers, former officials, defense correspondents).
- **Weibo / WeChat / Bilibili** — selective monitoring of state-affiliated accounts and registered media for early signals (especially for PLA-related video releases).
- **Telegram channels** — selective.

Tier 4 is the lowest weight and never appears in a brief without a corresponding Tier-1/2 source confirming the underlying event.

---

## Ingestion modes

Each source is reachable via one of four modes. Mode determines worker code path and operational cost.

| Mode | Description | Typical sources | Implementation notes |
|---|---|---|---|
| **rss** | Pull RSS/Atom feed on schedule | Most English wires, Focus Taiwan, UDN, Liberty Times | Cheap, well-behaved. Parse with `rss-parser` or similar. Respect `<lastBuildDate>` / ETag. |
| **api** | Structured API call (auth required) | Reuters Connect, Bloomberg Terminal feed, AP, Bing News, Google News Search API | Best for quality; gated by cost/contract. Where available, prefer over RSS. |
| **scrape** | Playwright/Browserless against published HTML | Xinhua, People's Daily, PLA Daily, TAO briefings, Caixin (titles + lead), Guancha, government spokespersons | Required for outlets that don't expose feeds. Render headless, extract via stable selectors. Respect robots.txt and per-domain rate limits. |
| **social** | Twitter/X API v2, Weibo open API, Telegram bot API | Tier-4 allowlist accounts | Lowest weight. Always cross-reference. |

**Universal rules:**
- Respect `robots.txt`.
- Per-domain rate limit (configurable per source, defaults conservative).
- Exponential backoff on 429/503.
- HTML scraped → store raw HTML AND extracted plain text in `articles.full_text`. Raw HTML preserved for re-extraction if selector drifts.
- Every fetch records `fetched_at`, `http_status`, `bytes`, `latency_ms` for observability.

---

## Fetch architecture

### Topology

```
                ┌─────────────────────────────────────┐
                │  Source registry (DB-backed)        │
                │  slug · tier · mode · cadence · url │
                └──────────────────┬──────────────────┘
                                   │
   ┌───────────────────────────────┼───────────────────────────────┐
   │                               │                               │
┌──▼──────────┐               ┌────▼──────┐                  ┌─────▼─────┐
│ rss-pollers │               │ scrapers   │                  │ social-mon│
│ (concurrent │               │ (Playwright│                  │ (X, Weibo)│
│  per-tier)  │               │  + queue)  │                  │           │
└──┬──────────┘               └────┬───────┘                  └─────┬─────┘
   │                               │                                │
   └───────────────────────────────┼────────────────────────────────┘
                                   │
                              ┌────▼────┐
                              │ ingest  │  Dedup by canonical URL + content hash
                              │  bus    │  Insert/update articles row
                              └────┬────┘
                                   │
                         ┌─────────┼─────────┐
                         │         │         │
                    ┌────▼───┐  ┌──▼────┐  ┌─▼──────┐
                    │triage  │  │trans- │  │ break  │  importance >= 8
                    │(LLM)   │  │late   │  │ detect │  + breaking=true
                    │scoring │  │(LLM)  │  │ → X    │  → priority queue
                    └────────┘  └───────┘  └────────┘
```

### Workers

Each worker is independently scaled and deployable. All operate against shared Postgres + a small Redis queue.

- **`worker-rss-poller`** — single binary that reads enabled `rss` sources from the registry. Two concurrency pools: T1 (every 3–15 min), T2 (every 15 min), T3 (every 30 min). Cron-driven; idempotent.
- **`worker-scraper`** — Playwright workers in a small pool (3–5 browsers warm). Job queue keyed on source. Per-source backoff, retry on transient failure.
- **`worker-social-monitor`** — long-running, polls X API v2 streaming endpoint with rule-based filters. Posts go through the same ingest bus with `tier=4` weighting.
- **`worker-ingest`** — single service that consumes from all upstream queues. Performs:
  1. URL canonicalization (strip UTM params, normalize host, lowercase).
  2. Content-hash deduplication (SHA-256 of normalized title + first 500 chars).
  3. Upsert into `articles`.
  4. Enqueue translation if `lang !== 'en'` and not previously translated.
  5. Enqueue scoring if not previously scored or content changed.
- **`worker-translator`** — batched 10-at-a-time calls to `claude-opus-4-7` (cheap, structured JSON output). Cache by content-hash. Translation results are immutable per content hash.
- **`worker-scorer`** — batched 10-at-a-time triage calls returning `{ sectors[], importance, breaking, summary }`. Uses the scoring prompt in Appendix B of `analyst-system-prompt.md`. Cached.
- **`worker-breaking`** — listens to `articles` table changes via Supabase realtime. Fires X bot review-queue insert when `importance >= 8 AND breaking = true`. Runs every 30s with sub-second event latency target.
- **`worker-brief`** — daily 06:00 local. Pulls last-36h articles `importance >= 5`, runs Pass 1 (per-sector) and Pass 2 (synthesis) with prompt caching.

### Scheduling

- **Vercel Cron** — only for the brief generator and the X daily-recap thread. Vercel Cron's minimum interval (1h, edge function) is too coarse for ingestion.
- **Hetzner/Railway/Fly small VPS** — runs the rss-poller, scraper, social-monitor, ingest, translator, scorer as a single Node process with internal cron. Resource cost: roughly $10–20/mo.
- **Supabase realtime** — drives the breaking-news fast path off the `articles` table itself; no separate scheduler.

---

## Deduplication & story clustering

The same story will hit the pipeline from 5–10 outlets in the same hour. We dedupe at three levels:

1. **Exact URL dedup** — canonical URL is unique key. Done at insert time.
2. **Near-duplicate dedup** — content hash on normalized title + lead 500 chars. Marks alternate URLs as `dup_of` rather than dropping (so we preserve source diversity for the brief generator).
3. **Story clustering** — at brief-generation time, cluster articles by sector + 24h window using embeddings (Anthropic embeddings or sentence-transformers self-hosted). Cluster center is the highest-importance article; cluster members appear in the brief as supporting sources. This is what produces the "8–20 articles per sector" coverage with diverse perspectives without redundancy.

Clustering threshold (cosine similarity ≥ 0.78) tuned weekly against brief output quality.

---

## Translation pipeline

- **Trigger:** any new article where `lang !== 'en'`.
- **Scope per call:** title + lead 300 words. Full-text translation only on-demand for articles selected for the brief (cost optimization).
- **Cache key:** content hash. Re-translation suppressed unless source content changes.
- **Model:** `claude-opus-4-7` with prompt caching on the translation instructions. Batch size 10 articles per call.
- **Output:** populates `articles.title_en` and `articles.full_text_en`. Original always preserved.
- **Quality bar:** model is instructed to preserve named entities (people, places, organizations) in original characters parenthetically on first mention.

---

## Breaking-news fast path

Goal: high-importance items reach dashboard `/feed` and the X bot review queue in under 5 minutes from publication.

1. Article lands in `articles` via ingest bus.
2. Scorer runs immediately (out of band from the 10-batch — single-article fast lane for items from Tier-1 sources only).
3. If `importance >= 8 AND breaking === true`, fire two events:
   - **Dashboard:** insert into `posts` with `channel='dashboard', status='breaking'`. Realtime sub on `/feed` updates without refresh. A red breaking banner shows for 60 minutes.
   - **X bot:** insert into review queue. Admin approves at `/admin/queue`; auto-post in Phase 5 once false-positive rate is acceptable.
4. The same article also flows through the normal pipeline for brief inclusion.

Fast-lane scoring is restricted to Tier-1 sources to prevent false breakings from low-tier outlets.

---

## Paywall handling

We surface paywalls so readers know what to expect when they click.

- **Explicit flag preferred:** brief generator output and the article record both carry `paywall: boolean | null`. The triage scorer is prompted to fill this when it can infer it; otherwise null.
- **Domain fallback:** for null/undefined, fall back to a maintained list of paywalled domains (FT, WSJ, Bloomberg, Nikkei, SCMP, Defense News, Janes, The Information, SemiAnalysis, Caixin selective, Initium, Reporter, etc.).
- **Display:** small "$" pill next to the source domain on every paywalled headline.
- **Recovery:** for paywalled tier-1 articles we want to brief on, the scoring summary is what's safe to publish — never paste full content from behind a paywall into the brief itself.

Paywalled-status itself is not a quality signal; many of our most authoritative sources sit behind paywalls. The indicator is reader-experience hygiene, not a downweight.

---

## Quality & operational monitoring

A small dashboard at `/admin/health` (Phase 4) surfaces:

- **Source health** — last successful fetch per source. Anything > 4× cadence triggers alert. Stale feeds get auto-disabled with a notification.
- **Translation queue depth** — should be < 50 items steady-state. Spikes indicate Anthropic rate limit or pipeline backup.
- **Scoring queue depth** — same idea.
- **Importance-distribution drift** — week-over-week, share of articles scored ≥ 8 should be stable. Sustained drift up = scorer needs recalibration; drift down = source pool shrinking.
- **Language-coverage ratio** — per-sector EN:ZH ratio per brief. Target balanced (3:5–5:3). Anything outside is flagged in source notes.
- **Dedup-cluster size distribution** — if clusters are too large, threshold needs tightening; too small, loosening.

A weekly cron writes a `health_summary` row that's used in the methodology page and to detect drift over months.

---

## Cost model (rough)

Assuming ~3,000 articles/day across all sources after dedup:

| Workload | Per-day calls | Notes |
|---|---|---|
| Scoring | ~300 batched calls (10/call) | Cheap, structured-JSON only |
| Translation | ~1,000 articles to translate | Title + lead, ~400 tokens/article |
| Brief gen | 9 Pass-1 calls + 1 Pass-2 | Long context, prompt-cached |
| Embeddings | ~3,000 | Self-host sentence-transformers or use cheapest API |
| **Estimated:** | | $20–40/day of LLM spend on Anthropic |

Prompt caching on the analyst system prompt across the 9 Pass-1 calls is the largest single optimization — keep it on.

---

## Phasing

| Phase | Scope |
|---|---|
| **1 (this branch)** | Seed source registry with the full T1/T2 list; scaffold complete. |
| **2** | `worker-ingest` + `worker-rss-poller` live for the T1/T2 RSS sources. ~30 sources, every 15 min. Articles in DB; dashboard `/feed` showing live stream. |
| **3** | `worker-scraper` for Xinhua, People's Daily, PLA Daily, TAO, MFA, MND. `worker-translator` and `worker-scorer` live and batched. Brief generator running on real ingested data. |
| **4** | `worker-breaking` and X bot review-queue mode. Story clustering at brief-gen time. Indicator-tracker page. Admin health dashboard. |
| **5** | Full T3 think-tank coverage. T4 social monitor (curated allowlist). Auto-post on X. Stripe + auth for newsletter. |
| **6** | Reuters/AP/Bloomberg structured-API integration (replaces RSS where contract exists). Embeddings-based personalization. RSS output for the dashboard. |

---

## Open questions (parking lot)

These need decisions before the corresponding phase ships:

- **Reuters Connect vs RSS** — paid API gives clean structured stories and faster latency. Worth the cost only once we have subscribers paying.
- **Bloomberg Terminal feed access** — typically requires an existing Terminal subscription. Defer.
- **Anthropic embeddings vs self-hosted ST** — embeddings API is cleaner but bills per-call. At 3k articles/day, self-host is materially cheaper. Decide in Phase 4.
- **Web archive snapshot** — should we archive linked articles to Internet Archive Save-Page-Now on first fetch, to insulate against link rot in the archive view? Lightweight; recommend yes.
- **GDPR / data residency** — no EU subscribers expected, but the source list includes EU outlets; review if EU subscribers materialize.
