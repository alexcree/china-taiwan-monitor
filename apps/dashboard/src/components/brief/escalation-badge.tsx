import type { EscalationRisk } from "@ctm/brief-schema";
import { cn } from "@/lib/cn";

const STYLES: Record<EscalationRisk, string> = {
  low: "text-[color:var(--color-risk-low)] border-[color:var(--color-risk-low)]",
  moderate:
    "text-[color:var(--color-risk-moderate)] border-[color:var(--color-risk-moderate)]",
  high: "text-[color:var(--color-risk-high)] border-[color:var(--color-risk-high)]",
};

export function EscalationBadge({ risk }: { risk: EscalationRisk }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs tracking-wider px-2 py-1 border",
        STYLES[risk],
      )}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      RISK: {risk.toUpperCase()}
    </div>
  );
}
