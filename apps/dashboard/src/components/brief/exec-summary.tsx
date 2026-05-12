import { SectionLabel } from "./section-label";

export function ExecSummary({ items }: { items: string[] }) {
  return (
    <section className="py-8 rule-top">
      <SectionLabel>Executive Summary</SectionLabel>
      <ul className="space-y-3 max-w-3xl">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-4 text-[15px] leading-relaxed text-[color:var(--color-fg)]"
          >
            <span className="font-mono text-xs text-[color:var(--color-fg-dim)] pt-1 tabular-nums w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
