import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Article summarizer + classifier — generates a 30-40 word English
 * summary AND classifies each article into the dashboard's topic
 * taxonomy. Uses Claude Haiku 4.5 in batches of 10 with prompt caching
 * on the system prompt. Backfill cost: ~$0.001 per article.
 *
 * Per-pass budget cap to keep cost predictable: SUMMARIZER_MAX_PER_PASS
 * articles processed per worker run (default 200).
 */

const MODEL = "claude-haiku-4-5-20251001";
const BATCH_SIZE = 10;
const MAX_PER_PASS = Number(process.env.SUMMARIZER_MAX_PER_PASS ?? 200);
const MAX_OUTPUT_TOKENS = 2400;

const PRIMARY_TOPIC_VALUES = new Set([
  "military",
  "politics",
  "us_china_taiwan",
  "semiconductors",
  "markets",
  "cyber_info_ops",
  "diplomacy",
  "general",
]);

// Designed to be ≥ 1024 tokens (the minimum for prompt caching on Haiku),
// padded with calibration examples so the model converges on the right
// voice, length, and taxonomy without per-call tuning.
const SYSTEM_PROMPT = `You are a summarization + classification assistant for an intelligence dashboard covering China, Taiwan, Hong Kong, and their international nexuses (US-China, China-Japan, China-Europe, China-Russia, China-Africa, China-ASEAN, China-India, Indo-Pacific).

INPUT: a JSON array of news articles. Each has an "id", "title", a "lead" (the article's first paragraph or RSS lead — sometimes empty, sometimes long), and a "lang" code ("en", "zh-cn", or "zh-tw").

TASK: for each article, return:
  - a single English summary of 30-40 words capturing the most important facts
  - a primary_topic from a fixed enum
  - 1-5 free-form subtopic tags (snake_case lowercase)
  - actors mentioned (proper nouns: people + organizations)
  - countries involved (lowercase ISO-3166 alpha-2)
  - content_type tag

OUTPUT: strict JSON, no prose, no markdown fences:
{ "summaries": [{
    "id": "<id>",
    "summary": "<30-40 word english summary>",
    "primary_topic": "<one enum value>",
    "subtopics": ["<tag1>", "<tag2>"],
    "actors": ["<Name 1>", "<Name 2>"],
    "countries": ["<cc1>", "<cc2>"],
    "content_type": "<type>"
}] }

WRITING RULES (apply to "summary"):
- Factual, neutral, analytical tone. No editorializing, first-person, or rhetorical questions.
- Lead with the most important fact (the news), not the framing. Don't begin with "The article", "According to", "This piece", or similar throat-clearing.
- Active voice where the actor is known.
- Names in standard romanization: "Xi Jinping", "Lai Ching-te", "Tsai Ing-wen", "Hsiao Bi-khim", "John Lee", "Wang Yi", "Li Qiang", "Chen Binhua", "Mao Ning".
- Companies in their common English form: "TSMC", "SMIC", "Huawei", "Tencent", "Alibaba", "ByteDance", "BYD", "NIO", "Xpeng".
- Acronyms expanded ONLY on first mention if non-obvious; otherwise use the acronym ("PLA", "TAO", "MOFA", "MND").
- Currencies: "¥420bn" or "$2.4bn" — no spelled-out "billion".
- For Chinese-language articles, translate to clean English while preserving named entities accurately.
- Target 30-40 words. Up to 50 acceptable for very dense items. Do not go under 25.

PRIMARY_TOPIC enum (pick EXACTLY one):
- "military": PLA activity (air, naval, missile, rocket force), median-line crossings, ADIZ activity, exercises (Joint Sword etc), gray-zone coercion, coast guard, maritime militia, Taiwan defense readiness and reform, civil defense, defense industrial procurement, arms-package items themselves, infrastructure resilience.
- "politics": Taiwan domestic politics (Lai admin, Legislative Yuan, DPP/KMT/TPP, elections, referendums, defense-budget POLITICS as opposed to procurement), PRC Taiwan policy (TAO statements, United Front, anti-secession law, "one China" rhetoric, Fujian integration, sanctions/blacklists on Taiwanese individuals), legal/sovereignty/identity disputes.
- "us_china_taiwan": U.S.-Taiwan relations (arms sales as policy moves, AIT statements, congressional visits, Taiwan Relations Act, executive branch policy, strategic ambiguity debate), U.S.-China relations affecting Taiwan (Trump-Xi or US-China summits, mil-to-mil channels, Taiwan as negotiation issue), Taiwan international space (WHO/WHA, UN/ICAO/Interpol/APEC, diplomatic allies, recognition switches, G7/NATO statements).
- "semiconductors": TSMC, SMIC, UMC, MediaTek, advanced packaging, AI chips, US/Japan/EU semiconductor export controls, Huawei/HiSilicon developments, chip-related supply-chain security, sovereign AI infrastructure, critical minerals/rare earths tied to chips.
- "markets": Taiwan economy + equity / FX (TAIEX, Taiwan dollar, central bank, GDP, exports), China financial markets (Hang Seng, CSI 300, yuan, PBOC), corporate risk and earnings, sanctions/tariff impact, capital flows, supply-chain relocation, shipping/insurance pricing.
- "cyber_info_ops": cyberattacks (gov, critical infra, telecom, financial, semis), influence operations and disinformation, deepfakes, election interference, bot networks, narratives and propaganda framings, state-media-vs-independent media observations.
- "diplomacy": regional diplomacy (Japan, Philippines/Luzon Strait, South Korea, Australia, India, ASEAN, EU/UK/France/Germany, Pacific Islands), cross-strait society and exchanges (tourism, students, family, Kinmen/Matsu, detentions), human rights (Hong Kong/Xinjiang/Tibet spillover, exit bans, religious freedom), regional security and South/East China Sea diplomacy, public health diplomacy.
- "general": Relevant to China/Taiwan/HK but does NOT fit any of the seven above cleanly. Use sparingly — prefer the specific topics.

SUBTOPICS (snake_case, 1-5 tags). Pick from this seed list when applicable, extend freely when needed:
  pla_air, pla_naval, median_line, adiz, carrier, missile, rocket_force, joint_sword, gray_zone, coast_guard, maritime_militia, blockade, taiwan_defense, civil_defense, han_kuang, arms_sales, ait, congressional_visit, taiwan_relations_act, foreign_military_financing, strategic_ambiguity,
  dpp, kmt, tpp, legislative_yuan, presidential_election, referendum, defense_budget, constitutional, corruption, energy_politics, labor_politics,
  tao, united_front, one_china, anti_secession, peaceful_reunification, fujian_integration, sanctions, blacklist, election_interference,
  trump_xi, us_china_summit, tariffs, export_controls, mil_to_mil, strategic_stability,
  who, un, icao, interpol, apec, diplomatic_allies, recognition_switch, g7_statement, nato_statement, european_parliament,
  taiex, hang_seng, csi_300, yuan, twd, hkd, central_bank, foreign_investment, china_exposure, supply_chain_relocation, war_risk_insurance, shipping, tourism_economy, real_estate, energy_prices,
  tsmc, smic, umc, mediatek, foxconn, advanced_packaging, ai_chips, huawei, hisilicon, chip_act, fab, supply_chain_security, critical_minerals, rare_earths,
  cyberattack, telecom_intrusion, financial_cyber, semiconductor_cyber, disinformation, deepfakes, bot_network, election_disinfo, tiktok, wechat,
  japan_taiwan, japan_defense, philippines, south_china_sea, east_china_sea, senkaku, diaoyu, asean, australia, india, korea, eu_position, pacific_islands, quad, aukus,
  one_china_principle, one_china_policy, 1992_consensus, anti_secession_law, espionage_case, exit_ban,
  tourism, student_exchange, religious_exchange, kinmen, matsu, mainland_spouse, detention,
  energy_security, lng, power_grid, water_supply, food_security, undersea_cable, civil_defense_shelter, satellite_comms,
  state_media, taiwan_media, hong_kong_media, opinion, think_tank_report, official_statement.

ACTORS: proper nouns mentioned. People in romanized standard form; organizations/companies in their English short form. Examples: "Xi Jinping", "Lai Ching-te", "Tsai Ing-wen", "Hsiao Bi-khim", "Wang Yi", "John Lee", "TSMC", "SMIC", "Huawei", "PLA", "DPP", "KMT", "TAO", "MND", "MOFA".

COUNTRIES: lowercase ISO-3166 alpha-2 of countries directly involved or substantively named. Treat the EU as "eu" (in addition to specific member states if individually named). Examples: us, cn, tw, hk, jp, kr, ph, au, in, ru, de, fr, uk, eu, sg, my, vn, th, id, br.

CONTENT_TYPE: "news" (default), "analysis", "opinion", "official_statement", "think_tank_report", "speech", "market_note", "transcript", "social_post".

EXAMPLES:

Input: { "id": "x1", "title": "China's Shandong carrier group enters waters east of Taiwan, first such deployment in 2026", "lead": "Reuters cites two Taiwan defense officials confirming the Shandong carrier group transited the Bashi Channel on the night of May 10 and is now operating in waters east of Taiwan. The group includes four escorts and one replenishment vessel.", "lang": "en" }
Output: { "id": "x1", "summary": "China's Shandong carrier group transited the Bashi Channel May 10 and is operating roughly 200nm east of Taiwan with four escorts and a replenishment vessel, Taiwan defense officials told Reuters. First such deployment in 2026 and a notable shift in posture.", "primary_topic": "military", "subtopics": ["pla_naval", "carrier", "gray_zone"], "actors": ["Shandong", "PLA"], "countries": ["cn", "tw"], "content_type": "news" }

Input: { "id": "x2", "title": "央行开展4200亿元逆回购操作 流动性合理充裕", "lead": "中国人民银行今日开展7天期逆回购操作4200亿元,中标利率1.7%。市场人士认为,此举为应对人民币近期承压。", "lang": "zh-cn" }
Output: { "id": "x2", "summary": "The People's Bank of China injected ¥420bn via 7-day reverse repos at 1.7% as the yuan weakened past 7.32, the largest defensive operation since February. Market participants read the move as measured rather than escalatory.", "primary_topic": "markets", "subtopics": ["central_bank", "yuan"], "actors": ["PBOC"], "countries": ["cn"], "content_type": "news" }

Input: { "id": "x3", "title": "TSMC reports unscheduled MOEA audit of Tier-3 suppliers", "lead": "", "lang": "en" }
Output: { "id": "x3", "summary": "TSMC disclosed an unscheduled audit by Taiwan's Ministry of Economic Affairs targeting Tier-3 suppliers, reportedly tied to enforcement of recently announced controls on advanced packaging equipment bound for mainland-affiliated customers.", "primary_topic": "semiconductors", "subtopics": ["tsmc", "advanced_packaging", "export_controls", "supply_chain_security"], "actors": ["TSMC"], "countries": ["tw", "cn"], "content_type": "news" }

Input: { "id": "x4", "title": "Trump says he 'made no commitment either way' to Xi on Taiwan", "lead": "President Trump said following his Beijing meeting with Xi Jinping that he gave no commitment regarding the U.S. position on Taiwan, while expressing satisfaction with the trip overall.", "lang": "en" }
Output: { "id": "x4", "summary": "Trump said after his Beijing meeting with Xi Jinping that he made no commitment 'either way' on Taiwan policy, while calling the visit a success. The statement leaves U.S. strategic-ambiguity language intact in the immediate aftermath.", "primary_topic": "us_china_taiwan", "subtopics": ["trump_xi", "us_china_summit", "strategic_ambiguity"], "actors": ["Trump", "Xi Jinping"], "countries": ["us", "cn", "tw"], "content_type": "news" }

Input: { "id": "x5", "title": "Meta takes down 1,800 accounts in cross-strait coordinated inauthentic behavior operation", "lead": "Meta's quarterly CIB report removed 1,800 accounts across Facebook, Instagram, and Threads. Operation targeted Taiwan municipal politics and the FY27 defense budget debate.", "lang": "en" }
Output: { "id": "x5", "summary": "Meta removed 1,800 accounts across Facebook, Instagram, and Threads tied to a cross-strait coordinated inauthentic behavior operation targeting Taiwan municipal politics and the FY27 defense budget debate, per its quarterly CIB report.", "primary_topic": "cyber_info_ops", "subtopics": ["election_interference", "disinformation", "bot_network"], "actors": ["Meta"], "countries": ["tw", "cn", "us"], "content_type": "news" }

Now process the actual input.`;

