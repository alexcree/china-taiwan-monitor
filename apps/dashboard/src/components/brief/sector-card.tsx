import type { PublicBrief, Sector } from "@ctm/brief-schema";
import { SECTOR_LABELS } from "@ctm/brief-schema";
import { domainOf, formatArticleTime, isPaywalled } from "@ctm/shared";
import Link from "next/link";

type SectorData = NonNullable<PublicBrief["sections"][Sector]>;

function PaywallBadge() {
  return (
    <span
      title="Behind a paywall"
      className="inline-flex items-center justify-center font-mono text-[9px] font-bold tracking-wider px-1 py-px border border-[color:var(--color-accent)] text-[color:var(--color-accent)] leading-none"
    >
      $
    </span>
  );
}

function SourceByline({
  url,
  lang,
  publishedAt,
  paywall,
}: {
  url: string;
  lang: "EN" | "ZH";
  publishedAt?: string;
  paywall?: boolean;
}) {
  const paywalled = isPaywalled(url, paywall);
  const langColor =
    lang === "EN" ? "text-[color:var(--color-en)]" : "text-[color:var(--color-zh)]";
  return (
    <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)]">
      <span className={`font-bold tracking-wider ${langColor}`}>{lang}</span>
      <span>·</span>
      <span className="truncate">{domainOf(url)}</span>
      {paywalled && <PaywallBadge />}
      {publishedAt && (
        <span className="ml-auto tabular-nums whitespace-nowrap">
          {formatArticleTime(publishedAt)}
        </span>
      )}
    </div>
  );
}

export function SectorCard({
  sector,
  data,
}: {
  sector: Sector;
  data: SectorData;
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
            <SourceByline
              url={src.url}
              lang="EN"
              publishedAt={src.published_at}
              paywall={src.paywall}
            />
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
            <SourceByline
              url={src.url}
              lang="ZH"
              publishedAt={src.published_at}
              paywall={src.paywall}
            />
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
