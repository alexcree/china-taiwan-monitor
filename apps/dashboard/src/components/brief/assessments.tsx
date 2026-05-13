import type { PublicBrief, Confidence, Actor } from "@ctm/brief-schema";
import Link from "next/link";
import { SectionLabel } from "./section-label";

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  low: "text-[color:var(--color-fg-dim)] border-[color:var(--color-fg-dim)]",
  moderate:
    "text-[color:var(--color-accent)] border-[color:var(--color-accent)]",
  high: "text-[color:var(--color-risk-low)] border-[color:var(--color-risk-low)]",
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
    <section className="py-8">
      <SectionLabel subtitle={`${items.length} analyst calls`}>
        Assessments
      </SectionLabel>
      <ul className="space-y-4 max-w-4xl">
        {items.map((a, i) => (
          <li key={i} className="flex gap-4">
            <span className="font-mono text-xs text-[color:var(--color-fg-dim)] pt-1 tabular-nums shrink-0 w-6">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <p className="text-[15px] leading-snug text-[color:var(--color-fg)]">
                {a.judgment}
              </p>
              <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] tracking-wider">
                <span
                  className={`px-1.5 py-0.5 border font-semibold ${CONFIDENCE_STYLES[a.confidence]}`}
                >
                  {a.confidence.toUpperCase()}
                </span>
                <span className="text-[color:var(--color-fg-dim)]">
                  ACTOR · {ACTOR_LABELS[a.actor]}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/subscribe"
        className="mt-5 inline-block font-mono text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Reasoning behind each assessment in today&rsquo;s newsletter
      </Link>
    </section>
  );
}
