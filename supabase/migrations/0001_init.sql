-- China-Taiwan Monitor initial schema.
-- Paste this into the Supabase SQL editor (or apply via the Supabase CLI) to
-- bootstrap the project. Idempotent: safe to re-run.

-- ─────────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────
-- sources — the curated source registry. Mirrors @ctm/sources SEED_SOURCES.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.sources (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  display_name    text not null,
  country         text not null check (country in ('us','uk','cn','tw','hk','jp','intl')),
  lang            text not null check (lang in ('en','zh-cn','zh-tw')),
  tier            int  not null check (tier between 1 and 4),
  mode            text not null check (mode in ('rss','api','scrape','social')),
  category        text not null,
  url             text not null,
  rss_url         text,
  paywall         boolean default false,
  enabled         boolean default true,
  cadence_min     int,
  notes           text,
  last_fetched_at timestamptz,
  last_status     int,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists sources_enabled_tier_idx on public.sources (enabled, tier);
create index if not exists sources_mode_idx          on public.sources (mode);

-- ─────────────────────────────────────────────────────────────────────
-- articles — ingested items, one row per canonical URL.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.articles (
  id               uuid primary key default uuid_generate_v4(),
  source_id        uuid references public.sources(id) on delete set null,
  url              text unique not null,
  url_canonical    text,
  lang             text not null check (lang in ('en','zh-cn','zh-tw')),
  title_original   text not null,
  title_en         text,
  summary          text,
  summary_en       text,
  full_text        text,
  full_text_en     text,
  paywall          boolean,
  -- Dedup
  content_hash     text,
  dup_of           uuid references public.articles(id) on delete set null,
  -- Triage outputs
  sectors          text[],
  importance       int check (importance between 0 and 10),
  breaking         boolean default false,
  triaged_at       timestamptz,
  -- Lifecycle
  posted_to_x      boolean default false,
  published_at     timestamptz,
  fetched_at       timestamptz default now(),
  created_at       timestamptz default now()
);

create index if not exists articles_published_at_idx       on public.articles (published_at desc);
create index if not exists articles_source_published_idx   on public.articles (source_id, published_at desc);
create index if not exists articles_importance_idx         on public.articles (importance desc, published_at desc) where importance is not null;
create index if not exists articles_breaking_idx           on public.articles (breaking, published_at desc) where breaking = true;
create index if not exists articles_content_hash_idx       on public.articles (content_hash) where content_hash is not null;
create index if not exists articles_sectors_idx            on public.articles using gin (sectors);
create index if not exists articles_lang_idx               on public.articles (lang);

-- ─────────────────────────────────────────────────────────────────────
-- briefs — daily generated briefs.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.briefs (
  id                      uuid primary key default uuid_generate_v4(),
  brief_date              date unique not null,
  exec_summary            jsonb not null,
  sections                jsonb not null,
  assessments             jsonb not null,
  indicators              jsonb not null,
  scenarios               jsonb not null,
  escalation_risk         text not null check (escalation_risk in ('low','moderate','high')),
  escalation_rationale    text not null,
  bottom_line             text not null,
  bottom_line_extended    text not null,
  cross_sector_synthesis  text not null,
  source_notes            text not null,
  generated_at            timestamptz default now()
);

create index if not exists briefs_date_idx on public.briefs (brief_date desc);

-- ─────────────────────────────────────────────────────────────────────
-- posts — outbound dispatch log (X, email, dashboard breaking).
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id          uuid primary key default uuid_generate_v4(),
  brief_id    uuid references public.briefs(id)   on delete set null,
  article_id  uuid references public.articles(id) on delete set null,
  channel     text not null check (channel in ('x','email','dashboard')),
  content     text,
  external_id text,
  status      text not null check (status in ('queued','sent','failed','review','breaking')),
  posted_at   timestamptz,
  created_at  timestamptz default now()
);

create index if not exists posts_status_idx       on public.posts (status, created_at desc);
create index if not exists posts_channel_idx      on public.posts (channel, created_at desc);

-- ─────────────────────────────────────────────────────────────────────
-- subscribers — Phase-5 newsletter subscribers.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.subscribers (
  id                  uuid primary key default uuid_generate_v4(),
  email               text unique not null,
  stripe_customer_id  text,
  stripe_sub_id       text,
  status              text not null check (status in ('active','past_due','canceled','trialing','allowlist')),
  current_period_end  timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists subscribers_status_idx on public.subscribers (status);

-- ─────────────────────────────────────────────────────────────────────
-- Helper: trigger to keep updated_at fresh.
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists sources_touch     on public.sources;
drop trigger if exists subscribers_touch on public.subscribers;

create trigger sources_touch     before update on public.sources     for each row execute function public.touch_updated_at();
create trigger subscribers_touch before update on public.subscribers for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────────────────────────────
alter table public.sources     enable row level security;
alter table public.articles    enable row level security;
alter table public.briefs      enable row level security;
alter table public.posts       enable row level security;
alter table public.subscribers enable row level security;

-- Sources and articles are publicly readable (the dashboard is unauthenticated).
-- Writes go through the service role (which bypasses RLS by design).
drop policy if exists "sources public read"   on public.sources;
drop policy if exists "articles public read"  on public.articles;
drop policy if exists "briefs public read"    on public.briefs;

create policy "sources public read"  on public.sources  for select using (true);
create policy "articles public read" on public.articles for select using (true);
create policy "briefs public read"   on public.briefs   for select using (true);

-- posts and subscribers: no public policy. Service role only for Phase 2.

-- ─────────────────────────────────────────────────────────────────────
-- Realtime — broadcast new articles + briefs to subscribers.
-- Safe even if the publication already includes the table.
-- ─────────────────────────────────────────────────────────────────────
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      execute 'alter publication supabase_realtime add table public.articles';
    exception when duplicate_object then null;
    end;
    begin
      execute 'alter publication supabase_realtime add table public.briefs';
    exception when duplicate_object then null;
    end;
  end if;
end $$;
