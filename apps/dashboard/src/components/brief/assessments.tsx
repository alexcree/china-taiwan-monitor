import type { PublicBrief, Confidence, Actor } from "@ctm/brief-schema";
import Link from "next/link";
import { SectionLabel } from "./section-label";

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  low: "text-[color:var(--color-fg-dim)]",
  moderate: "text-[color:var(--color-accent)]",
  high: "text-[color:var(--color-risk-low)]",
};

const ACTOR_LABELS: Record<Actor, string> = {
  china: "CN",
  taiwan: "TW",
  us: "US",
  allies: "Allies",
  multiple: "Multi",
};

export function Assessments({
  items,
}: {
  items: PublicBrief["assessments"];
}) {
  return (
    <section className="py-8 rule-top">
      <SectionLabel>Assessments</SectionLabel>
      <ul className="space-y-5 max-w-3xl">
        {items.map((a, i) => (
          <li key={i} className="flex gap-4">
            <div className="font-mono text-xs text-[color:var(--color-fg-dim)] pt-1 tabular-nums w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <p className="text-[15px] leading-relaxed text-[color:var(--color-fg)]">
                {a.judgment}
              </p>
              <div className="mt-1.5 flex items-center gap-3 font-mono text-[11px] tracking-wider">
                <span className={CONFIDENCE_STYLES[a.confidence]}>
                  {a.confidence.toUpperCase()} CONFIDENCE
                </span>
                <span className="text-[color:var(--color-fg-dim)]">·</span>
                <span className="text-[color:var(--color-fg-dim)]">
                  ACTOR: {ACTOR_LABELS[a.actor]}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/subscribe"
        className="mt-6 inline-block font-mono text-xs text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Reasoning behind each assessment in today&rsquo;s newsletter
      </Link>
    </section>
  );
}
