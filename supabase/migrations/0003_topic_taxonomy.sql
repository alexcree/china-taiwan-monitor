-- Topic taxonomy — per-article classification fields.
-- Articles get a primary_topic (one of the 8 visible content topics),
-- free-form subtopic tags, named actors, country codes, and a
-- content_type tag. Populated by the summarizer in @ctm/llm on each
-- article (and backfilled via packages/db/scripts/backfill-summaries.ts).
--
-- Idempotent: safe to re-run.

alter table public.articles
  add column if not exists primary_topic   text,
  add column if not exists subtopics       text[],
  add column if not exists actors          text[],
  add column if not exists countries       text[],
  add column if not exists content_type    text;

-- 8 content topics — the homepage nav uses these.
alter table public.articles
  drop constraint if exists articles_primary_topic_check;
alter table public.articles
  add constraint articles_primary_topic_check
  check (
    primary_topic is null
    or primary_topic in (
      'military',
      'politics',
      'us_china_taiwan',
      'semiconductors',
      'markets',
      'cyber_info_ops',
      'diplomacy',
      'general'
    )
  );

create index if not exists articles_primary_topic_idx
  on public.articles (primary_topic, published_at desc)
  where primary_topic is not null;
create index if not exists articles_subtopics_idx
  on public.articles using gin (subtopics);
create index if not exists articles_countries_idx
  on public.articles using gin (countries);
create index if not exists articles_actors_idx
  on public.articles using gin (actors);
