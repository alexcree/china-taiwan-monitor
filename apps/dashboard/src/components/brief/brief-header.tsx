import type { EscalationRisk } from "@ctm/brief-schema";
import { formatBriefDate } from "@ctm/shared";
import { EscalationBadge } from "./escalation-badge";

export function BriefHeader({
  briefDate,
  escalationRisk,
}: {
  briefDate: string;
  escalationRisk: EscalationRisk;
}) {
  return (
    <header className="pb-8">
      <div className="flex items-center gap-3 mb-6 font-mono text-xs tracking-wider text-[color:var(--color-fg-dim)]">
        <span>DAILY BRIEF</span>
        <span>·</span>
        <span>{formatBriefDate(briefDate)}</span>
        <span>·</span>
        <span>VOL. 1</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight max-w-3xl">
        China–Taiwan developments,{" "}
        <span className="text-[color:var(--color-fg-muted)]">
          a daily intelligence brief.
        </span>
      </h1>

      <div className="mt-6 flex items-center gap-4">
        <EscalationBadge risk={escalationRisk} />
        <span className="font-mono text-xs text-[color:var(--color-fg-dim)]">
          Generated 06:00 local · {/* placeholder until real generated_at */}
          model claude-opus-4-7
        </span>
      </div>
    </header>
  );
}
