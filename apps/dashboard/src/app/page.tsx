import { getHome } from "@/lib/home";
import { getLatestMarkets } from "@/lib/markets";
import { MarketTicker } from "@/components/market-ticker";
import { TopicCard } from "@/components/topic-card";
import { SectionLabel } from "@/components/brief/section-label";
import { SubscribeInline } from "@/components/subscribe-inline";
import { TopLead } from "@/components/top-lead";
import { PRIMARY_TOPIC_ORDER } from "@ctm/brief-schema";

// Match /feed cadence — close to the 15-min ingestion pass.
export const revalidate = 60;

export default async function HomePage() {
  const [home, markets] = await Promise.all([
    getHome(),
    getLatestMarkets(),
  ]);

  // Walk the canonical primary_topic order, dropping empty buckets, then
  // append any non-enum topics that happen to be present (shouldn't happen
  // with the check constraint, but harmless).
  const orderedTopics = [
    ...PRIMARY_TOPIC_ORDER.filter(
      (t) => (home.buckets.get(t)?.length ?? 0) > 0,
    ),
    ...Array.from(home.buckets.keys()).filter(
      (t) =>
        !PRIMARY_TOPIC_ORDER.includes(t as (typeof PRIMARY_TOPIC_ORDER)[number]) &&
        (home.buckets.get(t)?.length ?? 0) > 0,
    ),
  ];

  const lead = home.leads[0];
  const secondaries = home.leads.slice(1, 4);

  return (
    <>
      <MarketTicker
        quotes={markets.quotes}
        isSeed={markets.is_seed}
        asOf={markets.as_of}
      />

      {lead && <TopLead lead={lead} secondaries={secondaries} />}

      <div className="mx-auto max-w-7xl px-5 pt-5 pb-12">
        {home.source === "seed" && (
          <div className="mb-5 border-l-4 border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] px-4 py-3 text-[13px] leading-snug text-[color:var(--color-fg)]">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-accent)] font-bold mr-2">
              Seed mode
            </span>
            Supabase is not configured. Once the ingestion worker has classified
            articles, this page will render live coverage grouped by topic.
          </div>
        )}

        <SectionLabel
          subtitle={`${home.totalArticles} headlines · last 24h · ${orderedTopics.length} topics`}
        >
          Headlines
        </SectionLabel>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
          {orderedTopics.map((topic) => {
            const items = home.buckets.get(topic) ?? [];
            return <TopicCard key={topic} topic={topic} articles={items} />;
          })}
        </div>

        <SubscribeInline />
      </div>
    </>
  );
}