export interface SummarizeResult {
  scanned: number;
  attempted: number;
  written: number;
  failed: number;
  batches: number;
  window_hours: number;
}

export interface SummarizeOptions {
  /**
   * Only summarize articles whose `published_at` is within the last N hours.
   * Defaults to 24h — matches the dashboard's display window.
   */
  sinceHours?: number;
}

interface ArticleForSummary {
  id: string;
  title: string;
  lead: string | null;
  lang: string;
}

interface ModelResponseItem {
  id: string;
  summary: string;
  primary_topic?: string;
  subtopics?: string[];
  actors?: string[];
  countries?: string[];
  content_type?: string;
}

interface Classified {
  summary: string;
  primary_topic: string;
  subtopics: string[];
  actors: string[];
  countries: string[];
  content_type: string;
}

function parseJsonResponse(raw: string): { summaries?: ModelResponseItem[] } {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first >= 0 && last > first) s = s.slice(first, last + 1);
  return JSON.parse(s) as { summaries?: ModelResponseItem[] };
}

function normalizeStringArray(
  value: unknown,
  maxItems: number,
  maxLen = 64,
): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of value) {
    if (typeof v !== "string") continue;
    const trimmed = v.trim().slice(0, maxLen);
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
    if (out.length >= maxItems) break;
  }
  return out;
}

