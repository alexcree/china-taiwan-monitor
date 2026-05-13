import type { PublicBrief } from "@ctm/brief-schema";
import Link from "next/link";
import { SectionLabel } from "./section-label";

export function Indicators({ items }: { items: PublicBrief["indicators"] }) {
  return (
    <section className="py-8">
      <SectionLabel subtitle="Specific, measurable, time-bound">
        Forward Indicators
      </SectionLabel>
      <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2 max-w-5xl">
        {items.map((ind, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-[color:var(--color-accent)] pt-0.5 shrink-0">
              ◇
            </span>
            <span className="text-[14px] leading-snug text-[color:var(--color-fg)]">
              {ind.text}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/subscribe"
        className="mt-5 inline-block font-mono text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Rationale behind each indicator in today&rsquo;s newsletter
      </Link>
    </section>
  );
}
