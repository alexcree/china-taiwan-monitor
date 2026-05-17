import type { ArticleWithSource } from "@ctm/db";
import {
  PRIMARY_TOPIC_LABELS,
  PRIMARY_TOPIC_PATHS,
  type PrimaryTopic,
} from "@ctm/brief-schema";
import { domainOf, isPaywalled } from "@ctm/shared";
import { LocalTime } from "@/components/local-time";
import Link from "next/link";

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

function Byline({
  url,
  lang,
  publishedAt,
  paywall,
  sourceLabel,
}: {
  url: string;
  lang: "en" | "zh-cn" | "zh-tw";
  publishedAt?: string | null;
  paywall?: boolean | null;
  sourceLabel: string;
}) {
  const paywalled = isPaywalled(url, paywall ?? undefined);
  const langPillColor =
    lang === "en"
      ? "text-[color:var(--color-en)]"
      : "text-[color:var(--color-zh)]";
  const langLabel = lang === "en" ? "EN" : "ZH";
  return (
    <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)] flex-wrap">
      <span className={`font-bold tracking-wider ${langPillColor}`}>
        {langLabel}
      </span>
      <span>·</span>
      <span className="truncate">{sourceLabel}</span>
      {paywalled && <PaywallBadge />}
      {publishedAt && (
        <LocalTime
          iso={publishedAt}
          className="ml-auto tabular-nums whitespace-nowrap"
        />
      )}
    </div>
  );
}

/**
 * Card that renders one primary_topic bucket on the home page (or a
 * compact per-topic view on the topic landing pages). Header links to
 * the dedicated topic page if `linkedHeader` is true.
 */
export function TopicCard({
  topic,
  articles,
  linkedHeader = true,
}: {
  topic: string;
  articles: ArticleWithSource[];
  linkedHeader?: boolean;
}) {
  if (articles.length === 0) return null;
  const label =
    PRIMARY_TOPIC_LABELS[topic as PrimaryTopic] ?? topicLabelFallback(topic);
  const path = PRIMARY_TOPIC_PATHS[topic as PrimaryTopic];

  const HeaderInner = (
    <header className="px-3 py-2 border-b border-[color:var(--color-border)] flex items-baseline justify-between bg-[color:var(--color-fg)] text-[color:var(--color-bg)]">
      <h2 className="font-mono text-[11px] font-bold tracking-[0.18em]">
        {label.toUpperCase()}
      </h2>
      <span className="font-mono text-[10px] tabular-nums opacity-70">
        {articles.length}
      </span>
    </header>
  );

  return (
    <article className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] flex flex-col break-inside-avoid mb-5">
      {linkedHeader && path ? (
        <Link href={`/${path}`} aria-label={`See more in ${label}`}>
          {HeaderInner}
        </Link>
      ) : (
        HeaderInner
      )}

      <ul className="divide-y divide-[color:var(--color-border)]">
        {articles.map((a) => {
          const isZh = a.lang !== "en";
          const sourceLabel =
            a.source?.display_name ?? domainOf(a.url_canonical ?? a.url);
          return (
            <li key={a.id} className="px-3 py-2.5">
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
              <Byline
                url={a.url}
                lang={a.lang as "en" | "zh-cn" | "zh-tw"}
                publishedAt={a.published_at}
                paywall={a.paywall}
                sourceLabel={sourceLabel}
              />
            </li>
          );
        })}
      </ul>

      {linkedHeader && path && (
        <footer className="mt-auto px-3 py-1.5 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
          <Link
            href={`/${path}`}
            className="font-mono text-[10px] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            → More {label.toLowerCase()}
          </Link>
        </footer>
      )}
    </article>
  );
}

function topicLabelFallback(slug: string): string {
  return slug
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
