import { SECTORS, type Sector } from "@ctm/brief-schema";
import { getLatestPublicBrief } from "@/lib/brief";
import { BriefHeader } from "@/components/brief/brief-header";
import { ExecSummary } from "@/components/brief/exec-summary";
import { SectorCard } from "@/components/brief/sector-card";
import { SectionLabel } from "@/components/brief/section-label";
import { Assessments } from "@/components/brief/assessments";
import { Indicators } from "@/components/brief/indicators";
import { Scenarios } from "@/components/brief/scenarios";
import { SourceNotes } from "@/components/brief/source-notes";
import { SubscribeInline } from "@/components/subscribe-inline";

export default async function HomePage() {
  const brief = await getLatestPublicBrief();

  const sectorsWithContent = SECTORS.filter(
    (s): s is Sector => Boolean(brief.sections[s]),
  );

  return (
    <>
      <BriefHeader
        briefDate={brief.brief_date}
        escalationRisk={brief.escalation_risk}
        bottomLine={brief.bottom_line}
      />

      <div className="mx-auto max-w-7xl px-5 pb-16">
        <ExecSummary items={brief.exec_summary} />

        <SubscribeInline />

        <section className="py-4">
          <SectionLabel
            subtitle={`${sectorsWithContent.length} sectors covered today`}
          >
            By Sector
          </SectionLabel>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sectorsWithContent.map((sector) => {
              const data = brief.sections[sector];
              if (!data) return null;
              return <SectorCard key={sector} sector={sector} data={data} />;
            })}
          </div>
        </section>

        <Assessments items={brief.assessments} />
        <Indicators items={brief.indicators} />
        <Scenarios items={brief.scenarios} />
        <SourceNotes text={brief.source_notes} />
      </div>
    </>
  );
}