async function summarizeBatch(
  client: Anthropic,
  batch: ArticleForSummary[],
): Promise<Map<string, Classified>> {
  const userInput = batch.map((a) => ({
    id: a.id,
    title: a.title,
    lead: (a.lead ?? "").slice(0, 1200),
    lang: a.lang,
  }));

  const result = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Articles:\n${JSON.stringify(userInput, null, 2)}`,
      },
    ],
  });

  const text = result.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");
  const parsed = parseJsonResponse(text);
  const out = new Map<string, Classified>();
  for (const item of parsed.summaries ?? []) {
    if (typeof item.id !== "string") continue;
    if (typeof item.summary !== "string" || item.summary.trim().length < 20) {
      continue;
    }
    const summary = item.summary.trim();
    const topic =
      typeof item.primary_topic === "string" &&
      PRIMARY_TOPIC_VALUES.has(item.primary_topic)
        ? item.primary_topic
        : "general";
    const ct =
      typeof item.content_type === "string" && item.content_type.length > 0
        ? item.content_type.trim().slice(0, 32)
        : "news";
    out.set(item.id, {
      summary,
      primary_topic: topic,
      subtopics: normalizeStringArray(item.subtopics, 8),
      actors: normalizeStringArray(item.actors, 12),
      countries: normalizeStringArray(item.countries, 8, 4).map((c) =>
        c.toLowerCase(),
      ),
      content_type: ct,
    });
  }
  return out;
}

export async function summarizeNewArticles(
  supabase: SupabaseClient,
  opts: SummarizeOptions = {},
): Promise<SummarizeResult> {
  const sinceHours = opts.sinceHours ?? 24;
  const empty: SummarizeResult = {
    scanned: 0,
    attempted: 0,
    written: 0,
    failed: 0,
    batches: 0,
    window_hours: sinceHours,
  };
  if (!process.env.ANTHROPIC_API_KEY) return empty;

  const client = new Anthropic();
  const sinceIso = new Date(
    Date.now() - sinceHours * 3600 * 1000,
  ).toISOString();

  // Pick up articles missing EITHER the summary or the topic — old rows
  // that have summary_en but were written before classification existed
  // get caught up in the same pass.
  const { data, error } = await supabase
    .from("articles")
    .select("id, title_original, summary, lang, summary_en, primary_topic")
    .gte("published_at", sinceIso)
    .or("summary_en.is.null,primary_topic.is.null")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(MAX_PER_PASS);

  if (error) {
    console.warn(`[summarize] query failed: ${error.message}`);
    return empty;
  }

  const pending: ArticleForSummary[] = (data ?? []).map((r) => ({
    id: r.id as string,
    title: (r.title_original as string) ?? "",
    lead: (r.summary as string | null) ?? null,
    lang: (r.lang as string) ?? "en",
  }));

  if (pending.length === 0) return empty;

  let attempted = 0;
  let written = 0;
  let failed = 0;
  let batches = 0;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    attempted += batch.length;
    batches++;

    let results: Map<string, Classified>;
    try {
      results = await summarizeBatch(client, batch);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[summarize] batch ${batches} failed: ${msg}`);
      failed += batch.length;
      continue;
    }

    const updates = await Promise.all(
      batch.map(async (a) => {
        const r = results.get(a.id);
        if (!r) return false;
        const { error: upErr } = await supabase
          .from("articles")
          .update({
            summary_en: r.summary,
            primary_topic: r.primary_topic,
            subtopics: r.subtopics,
            actors: r.actors,
            countries: r.countries,
            content_type: r.content_type,
          })
          .eq("id", a.id);
        return !upErr;
      }),
    );
    for (const ok of updates) {
      if (ok) written++;
      else failed++;
    }
  }

  return {
    scanned: pending.length,
    attempted,
    written,
    failed,
    batches,
    window_hours: sinceHours,
  };
}
