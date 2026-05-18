import type { ArticleWithSource } from "@ctm/db";
import {
  PRIMARY_TOPIC_LABELS,
  PRIMARY_TOPIC_PATHS,
  type PrimaryTopic,
} from "@ctm/brief-schema";
import { domainOf, isPaywalled } from "@ctm/shared";
import { LocalTime } from "@/components/local-time";
import Link from "next/link";

/**
 * Per-topic pill tint. Subtle background + a colored left bar so the
 * grid still scans cleanly when tiles of different topics sit adjacent.
 */
const TOPIC_TINT: Record<string, string> = {
  military:
    "text-[color:var(--color-risk-high)] border-[color:var(--color-risk-high)]",
  politics:
    "text-[#6a4a8a] border-[#6a4a8a]",
  us_china_taiwan:
    "text-[color:var(--color-accent)] border-[color:var(--color-accent)]",
  semiconductors:
    "text-[color:var(--color-en)] border-[color:var(--color-en)]",
  markets:
    "text-[color:var(--color-risk-low)] border-[color:var(--color-risk-low)]",
  cyber_info_ops:
    "text-[#a85d15] border-[#a85d15]",
  diplomacy:
    "text-[color:var(--color-zh)] border-[color:var(--color-zh)]",
  general:
    "text-[color:var(--color-fg-muted)] border-[color:var(--color-fg-muted)]",
};

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

function TopicPill({ topic }: { topic: string }) {
  const label =
    PRIMARY_TOPIC_LABELS[topic as PrimaryTopic] ?? humanize(topic);
  const path = PRIMARY_TOPIC_PATHS[topic as PrimaryTopic];
  const tint = TOPIC_TINT[topic] ?? TOPIC_TINT.general;
  const pill = (
    <span
      className={`inline-flex items-center font-mono text-[10px] font-bold tracking-[0.14em] uppercase px-1.5 py-0.5 border ${tint}`}
    >
      {label}
    </span>
  );
  return path ? (
    <Link href={`/${path}`} aria-label={`See more in ${label}`}>
      {pill}
    </Link>
  ) : (
    pill
  );
}

function ClusterBadge({ size }: { size: number }) {
  if (size <= 1) return null;
  return (
    <span
      title={`Same story covered by ${size} outlets`}
      className="inline-flex items-center font-mono text-[10px] tracking-wider px-1.5 py-0.5 bg-[color:var(--color-fg)] text-[color:var(--color-bg)]"
    >
      ×{size}
    </span>
  );
}

export function ArticleTile({
  article: a,
  cluster_size,
}: {
  article: ArticleWithSource;
  cluster_size: number;
}) {
  const isZh = a.lang !== "en";
  const sourceLabel =
    a.source?.display_name ?? domainOf(a.url_canonical ?? a.url);
  const paywalled = isPaywalled(a.url, a.paywall ?? undefined);
  const langPillColor =
    a.lang === "en"
      ? "text-[color:var(--color-en)]"
      : "text-[color:var(--color-zh)]";
  const langLabel = a.lang === "en" ? "EN" : "ZH";

  return (
    <article className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-3 py-3 break-inside-avoid mb-5">
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        {a.primary_topic && <TopicPill topic={a.primary_topic} />}
        <ClusterBadge size={cluster_size} />
      </div>

      <a
        href={a.url}
        target="_blank"
        rel="noopener noreferrer"
        className="headline-link block"
      >
        <span className="block text-[15px] leading-snug font-semibold text-[color:var(--color-fg)]">
          {a.title_original}
        </span>
        {isZh && a.title_en && (
          <span className="block mt-0.5 text-[12px] leading-snug text-[color:var(--color-fg-muted)] italic font-normal">
            ↳ {a.title_en}
          </span>
        )}
      </a>

      {a.summary_en && (
        <p className="mt-1.5 text-[13px] leading-snug text-[color:var(--color-fg-muted)]">
          {a.summary_en}
        </p>
      )}

      <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)] flex-wrap">
        <span className={`font-bold tracking-wider ${langPillColor}`}>
          {langLabel}
        </span>
        <span>·</span>
        <span className="truncate">{sourceLabel}</span>
        {paywalled && <PaywallBadge />}
        {a.published_at && (
          <LocalTime
            iso={a.published_at}
            className="ml-auto tabular-nums whitespace-nowrap"
          />
        )}
      </div>
    </article>
  );
}

function humanize(slug: string): string {
  return slug
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
