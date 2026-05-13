-- Market quotes table — populated by worker-ingestion every 15 min from
-- Yahoo Finance. One row per symbol, last value overwrites on each fetch.
-- Idempotent: safe to re-run.

create table if not exists public.market_quotes (
  symbol      text primary key,
  label       text not null,
  region      text not null check (region in ('cn','hk','tw','us','global')),
  category    text not null check (category in ('equity','fx','commodity','rate','etf')),
  last        numeric not null,
  change_pct  numeric not null,
  note        text,
  as_of       timestamptz not null,
  fetched_at  timestamptz default now()
);

create index if not exists market_quotes_region_idx on public.market_quotes (region);
create index if not exists market_quotes_category_idx on public.market_quotes (category);
create index if not exists market_quotes_fetched_at_idx on public.market_quotes (fetched_at desc);

alter table public.market_quotes enable row level security;

drop policy if exists "market_quotes public read" on public.market_quotes;
create policy "market_quotes public read"
  on public.market_quotes
  for select
  using (true);

-- Realtime — broadcast on every update so the dashboard can subscribe.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      execute 'alter publication supabase_realtime add table public.market_quotes';
    exception when duplicate_object then null;
    end;
  end if;
end $$;
