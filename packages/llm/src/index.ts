/**
 * Anthropic client + prompt templates — Phase 1/2.
 *
 * Will export:
 *   - Configured Anthropic client (`claude-opus-4-7`) with prompt caching
 *     on the system prompt
 *   - Translation helper (Chinese -> English, cached by URL hash)
 *   - Scoring helper (batched 10-at-a-time triage call)
 *   - Brief Pass 1 (per-sector) and Pass 2 (synthesis) call wrappers
 */

export const ANTHROPIC_MODEL = "claude-opus-4-7" as const;
