import { getHome } from "@/lib/home";
import { getLatestMarkets } from "@/lib/markets";
import { MarketTicker } from "@/components/market-ticker";
import {
  SourceCategoryCard,
  CATEGORY_ORDER,
} from "@/components/source-category-card";
import { SectionLabel } from "@/components/brief/section-label";
import { SubscribeInline } from "@/components/subscribe-inline";

// Match /feed cadence — close to the 15-min ingestion pass.
export const revalidate = 60;

export default async function HomePage() {
  const [home, markets] = await Promise.all([
    getHome(),
    getLatestMarkets(),
  ]);

  const orderedCats = [
    ...CATEGORY_ORDER.filter((c) => (home.buckets.get(c)?.length ?? 0) > 0),
    ...Array.from(home.buckets.keys()).filter(
      (c) => !CATEGORY_ORDER.includes(c) && (home.buckets.get(c)?.length ?? 0) > 0,
    ),
  ];

  return (
    <>
      <MarketTicker quotes={markets.quotes} isSeed={markets.is_seed} />

      <div className="mx-auto max-w-7xl px-5 pt-5 pb-12">
        {home.source === "seed" && (
          <div className="mb-5 border-l-4 border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] px-4 py-3 text-[13px] leading-snug text-[color:var(--color-fg)]">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-accent)] font-bold mr-2">
              Seed mode
            </span>
            Supabase is not configured. Once the ingestion worker has made its
            first pass, this page will render live articles grouped by source
            category.
          </div>
        )}

        <SectionLabel
          subtitle={`${home.totalArticles} headlines · last 36h · ${orderedCats.length} desks`}
        >
          Headlines
        </SectionLabel>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
          {orderedCats.map((cat) => {
            const items = home.buckets.get(cat) ?? [];
            return (
              <SourceCategoryCard key={cat} category={cat} articles={items} />
            );
          })}
        </div>

        <SubscribeInline />
      </div>
    </>
  );
}
