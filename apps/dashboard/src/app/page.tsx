import { getHome } from "@/lib/home";
import { getLatestMarkets } from "@/lib/markets";
import { MarketTicker } from "@/components/market-ticker";
import { ArticleTile } from "@/components/article-tile";
import { SourceLatestSection } from "@/components/source-latest-section";
import { SectionLabel } from "@/components/brief/section-label";
import { TopLead } from "@/components/top-lead";

export const revalidate = 60;

export default async function HomePage() {
  const [home, markets] = await Promise.all([
    getHome(),
    getLatestMarkets(),
  ]);

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
            Supabase is not configured. The live page renders headlines from
            the worker once articles are ingested and classified.
          </div>
        )}

        <SectionLabel
          subtitle={`${home.tiles.length} headlines · last 24h · ranked by cross-source coverage`}
        >
          Headlines
        </SectionLabel>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {home.tiles.map((t) => (
            <ArticleTile key={t.article.id} article={t.article} />
          ))}
        </div>

        <SourceLatestSection groups={home.bySource} />
      </div>
    </>
  );
}
