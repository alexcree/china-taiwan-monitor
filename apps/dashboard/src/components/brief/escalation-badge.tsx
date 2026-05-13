import type { EscalationRisk } from "@ctm/brief-schema";
import { cn } from "@/lib/cn";

const STYLES: Record<EscalationRisk, string> = {
  low: "text-[color:var(--color-risk-low)] border-[color:var(--color-risk-low)] bg-[color:var(--color-risk-low)]/5",
  moderate:
    "text-[color:var(--color-risk-moderate)] border-[color:var(--color-risk-moderate)] bg-[color:var(--color-risk-moderate)]/5",
  high: "text-[color:var(--color-risk-high)] border-[color:var(--color-risk-high)] bg-[color:var(--color-risk-high)]/5",
};

export function EscalationBadge({ risk }: { risk: EscalationRisk }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.12em] px-2 py-0.5 border",
        STYLES[risk],
      )}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      RISK: {risk.toUpperCase()}
    </span>
  );
}
