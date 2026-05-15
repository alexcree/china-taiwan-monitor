/**
 * Anthropic client + prompt templates.
 *
 * Phase 2: per-article summarization (./summarize).
 * Phase 3: translation + scoring + brief generation.
 */

export const ANTHROPIC_BRIEF_MODEL = "claude-opus-4-7" as const;
export const ANTHROPIC_SUMMARY_MODEL = "claude-haiku-4-5-20251001" as const;

export {
  summarizeNewArticles,
  type SummarizeResult,
} from "./summarize.js";
