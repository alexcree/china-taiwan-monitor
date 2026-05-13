import type { MarketQuote, MarketRegion } from "@ctm/brief-schema";
import { formatPrice, formatChangePct } from "@ctm/shared";
import { cn } from "@/lib/cn";

const REGION_LABEL: Record<MarketRegion, string> = {
  cn: "CN",
  hk: "HK",
  tw: "TW",
  us: "US",
  global: "GL",
};

const REGION_TINT: Record<MarketRegion, string> = {
  cn: "text-[color:var(--color-accent)]",
  hk: "text-[#a85d15]",
  tw: "text-[#6a4a8a]",
  us: "text-[#1a4480]",
  global: "text-[color:var(--color-fg-dim)]",
};

function QuotePill({ q }: { q: MarketQuote }) {
  const isUp = q.change_pct > 0;
  const isDown = q.change_pct < 0;
  const arrow = isUp ? "▲" : isDown ? "▼" : "·";
  const tone = isUp
    ? "text-[color:var(--color-risk-low)]"
    : isDown
      ? "text-[color:var(--color-risk-high)]"
      : "text-[color:var(--color-fg-dim)]";

  return (
    <span className="inline-flex items-baseline gap-1.5 px-3 py-1.5 font-mono text-[12px] whitespace-nowrap border-r border-[color:var(--color-border)] last:border-r-0">
      <span
        className={cn(
          "font-bold tracking-wider text-[10px]",
          REGION_TINT[q.region],
        )}
      >
        {REGION_LABEL[q.region]}
      </span>
      <span className="font-semibold text-[color:var(--color-fg)]">
        {q.label}
      </span>
      <span className="tabular-nums text-[color:var(--color-fg-muted)]">
        {formatPrice(q.last)}
      </span>
      <span className={cn("tabular-nums font-medium", tone)}>
        {arrow} {formatChangePct(q.change_pct)}
      </span>
    </span>
  );
}

export function MarketTicker({
  quotes,
  isSeed,
}: {
  quotes: MarketQuote[];
  isSeed: boolean;
}) {
  return (
    <section
      aria-label="Market data"
      className="bg-[color:var(--color-surface)] rule-bottom relative"
    >
      <div className="mx-auto max-w-7xl flex items-stretch">
        <div className="shrink-0 bg-[color:var(--color-fg)] text-[color:var(--color-bg)] px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] font-bold flex items-center">
          MARKETS
        </div>
        <div className="flex-1 overflow-x-auto flex items-stretch divide-x divide-[color:var(--color-border)]">
          {quotes.map((q) => (
            <QuotePill key={q.symbol} q={q} />
          ))}
        </div>
        {isSeed && (
          <div className="shrink-0 hidden md:flex items-center px-2 py-1.5 font-mono text-[10px] tracking-wider text-[color:var(--color-fg-dim)] border-l border-[color:var(--color-border)]">
            SEED · live feed wires in Phase 2
          </div>
        )}
      </div>
    </section>
  );
}
