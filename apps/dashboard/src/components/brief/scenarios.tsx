import type { PublicBrief } from "@ctm/brief-schema";
import Link from "next/link";
import { SectionLabel } from "./section-label";

export function Scenarios({ items }: { items: PublicBrief["scenarios"] }) {
  const sorted = [...items].sort((a, b) => b.probability_pct - a.probability_pct);

  return (
    <section className="py-8 rule-top">
      <SectionLabel>Short-Term Scenarios</SectionLabel>
      <ul className="space-y-5 max-w-3xl">
        {sorted.map((s, i) => (
          <li key={i}>
            <div className="flex items-baseline gap-4 mb-1.5">
              <span className="font-mono text-2xl font-medium tabular-nums text-[color:var(--color-accent)]">
                {s.probability_pct}%
              </span>
              <h3 className="text-base text-[color:var(--color-fg)] font-medium">
                {s.name}
              </h3>
            </div>
            <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed pl-[3.6rem]">
              {s.one_line}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/subscribe"
        className="mt-6 inline-block font-mono text-xs text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Triggers, implications, and analyst notes for each scenario in the newsletter
      </Link>
    </section>
  );
}
