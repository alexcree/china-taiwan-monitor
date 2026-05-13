import { SectionLabel } from "./section-label";

export function ExecSummary({ items }: { items: string[] }) {
  return (
    <section className="py-8">
      <SectionLabel subtitle={`${items.length} top developments in last 24h`}>
        Executive Summary
      </SectionLabel>
      <ol className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-xs text-[color:var(--color-accent)] pt-1 tabular-nums shrink-0 font-bold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[15px] leading-snug text-[color:var(--color-fg)]">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
