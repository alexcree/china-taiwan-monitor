import { SECTORS, type Sector } from "@ctm/brief-schema";
import { getLatestPublicBrief } from "@/lib/brief";
import { getLatestMarkets } from "@/lib/markets";
import { MarketTicker } from "@/components/market-ticker";
import { SectorCard } from "@/components/brief/sector-card";
import { SectionLabel } from "@/components/brief/section-label";
import { SourceNotes } from "@/components/brief/source-notes";
import { SubscribeInline } from "@/components/subscribe-inline";

// Bias the sector order so business/finance/tech sit prominently up top.
const SECTOR_ORDER: Sector[] = [
  "economy",
  "tech",
  "consumer",
  "property",
  "defense",
  "politics",
  "diplomacy",
  "cyber",
  "influence",
];

export default async function HomePage() {
  const [publicBrief, markets] = await Promise.all([
    getLatestPublicBrief(),
    getLatestMarkets(),
  ]);

  const sectorsWithContent = SECTOR_ORDER.filter((s) =>
    Boolean(publicBrief.sections[s]),
  );
  for (const s of SECTORS) {
    if (publicBrief.sections[s] && !sectorsWithContent.includes(s)) {
      sectorsWithContent.push(s);
    }
  }

  return (
    <>
      <MarketTicker quotes={markets.quotes} isSeed={markets.is_seed} />

      <div className="mx-auto max-w-7xl px-5 pt-5 pb-12">
        <section>
          <SectionLabel
            subtitle={`${sectorsWithContent.length} sectors · EN + ZH sources · ${publicBrief.brief_date}`}
          >
            Headlines
          </SectionLabel>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {sectorsWithContent.map((sector) => {
              const data = publicBrief.sections[sector];
              if (!data) return null;
              return <SectorCard key={sector} sector={sector} data={data} />;
            })}
          </div>
        </section>

        <SubscribeInline />

        <SourceNotes text={publicBrief.source_notes} />
      </div>
    </>
  );
}
