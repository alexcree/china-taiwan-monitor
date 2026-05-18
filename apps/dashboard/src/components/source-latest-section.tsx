import type { SourceLatestGroup } from "@/lib/home";
import { isPaywalled } from "@ctm/shared";
import { LocalTime } from "@/components/local-time";

/**
 * Curated palette of 14 distinct, accessibility-friendly colors that fit
 * the newsprint aesthetic. Each source slug deterministically maps to one
 * via FNV-1a hash, so a given outlet keeps its color across renders.
 */
const SOURCE_PALETTE = [
  "#a31818", // deep red
  "#b8410a", // oxide orange
  "#a85d15", // amber
  "#7a5a1a", // mustard
  "#5d7a1a", // olive
  "#2d7a4a", // forest
  "#0e7a7a", // teal
  "#1a5a8a", // ocean
  "#1a4480", // steel blue
  "#3a4a8a", // indigo
  "#6a4a8a", // mauve
  "#8a3a6a", // magenta
  "#7a4a2a", // brown
  "#4a4a5a", // slate
];

function colorForSlug(slug: string): string {
  // FNV-1a hash → palette index. Stable across renders.
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return SOURCE_PALETTE[Math.abs(h) % SOURCE_PALETTE.length]!;
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

function SourceCard({ group }: { group: SourceLatestGroup }) {
  const color = colorForSlug(group.slug);
  return (
    <section
      className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] break-inside-avoid mb-5"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <header className="px-3 pt-2.5 pb-2 flex items-center gap-2 flex-wrap border-b border-[color:var(--color-border)]">
        <a
          href={group.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-bold tracking-tight truncate hover:opacity-80"
          style={{ color }}
        >
          {group.name}
        </a>
        {group.paywall && <PaywallBadge />}
        <span className="ml-auto font-mono text-[10px] text-[color:var(--color-fg-dim)] uppercase tracking-wider">
          T{group.tier} · {group.country}
        </span>
      </header>
      <ul className="px-3 py-2 divide-y divide-[color:var(--color-border)]">
        {group.articles.map((a) => {
          const isZh = a.lang !== "en";
          const paywalled = isPaywalled(a.url, a.paywall ?? undefined);
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
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)]">
                {paywalled && <PaywallBadge />}
                {a.published_at && (
                  <LocalTime iso={a.published_at} className="tabular-nums" />
                )}
              </div>
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
 * no summaries.
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
