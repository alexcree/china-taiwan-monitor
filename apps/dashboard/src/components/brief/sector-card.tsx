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
  const totalSources =
    data.english_sources.length + data.chinese_sources.length;

  // Top 2 summary bullets only — keep the card dense.
  const topSummary = data.summary.slice(0, 2);

  return (
    <article className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] flex flex-col">
      <header className="px-4 py-2.5 border-b border-[color:var(--color-border)] flex items-baseline justify-between bg-[color:var(--color-surface-2)]">
        <h2 className="font-mono text-[12px] font-bold tracking-[0.18em] text-[color:var(--color-accent)]">
          {SECTOR_LABELS[sector].toUpperCase()}
        </h2>
        <span className="font-mono text-[10px] text-[color:var(--color-fg-dim)] tabular-nums">
          {totalSources} src
        </span>
      </header>

      {topSummary.length > 0 && (
        <div className="px-4 py-3 border-b border-[color:var(--color-border)]">
          <ul className="space-y-1.5">
            {topSummary.map((line, i) => (
              <li
                key={i}
                className="flex gap-2 text-[13px] leading-snug text-[color:var(--color-fg-muted)]"
              >
                <span className="text-[color:var(--color-accent)] shrink-0 pt-0.5">
                  ▸
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="divide-y divide-[color:var(--color-border)]">
        {data.english_sources.map((src, i) => (
          <li key={`en-${i}`} className="px-4 py-2.5">
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="headline-link block text-[14px] leading-snug font-medium"
            >
              {src.headline}
            </a>
            <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-[color:var(--color-fg-dim)]">
              <span className="text-[color:var(--color-en)] font-semibold tracking-wider">
                EN
              </span>
              <span>·</span>
              <span>{domainOf(src.url)}</span>
            </div>
          </li>
        ))}
        {data.chinese_sources.map((src, i) => (
          <li key={`zh-${i}`} className="px-4 py-2.5">
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="headline-link block"
            >
              <span className="block text-[14px] leading-snug font-medium">
                {src.headline_original}
              </span>
              <span className="block mt-0.5 text-[12px] leading-snug text-[color:var(--color-fg-muted)] italic">
                ↳ {src.headline_en}
              </span>
            </a>
            <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-[color:var(--color-fg-dim)]">
              <span className="text-[color:var(--color-zh)] font-semibold tracking-wider">
                ZH
              </span>
              <span>·</span>
              <span>{domainOf(src.url)}</span>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-auto px-4 py-2.5 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
        <Link
          href="/subscribe"
          className="font-mono text-[11px] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
        >
          → Full list + analyst note in newsletter
        </Link>
      </footer>
    </article>
  );
}
