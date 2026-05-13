import type { EscalationRisk } from "@ctm/brief-schema";
import { formatBriefDate } from "@ctm/shared";
import { EscalationBadge } from "./escalation-badge";

export function BriefHeader({
  briefDate,
  escalationRisk,
  bottomLine,
}: {
  briefDate: string;
  escalationRisk: EscalationRisk;
  bottomLine: string;
}) {
  return (
    <section className="bg-[color:var(--color-surface)] rule-bottom">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex items-center gap-3 mb-3 font-mono text-[11px] tracking-[0.18em] text-[color:var(--color-fg-dim)] uppercase">
          <span className="text-[color:var(--color-accent)] font-bold">
            Daily Brief
          </span>
          <span>·</span>
          <span>{formatBriefDate(briefDate)}</span>
          <span>·</span>
          <span>Vol. 1</span>
          <span className="ml-auto">
            <EscalationBadge risk={escalationRisk} />
          </span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-[color:var(--color-fg)] max-w-5xl">
          {bottomLine}
        </h1>

        <div className="mt-4 font-mono text-xs text-[color:var(--color-fg-dim)]">
          Generated 06:00 local · claude-opus-4-7
        </div>
      </div>
    </section>
  );
}
