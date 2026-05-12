import type { PublicBrief } from "@ctm/brief-schema";
import Link from "next/link";
import { SectionLabel } from "./section-label";

export function Indicators({ items }: { items: PublicBrief["indicators"] }) {
  return (
    <section className="py-8 rule-top">
      <SectionLabel>Forward Indicators</SectionLabel>
      <ul className="space-y-3 max-w-3xl">
        {items.map((ind, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-[color:var(--color-accent)] pt-1 shrink-0">
              ◇
            </span>
            <span className="text-[15px] leading-relaxed text-[color:var(--color-fg)]">
              {ind.text}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/subscribe"
        className="mt-6 inline-block font-mono text-xs text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Rationale behind each indicator in today&rsquo;s newsletter
      </Link>
    </section>
  );
}
