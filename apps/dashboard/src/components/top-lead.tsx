import type { ArticleWithSource } from "@ctm/db";
import { domainOf, isPaywalled } from "@ctm/shared";
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

function LeadByline({ a }: { a: ArticleWithSource }) {
  const sourceLabel =
    a.source?.display_name ?? domainOf(a.url_canonical ?? a.url);
  const paywalled = isPaywalled(a.url, a.paywall ?? undefined);
  return (
    <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
      <span>{sourceLabel}</span>
      {paywalled && <PaywallBadge />}
      {a.published_at && (
        <>
          <span>·</span>
          <LocalTime iso={a.published_at} />
        </>
      )}
    </div>
  );
}

export function TopLead({
  lead,
  secondaries,
}: {
  lead: ArticleWithSource;
  secondaries: ArticleWithSource[];
}) {
  return (
    <section className="bg-[color:var(--color-surface)] rule-bottom">
      <div className="mx-auto max-w-5xl px-5 pt-10 pb-8 text-center">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-accent)] font-bold mb-4">
          ◆ Top Story ◆
        </div>
        <a
          href={lead.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <h1 className="font-serif text-[28px] md:text-[44px] lg:text-[56px] leading-[1.05] tracking-tight font-bold text-[color:var(--color-fg)] group-hover:text-[color:var(--color-accent)] transition-colors">
            {lead.title_original}
          </h1>
          {lead.lang !== "en" && lead.title_en && (
            <h2 className="mt-3 font-serif text-base md:text-xl italic text-[color:var(--color-fg-muted)]">
              ↳ {lead.title_en}
            </h2>
          )}
        </a>
        <LeadByline a={lead} />
      </div>

      {secondaries.length > 0 && (
        <div className="rule-top bg-[color:var(--color-surface-2)]">
          <div className="mx-auto max-w-6xl px-5 py-6 grid gap-x-6 gap-y-5 md:grid-cols-3">
            {secondaries.slice(0, 3).map((s) => (
              <article key={s.id} className="text-center">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h3 className="font-serif text-[17px] md:text-[20px] leading-tight font-semibold text-[color:var(--color-fg)] group-hover:text-[color:var(--color-accent)] transition-colors">
                    {s.title_original}
                  </h3>
                  {s.lang !== "en" && s.title_en && (
                    <p className="mt-1.5 font-serif text-[13px] italic text-[color:var(--color-fg-muted)]">
                      ↳ {s.title_en}
                    </p>
                  )}
                </a>
                <LeadByline a={s} />
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
