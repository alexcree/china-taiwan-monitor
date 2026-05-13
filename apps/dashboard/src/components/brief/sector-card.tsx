import type { PublicBrief, Sector } from "@ctm/brief-schema";
import { SECTOR_LABELS } from "@ctm/brief-schema";
import { domainOf, relativeTime } from "@ctm/shared";
import Link from "next/link";

type SectorData = NonNullable<PublicBrief["sections"][Sector]>;

export function SectorCard({
  sector,
  data,
  now,
}: {
  sector: Sector;
  data: SectorData;
  /** ISO datetime used as "now" for relative-time rendering. */
  now: string;
}) {
  const totalSources =
    data.english_sources.length + data.chinese_sources.length;

  return (
    <article className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] flex flex-col break-inside-avoid mb-5">
      <header className="px-3 py-2 border-b border-[color:var(--color-border)] flex items-baseline justify-between bg-[color:var(--color-fg)] text-[color:var(--color-bg)]">
        <h2 className="font-mono text-[11px] font-bold tracking-[0.18em]">
          {SECTOR_LABELS[sector].toUpperCase()}
        </h2>
        <span className="font-mono text-[10px] tabular-nums opacity-70">
          {totalSources} src
        </span>
      </header>

      <ul className="divide-y divide-[color:var(--color-border)]">
        {data.english_sources.map((src, i) => (
          <li key={`en-${i}`} className="px-3 py-2">
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="headline-link block text-[13px] leading-snug"
            >
              {src.headline}
            </a>
            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)]">
              <span className="text-[color:var(--color-en)] font-bold tracking-wider">
                EN
              </span>
              <span>·</span>
              <span className="truncate">{domainOf(src.url)}</span>
              {src.published_at && (
                <>
                  <span className="ml-auto tabular-nums">
                    {relativeTime(src.published_at, now)}
                  </span>
                </>
              )}
            </div>
          </li>
        ))}
        {data.chinese_sources.map((src, i) => (
          <li key={`zh-${i}`} className="px-3 py-2">
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="headline-link block"
            >
              <span className="block text-[13px] leading-snug">
                {src.headline_original}
              </span>
              <span className="block mt-0.5 text-[11px] leading-snug text-[color:var(--color-fg-muted)] italic">
                ↳ {src.headline_en}
              </span>
            </a>
            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)]">
              <span className="text-[color:var(--color-zh)] font-bold tracking-wider">
                ZH
              </span>
              <span>·</span>
              <span className="truncate">{domainOf(src.url)}</span>
              {src.published_at && (
                <span className="ml-auto tabular-nums">
                  {relativeTime(src.published_at, now)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-auto px-3 py-1.5 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
        <Link
          href="/subscribe"
          className="font-mono text-[10px] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
        >
          → Full list + analyst note in newsletter
        </Link>
      </footer>
    </article>
  );
}
