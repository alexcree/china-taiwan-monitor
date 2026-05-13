import type { EscalationRisk } from "@ctm/brief-schema";
import { formatBriefDate } from "@ctm/shared";
import { EscalationBadge } from "./escalation-badge";

export function TopStories({
  briefDate,
  escalationRisk,
  bottomLine,
  execSummary,
}: {
  briefDate: string;
  escalationRisk: EscalationRisk;
  bottomLine: string;
  execSummary: string[];
}) {
  return (
    <section className="bg-[color:var(--color-surface)] rule-bottom">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] text-[color:var(--color-fg-dim)] uppercase">
          <span className="text-[color:var(--color-accent)] font-bold">
            Top of the Brief
          </span>
          <span>·</span>
          <span>{formatBriefDate(briefDate)}</span>
          <span>·</span>
          <span>Vol. 1</span>
          <span className="ml-auto">
            <EscalationBadge risk={escalationRisk} />
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-[34px] leading-[1.15] tracking-tight text-[color:var(--color-fg)]">
              {bottomLine}
            </h1>
            <div className="mt-3 font-mono text-xs text-[color:var(--color-fg-dim)]">
              Generated 06:00 local · claude-opus-4-7
            </div>
          </div>

          <ol className="grid gap-y-2 grid-cols-1 sm:grid-cols-2 self-start">
            {execSummary.map((item, i) => (
              <li key={i} className="flex gap-2 break-inside-avoid">
                <span className="font-mono text-[11px] text-[color:var(--color-accent)] pt-1 tabular-nums shrink-0 font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] leading-snug text-[color:var(--color-fg)]">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
