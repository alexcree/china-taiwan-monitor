import type { PublicBrief } from "@ctm/brief-schema";
import Link from "next/link";
import { SectionLabel } from "./section-label";

export function Scenarios({ items }: { items: PublicBrief["scenarios"] }) {
  const sorted = [...items].sort(
    (a, b) => b.probability_pct - a.probability_pct,
  );

  return (
    <section className="py-8">
      <SectionLabel subtitle={`${items.length} short-term scenarios, ranked`}>
        Scenarios
      </SectionLabel>
      <ul className="grid gap-4 md:grid-cols-2">
        {sorted.map((s, i) => (
          <li
            key={i}
            className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 py-3 flex gap-4"
          >
            <div className="font-mono text-3xl font-bold tabular-nums text-[color:var(--color-accent)] leading-none pt-1 shrink-0">
              {s.probability_pct}
              <span className="text-base">%</span>
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-[color:var(--color-fg)] mb-1">
                {s.name}
              </h3>
              <p className="text-[13px] leading-snug text-[color:var(--color-fg-muted)]">
                {s.one_line}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/subscribe"
        className="mt-5 inline-block font-mono text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Triggers, implications, and analyst notes for each scenario in the newsletter
      </Link>
    </section>
  );
}
