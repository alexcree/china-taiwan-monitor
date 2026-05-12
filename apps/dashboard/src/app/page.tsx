import { SECTORS, type Sector } from "@ctm/brief-schema";
import { getLatestPublicBrief } from "@/lib/brief";
import { BriefHeader } from "@/components/brief/brief-header";
import { ExecSummary } from "@/components/brief/exec-summary";
import { BottomLine } from "@/components/brief/bottom-line";
import { SectorCard } from "@/components/brief/sector-card";
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
    <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
      <BriefHeader
        briefDate={brief.brief_date}
        escalationRisk={brief.escalation_risk}
      />

      <ExecSummary items={brief.exec_summary} />
      <BottomLine text={brief.bottom_line} />

      <SubscribeInline />

      {sectorsWithContent.map((sector) => {
        const data = brief.sections[sector];
        if (!data) return null;
        return <SectorCard key={sector} sector={sector} data={data} />;
      })}

      <Assessments items={brief.assessments} />
      <Indicators items={brief.indicators} />
      <Scenarios items={brief.scenarios} />
      <SourceNotes text={brief.source_notes} />
    </div>
  );
}
