# China–Taiwan Monitor

Daily intelligence brief on China–Taiwan developments, delivered through three channels:

1. **Live web dashboard** — public, always free.
2. **Email newsletter** — paid premium product.
3. **X auto-posting bot** — reposts critical stories with short analytical context.

Coverage spans defense, politics, diplomacy, economy/finance, technology, property, consumer/business, and influence ops. Sources mix major English wires, Chinese mainland state and independent media, and Taiwan press.

## Architecture

```
[ ingestion workers ] ──► [ articles ] ──► [ scorer ] ──► [ brief generator ] ──► [ briefs ]
                                                                                    │
                                                                  ┌─────────────────┼─────────────────┐
                                                                  ▼                 ▼                 ▼
                                                            newsletter         dashboard           X bot
```

One shared data backbone, three output adapters.

## Repository layout

```
apps/
  dashboard/           Next.js 15 — public dashboard + admin
  worker-ingestion/    pulls articles
  worker-brief/        generates daily brief
  worker-newsletter/   formats + sends
  worker-x-bot/        posts to X
packages/
  brief-schema/        zod schemas + types for brief output
  db/                  Supabase client + types
  llm/                 Anthropic client + prompt templates
  sources/             RSS feeds, source registry, scrapers
  shared/              utilities, logging, types
docs/
  analyst-system-prompt.md   verbatim system prompt for brief generation
```

## Stack

- **Workers / dashboard:** TypeScript + Node 22, pnpm workspaces
- **DB:** Supabase (Postgres + auth + realtime)
- **Dashboard:** Next.js 15 App Router + Tailwind + shadcn/ui, deployed to Vercel
- **LLM:** Anthropic API, `claude-opus-4-7`, prompt caching on the system prompt
- **Email:** Resend
- **Payments:** Stripe (Phase 5)
- **X:** X API v2 (Phase 4–5)
- **Scheduling:** Vercel Cron + a small VPS for the 15-min ingestion loop

## Status

**Phase 1 — dashboard scaffold.** Renders today's brief from seed data. Pipeline, ingestion, newsletter, and X bot wiring come in subsequent phases.

See [docs/analyst-system-prompt.md](docs/analyst-system-prompt.md) for the analyst prompt and full build plan.

## Development

```bash
pnpm install
pnpm dev          # runs apps/dashboard on http://localhost:3000
pnpm typecheck    # type-checks all workspaces
```

Requires Node 22+ and pnpm 11+.
