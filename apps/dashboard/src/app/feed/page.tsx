import { getFeed } from "@/lib/articles";
import { SectionLabel } from "@/components/brief/section-label";
import { LocalTime } from "@/components/local-time";
import { domainOf, isPaywalled } from "@ctm/shared";

// 60s revalidation — close to the 15-min ingestion cadence without keeping
// the page stale for an entire pass.
export const revalidate = 60;

export const metadata = { title: "Live feed — China–Taiwan Monitor" };

export default async function FeedPage() {
  const { articles, source } = await getFeed({ sinceHours: 24, limit: 200 });

  return (
    <div className="mx-auto max-w-5xl px-5 pt-6 pb-12">
      <SectionLabel
        subtitle={
          source === "live"
            ? `${articles.length} stories · last 24 hours · refreshed every 60s`
            : `${articles.length} from seed brief · live feed activates when ingestion worker is wired`
        }
      >
        Live Feed
      </SectionLabel>

      {source === "seed" && (
        <div className="mb-5 border-l-4 border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] px-4 py-3 text-[13px] leading-snug text-[color:var(--color-fg)]">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-accent)] font-bold mr-2">
            Seed mode
          </span>
          Supabase is not configured yet. Once <code>SUPABASE_URL</code> and{" "}
          <code>SUPABASE_ANON_KEY</code> are set in Vercel and the ingestion
          worker has made its first pass, this page will read live articles.
          See <code>docs/phase-2-setup.md</code>.
        </div>
      )}

      <ul className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] divide-y divide-[color:var(--color-border)]">
        {articles.length === 0 && (
          <li className="px-4 py-6 text-sm text-[color:var(--color-fg-muted)]">
            No articles yet. The ingestion worker may not have run, or all
            sources are configured but feeds returned empty.
          </li>
        )}
        {articles.map((a) => {
          const langPillColor =
            a.lang === "en"
              ? "text-[color:var(--color-en)]"
              : "text-[color:var(--color-zh)]";
          const langLabel = a.lang === "en" ? "EN" : "ZH";
          const isZh = a.lang !== "en";
          const paywalled = isPaywalled(a.url, a.paywall ?? undefined);

          const sourceLabel =
            a.source?.display_name ?? domainOf(a.url_canonical ?? a.url);

          return (
            <li key={a.id} className="px-4 py-2.5">
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
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--color-fg-dim)] flex-wrap">
                <span className={`font-bold tracking-wider ${langPillColor}`}>
                  {langLabel}
                </span>
                <span>·</span>
                <span className="truncate">{sourceLabel}</span>
                {paywalled && (
                  <span
                    title="Behind a paywall"
                    className="inline-flex items-center justify-center font-mono text-[9px] font-bold tracking-wider px-1 py-px border border-[color:var(--color-accent)] text-[color:var(--color-accent)] leading-none"
                  >
                    $
                  </span>
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
