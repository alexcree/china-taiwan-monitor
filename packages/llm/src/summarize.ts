import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Article summarizer — generates a 30–40 word English summary for every
 * article that hasn't been summarized yet. Uses Claude Haiku 4.5 in
 * batches of 10 with prompt caching on the system prompt.
 *
 * Per-pass budget cap to keep cost predictable: SUMMARIZER_MAX_PER_PASS
 * articles processed per worker run (default 200). Anything beyond that
 * gets picked up on the next cron cycle.
 */

const MODEL = "claude-haiku-4-5-20251001";
const BATCH_SIZE = 10;
const MAX_PER_PASS = Number(process.env.SUMMARIZER_MAX_PER_PASS ?? 200);
const MAX_OUTPUT_TOKENS = 1500;

// Designed to be ≥ 1024 tokens (the minimum for prompt caching on Haiku),
// padded with calibration examples so the model converges on the right
// voice and length without per-call tuning.
const SYSTEM_PROMPT = `You are a summarization assistant for an intelligence dashboard covering China, Taiwan, Hong Kong, and their international nexuses (US-China, China-Japan, China-Europe, China-Russia, China-Africa, China-ASEAN, China-India, Indo-Pacific).

INPUT: a JSON array of news articles. Each has an "id", "title", a "lead" (the article's first paragraph or RSS lead — sometimes empty, sometimes long), and a "lang" code ("en", "zh-cn", or "zh-tw").

TASK: for each article, return a single English summary of 30–40 words that captures the most important facts a senior policymaker would want to know.

OUTPUT: strict JSON, no prose, no markdown fences:
{ "summaries": [{ "id": "<id>", "summary": "<30-40 word english summary>" }] }

WRITING RULES:
- Factual, neutral, analytical tone. No editorializing, no first-person, no rhetorical questions.
- Lead with the most important fact (the news), not the framing. Don't begin with "The article", "According to", "This piece", or similar throat-clearing.
- Active voice where the actor is known.
- Names in standard romanization: "Xi Jinping" (not "Xi Jinpíng"), "Lai Ching-te", "Tsai Ing-wen", "Hsiao Bi-khim", "John Lee", "Wang Yi", "Li Qiang", "Chen Binhua", "Mao Ning".
- Companies in their common English form: "TSMC" (not "Taiwan Semiconductor Manufacturing Co"), "SMIC", "Huawei", "Tencent", "Alibaba", "ByteDance", "BYD", "NIO", "Xpeng".
- Acronyms expanded ONLY on first mention if non-obvious; otherwise use the acronym ("PLA", "TAO", "MOFA", "MND").
- Currencies: "¥420bn" or "$2.4bn" — no spelled-out "billion".
- For Chinese-language articles, translate to clean English while preserving named entities accurately.
- Target 30–40 words. Going slightly over (up to 50) is acceptable for very dense items. Do not go under 25.
- If the "lead" is empty or just repeats the title, summarize from the title alone — make educated framing-only statements ("Reports that…") rather than inventing facts.

EXAMPLES:

Input: { "id": "x1", "title": "China's Shandong carrier group enters waters east of Taiwan, first such deployment in 2026", "lead": "Reuters cites two Taiwan defense officials confirming the Shandong carrier group transited the Bashi Channel on the night of May 10 and is now operating in waters east of Taiwan. The group includes four escorts and one replenishment vessel.", "lang": "en" }
Output: { "id": "x1", "summary": "China's Shandong carrier group transited the Bashi Channel May 10 and is operating roughly 200nm east of Taiwan with four escorts and a replenishment vessel, Taiwan defense officials told Reuters. First such deployment in 2026 and a notable shift in posture." }

Input: { "id": "x2", "title": "央行开展4200亿元逆回购操作 流动性合理充裕", "lead": "中国人民银行今日开展7天期逆回购操作4200亿元,中标利率1.7%。市场人士认为,此举为应对人民币近期承压。", "lang": "zh-cn" }
Output: { "id": "x2", "summary": "The People's Bank of China injected ¥420bn via 7-day reverse repos at 1.7% as the yuan weakened past 7.32, the largest defensive operation since February. Market participants read the move as measured rather than escalatory." }

Input: { "id": "x3", "title": "TSMC reports unscheduled MOEA audit of Tier-3 suppliers", "lead": "", "lang": "en" }
Output: { "id": "x3", "summary": "TSMC disclosed an unscheduled audit by Taiwan's Ministry of Economic Affairs targeting Tier-3 suppliers, reportedly tied to enforcement of recently announced controls on advanced packaging equipment bound for mainland-affiliated customers." }

Now process the actual input.`;

export interface SummarizeResult {
  scanned: number;
  attempted: number;
  written: number;
  failed: number;
  batches: number;
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
}

/**
 * Locate the JSON object inside a model response, tolerating any pre/post
 * whitespace, code fences, or other framing the model may slip in despite
 * the strict-JSON instruction.
 */
function parseJsonResponse(raw: string): { summaries?: ModelResponseItem[] } {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  // Find the outer JSON object.
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first >= 0 && last > first) {
    s = s.slice(first, last + 1);
  }
  return JSON.parse(s) as { summaries?: ModelResponseItem[] };
}

async function summarizeBatch(
  client: Anthropic,
  batch: ArticleForSummary[],
): Promise<Map<string, string>> {
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
  const out = new Map<string, string>();
  for (const item of parsed.summaries ?? []) {
    if (typeof item.id === "string" && typeof item.summary === "string") {
      out.set(item.id, item.summary.trim());
    }
  }
  return out;
}

export async function summarizeNewArticles(
  supabase: SupabaseClient,
): Promise<SummarizeResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { scanned: 0, attempted: 0, written: 0, failed: 0, batches: 0 };
  }

  const client = new Anthropic();

  // Pull articles missing summary_en, freshest first.
  const { data, error } = await supabase
    .from("articles")
    .select("id, title_original, summary, lang")
    .is("summary_en", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("fetched_at", { ascending: false })
    .limit(MAX_PER_PASS);

  if (error) {
    console.warn(`[summarize] query failed: ${error.message}`);
    return { scanned: 0, attempted: 0, written: 0, failed: 0, batches: 0 };
  }

  const pending: ArticleForSummary[] = (data ?? []).map((r) => ({
    id: r.id as string,
    title: (r.title_original as string) ?? "",
    lead: (r.summary as string | null) ?? null,
    lang: (r.lang as string) ?? "en",
  }));

  if (pending.length === 0) {
    return { scanned: 0, attempted: 0, written: 0, failed: 0, batches: 0 };
  }

  let attempted = 0;
  let written = 0;
  let failed = 0;
  let batches = 0;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    attempted += batch.length;
    batches++;

    let summaries: Map<string, string>;
    try {
      summaries = await summarizeBatch(client, batch);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[summarize] batch ${batches} failed: ${msg}`);
      failed += batch.length;
      continue;
    }

    // Update one row at a time — necessarily, since each gets its own value.
    // Run them concurrently within the batch so the HTTP cost is amortized.
    const updates = await Promise.all(
      batch.map(async (a) => {
        const summary = summaries.get(a.id);
        if (!summary || summary.length < 20) return false;
        const { error: upErr } = await supabase
          .from("articles")
          .update({ summary_en: summary })
          .eq("id", a.id);
        return !upErr;
      }),
    );
    for (const ok of updates) {
      if (ok) written++;
      else failed++;
    }
  }

  return { scanned: pending.length, attempted, written, failed, batches };
}
