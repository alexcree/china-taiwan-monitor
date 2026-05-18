import type { SourceLatestGroup } from "@/lib/home";
import { isPaywalled } from "@ctm/shared";
import { LocalTime } from "@/components/local-time";

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

function TierBadge({ tier }: { tier: number }) {
  const tint =
    tier === 1
      ? "text-[color:var(--color-accent)] border-[color:var(--color-accent)]"
      : tier === 2
        ? "text-[color:var(--color-fg-muted)] border-[color:var(--color-fg-muted)]"
        : "text-[color:var(--color-fg-dim)] border-[color:var(--color-fg-dim)]";
  return (
    <span
      className={`inline-flex items-center font-mono text-[9px] tracking-wider px-1 py-px border ${tint}`}
    >
      T{tier}
    </span>
  );
}

function SourceCard({ group }: { group: SourceLatestGroup }) {
  return (
    <section className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-3 py-3 break-inside-avoid mb-5">
      <header className="flex items-center gap-2 mb-2 flex-wrap">
        <a
          href={group.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-bold text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] truncate"
        >
          {group.name}
        </a>
        <TierBadge tier={group.tier} />
        {group.paywall && <PaywallBadge />}
        <span className="ml-auto font-mono text-[10px] text-[color:var(--color-fg-dim)] uppercase">
          {group.country}
        </span>
      </header>
      <ul className="divide-y divide-[color:var(--color-border)]">
        {group.articles.map((a) => {
          const isZh = a.lang !== "en";
          return (
            <li key={a.id} className="py-1.5">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="headline-link block"
              >
                <span className="block text-[13px] leading-snug text-[color:var(--color-fg)]">
                  {a.title_original}
                </span>
                {isZh && a.title_en && (
                  <span className="block mt-0.5 text-[11px] leading-snug text-[color:var(--color-fg-muted)] italic">
                    ↳ {a.title_en}
                  </span>
                )}
              </a>
              {a.published_at && (
                <LocalTime
                  iso={a.published_at}
                  className="mt-0.5 block font-mono text-[10px] text-[color:var(--color-fg-dim)] tabular-nums"
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Bottom-of-home section: every active source labeled, with its 7 most
 * recent China-relevant headlines listed underneath. Headlines only —
 * no summaries (this is the "scan all outlets" section).
 */
export function SourceLatestSection({
  groups,
}: {
  groups: SourceLatestGroup[];
}) {
  if (groups.length === 0) return null;
  return (
    <section className="mt-12">
      <div className="rule-top-strong pt-3 pb-4 mb-5 flex items-baseline gap-3">
        <h2 className="font-mono text-[11px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
          Latest by Source
        </h2>
        <span className="font-mono text-[11px] text-[color:var(--color-fg-dim)] tracking-wide">
          {groups.length} outlets · last 7 days · 7 headlines each
        </span>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {groups.map((g) => (
          <SourceCard key={g.slug} group={g} />
        ))}
      </div>
    </section>
  );
}
