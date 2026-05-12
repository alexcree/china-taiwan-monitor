import type { PublicBrief, Sector } from "@ctm/brief-schema";
import { SECTOR_LABELS } from "@ctm/brief-schema";
import { domainOf } from "@ctm/shared";
import Link from "next/link";

type SectorData = NonNullable<PublicBrief["sections"][Sector]>;

export function SectorCard({
  sector,
  data,
}: {
  sector: Sector;
  data: SectorData;
}) {
  const totalSources = data.english_sources.length + data.chinese_sources.length;

  return (
    <article className="rule-top py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-mono text-sm tracking-wider text-[color:var(--color-accent)]">
          {SECTOR_LABELS[sector].toUpperCase()}
        </h2>
        <span className="font-mono text-xs text-[color:var(--color-fg-dim)] tabular-nums">
          {totalSources} src · {data.english_sources.length} EN ·{" "}
          {data.chinese_sources.length} ZH
        </span>
      </div>

      <ul className="space-y-2.5 max-w-3xl mb-7">
        {data.summary.map((line, i) => (
          <li
            key={i}
            className="flex gap-3 text-[15px] leading-relaxed text-[color:var(--color-fg)]"
          >
            <span className="text-[color:var(--color-fg-dim)] pt-0.5 shrink-0">
              ▸
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 mb-6 max-w-3xl">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-fg-dim)] uppercase mb-1">
          Analyst note
          <span className="text-[color:var(--color-accent-dim)]">
            · newsletter only
          </span>
        </div>
        <Link
          href="/subscribe"
          className="text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
        >
          → Read the analyst&rsquo;s synthesis for {SECTOR_LABELS[sector]} in today&rsquo;s newsletter
        </Link>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-fg-dim)] uppercase mb-3">
          Top sources
        </div>
        <ul className="space-y-3">
          {data.english_sources.map((src, i) => (
            <li key={`en-${i}`} className="flex gap-3">
              <span className="font-mono text-[10px] tracking-wider text-[color:var(--color-en)] mt-1 shrink-0">
                EN
              </span>
              <div className="flex-1 min-w-0">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
                >
                  {src.headline}
                </a>
                <div className="mt-0.5 text-sm text-[color:var(--color-fg-muted)] leading-snug">
                  {src.summary_short}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
                  {domainOf(src.url)}
                </div>
              </div>
            </li>
          ))}
          {data.chinese_sources.map((src, i) => (
            <li key={`zh-${i}`} className="flex gap-3">
              <span className="font-mono text-[10px] tracking-wider text-[color:var(--color-zh)] mt-1 shrink-0">
                ZH
              </span>
              <div className="flex-1 min-w-0">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
                >
                  <span className="text-[color:var(--color-fg-muted)] mr-2">
                    {src.headline_original}
                  </span>
                  <span className="text-[color:var(--color-fg-dim)]">
                    — {src.headline_en}
                  </span>
                </a>
                <div className="mt-0.5 text-sm text-[color:var(--color-fg-muted)] leading-snug">
                  {src.summary_short_en}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
                  {domainOf(src.url)}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {totalSources >= 5 && (
          <Link
            href="/subscribe"
            className="mt-4 inline-block font-mono text-xs text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            → Full source list (8–20 articles, annotated) in the newsletter
          </Link>
        )}
      </div>
    </article>
  );
}
