import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  PRIMARY_TOPICS,
  PRIMARY_TOPIC_LABELS,
  PRIMARY_TOPIC_PATHS,
  PRIMARY_TOPIC_SCOPES,
} from "@ctm/brief-schema";
import { domainOf, isPaywalled } from "@ctm/shared";
import { topicFromPath, getTopicData } from "@/lib/topic";
import { SectionLabel } from "@/components/brief/section-label";
import { LocalTime } from "@/components/local-time";

export const revalidate = 60;

// Static-generation of all eight topic pages — keeps them edge-fast.
export function generateStaticParams() {
  return PRIMARY_TOPICS.map((t) => ({ topic: PRIMARY_TOPIC_PATHS[t] }));
}

interface RouteParams {
  topic: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { topic: path } = await params;
  const topic = topicFromPath(path);
  if (!topic) return { title: "Not found" };
  return {
    title: `${PRIMARY_TOPIC_LABELS[topic]} — China-Taiwan Monitor`,
    description: PRIMARY_TOPIC_SCOPES[topic],
  };
}

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

export default async function TopicPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { topic: path } = await params;
  const topic = topicFromPath(path);
  if (!topic) notFound();

  const data = await getTopicData(topic);
  const label = PRIMARY_TOPIC_LABELS[topic];
  const scope = PRIMARY_TOPIC_SCOPES[topic];

  return (
    <div className="mx-auto max-w-5xl px-5 pt-6 pb-12">
      <SectionLabel
        subtitle={
          data.articles.length > 0
            ? `${data.articles.length} stories · last 72h`
            : "No coverage in the last 72h"
        }
      >
        {label}
      </SectionLabel>

      <p className="text-[14px] leading-snug text-[color:var(--color-fg-muted)] max-w-3xl mb-5">
        {scope}
      </p>

      {data.articles.length === 0 && (
        <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 py-6 text-sm text-[color:var(--color-fg-muted)]">
          No articles classified under {label.toLowerCase()} in the last 72
          hours. Try again later, or check{" "}
          <Link
            href="/feed"
            className="text-[color:var(--color-accent)] hover:underline"
          >
            the live feed
          </Link>{" "}
          for unclassified items.
        </div>
      )}

      <ul className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] divide-y divide-[color:var(--color-border)]">
        {data.articles.map((a) => {
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
            <li key={a.id} className="px-4 py-3">
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
              <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)] flex-wrap">
                <span className={`font-bold tracking-wider ${langPillColor}`}>
                  {langLabel}
                </span>
                <span>·</span>
                <span className="truncate">{sourceLabel}</span>
                {paywalled && <PaywallBadge />}
                {a.subtopics && a.subtopics.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-[color:var(--color-fg-muted)] truncate">
                      {a.subtopics.slice(0, 3).join(" · ")}
                    </span>
                  </>
                )}
                {a.published_at && (
                  <LocalTime
                    iso={a.published_at}
                    className="ml-auto tabular-nums whitespace-nowrap"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
