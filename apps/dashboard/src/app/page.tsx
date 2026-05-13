import { SECTORS, type Sector } from "@ctm/brief-schema";
import { getLatestBrief, getLatestPublicBrief } from "@/lib/brief";
import { getLatestMarkets } from "@/lib/markets";
import { MarketTicker } from "@/components/market-ticker";
import { TopStories } from "@/components/brief/top-stories";
import { SectorCard } from "@/components/brief/sector-card";
import { SectionLabel } from "@/components/brief/section-label";
import { Assessments } from "@/components/brief/assessments";
import { Indicators } from "@/components/brief/indicators";
import { Scenarios } from "@/components/brief/scenarios";
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
  const [brief, publicBrief, markets] = await Promise.all([
    getLatestBrief(),
    getLatestPublicBrief(),
    getLatestMarkets(),
  ]);

  const sectorsWithContent = SECTOR_ORDER.filter((s) =>
    Boolean(publicBrief.sections[s]),
  );
  // Append any non-ordered sectors (defensive — keeps coverage if SECTOR_ORDER drifts).
  for (const s of SECTORS) {
    if (publicBrief.sections[s] && !sectorsWithContent.includes(s)) {
      sectorsWithContent.push(s);
    }
  }

  const now = brief.generated_at;

  return (
    <>
      <MarketTicker quotes={markets.quotes} isSeed={markets.is_seed} />

      <TopStories
        briefDate={publicBrief.brief_date}
        escalationRisk={publicBrief.escalation_risk}
        bottomLine={publicBrief.bottom_line}
        execSummary={publicBrief.exec_summary}
      />

      <div className="mx-auto max-w-7xl px-5 pt-6 pb-16">
        <SubscribeInline />

        <section className="py-2">
          <SectionLabel
            subtitle={`${sectorsWithContent.length} sectors covered · EN + ZH sources`}
          >
            Sector Desks
          </SectionLabel>

          {/* CSS columns for biztoc-style masonry. Cards use break-inside-avoid. */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {sectorsWithContent.map((sector) => {
              const data = publicBrief.sections[sector];
              if (!data) return null;
              return (
                <SectorCard
                  key={sector}
                  sector={sector}
                  data={data}
                  now={now}
                />
              );
            })}
          </div>
        </section>

        <Assessments items={publicBrief.assessments} />
        <Indicators items={publicBrief.indicators} />
        <Scenarios items={publicBrief.scenarios} />
        <SourceNotes text={publicBrief.source_notes} />
      </div>
    </>
  );
}
