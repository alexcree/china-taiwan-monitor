import {
  getAnonClient,
  isDbConfigured,
  listEnabledSources,
  type SourceRow,
} from "@ctm/db";
import { SEED_SOURCES, type Source } from "@ctm/sources";
import { SectionLabel } from "@/components/brief/section-label";

export const revalidate = 300;
export const metadata = { title: "Sources — China-Taiwan Monitor" };

interface SourceCardProps {
  slug: string;
  name: string;
  country: string;
  lang: string;
  tier: number;
  mode: string;
  category: string;
  url: string;
  paywall: boolean;
  notes?: string | null;
}

function tierBand(tier: number): string {
  switch (tier) {
    case 1:
      return "border-[color:var(--color-accent)] text-[color:var(--color-accent)]";
    case 2:
      return "border-[color:var(--color-fg-muted)] text-[color:var(--color-fg-muted)]";
    case 3:
      return "border-[color:var(--color-fg-dim)] text-[color:var(--color-fg-dim)]";
    default:
      return "border-[color:var(--color-border-strong)] text-[color:var(--color-fg-dim)]";
  }
}

function modeBand(mode: string): string {
  if (mode === "rss")
    return "text-[color:var(--color-risk-low)] border-[color:var(--color-risk-low)]";
  if (mode === "scrape")
    return "text-[color:var(--color-accent)] border-[color:var(--color-accent)]";
  if (mode === "api")
    return "text-[color:var(--color-en)] border-[color:var(--color-en)]";
  return "text-[color:var(--color-fg-muted)] border-[color:var(--color-fg-muted)]";
}

function langLabel(lang: string): string {
  if (lang === "zh-cn") return "ZH·CN";
  if (lang === "zh-tw") return "ZH·TW";
  return lang.toUpperCase();
}

function SourceCard({ s }: { s: SourceCardProps }) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-baseline gap-3 flex-wrap">
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-semibold text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)]"
        >
          {s.name}
        </a>
        <span
          className={`font-mono text-[9px] tracking-wider px-1 py-px border ${tierBand(s.tier)}`}
        >
          T{s.tier}
        </span>
        <span
          className={`font-mono text-[9px] tracking-wider px-1 py-px border uppercase ${modeBand(s.mode)}`}
        >
          {s.mode}
        </span>
        <span className="font-mono text-[10px] text-[color:var(--color-fg-dim)]">
          {langLabel(s.lang)} · {s.country.toUpperCase()} · {s.category}
        </span>
        {s.paywall && (
          <span
            title="Paywalled"
            className="inline-flex items-center justify-center font-mono text-[9px] font-bold tracking-wider px-1 py-px border border-[color:var(--color-accent)] text-[color:var(--color-accent)] leading-none"
          >
            $
          </span>
        )}
      </div>
      {s.notes && (
        <p className="mt-1 text-[12px] leading-snug text-[color:var(--color-fg-muted)]">
          {s.notes}
        </p>
      )}
    </li>
  );
}

function rowFromDb(r: SourceRow): SourceCardProps {
  return {
    slug: r.slug,
    name: r.display_name,
    country: r.country,
    lang: r.lang,
    tier: r.tier,
    mode: r.mode,
    category: r.category,
    url: r.url,
    paywall: Boolean(r.paywall),
    notes: r.notes,
  };
}

function rowFromSeed(s: Source): SourceCardProps {
  return {
    slug: s.slug,
    name: s.display_name,
    country: s.country,
    lang: s.lang,
    tier: s.tier,
    mode: s.mode,
    category: s.category,
    url: s.url,
    paywall: Boolean(s.paywall),
    notes: s.notes ?? null,
  };
}

export default async function SourcesPage() {
  let rows: SourceCardProps[] = [];
  let isLive = false;

  if (isDbConfigured()) {
    const client = getAnonClient();
    if (client) {
      try {
        const dbRows = await listEnabledSources(client);
        rows = dbRows.map(rowFromDb);
        isLive = true;
      } catch (err) {
        console.warn(
          "[sources] live read failed, falling back to seed:",
          err instanceof Error ? err.message : err,
        );
      }
    }
  }
  if (rows.length === 0) {
    rows = SEED_SOURCES.filter((s) => s.enabled).map(rowFromSeed);
  }

  // Sort by tier ascending then display name.
  rows.sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  const byTier = new Map<number, SourceCardProps[]>();
  for (const r of rows) {
    const list = byTier.get(r.tier) ?? [];
    list.push(r);
    byTier.set(r.tier, list);
  }

  const tierLabels: Record<number, string> = {
    1: "Tier 1 · Authoritative wires & government",
    2: "Tier 2 · Established media & specialist desks",
    3: "Tier 3 · Think tanks & analyst-grade",
    4: "Tier 4 · Open social signal (curated)",
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pt-6 pb-12">
      <SectionLabel
        subtitle={
          isLive
            ? `${rows.length} enabled sources · live registry`
            : `${rows.length} sources · seed registry`
        }
      >
        Sources
      </SectionLabel>

      <p className="text-[14px] leading-snug text-[color:var(--color-fg-muted)] max-w-3xl mb-5">
        Every outlet the Monitor watches. Tier reflects editorial reliability
        and fetch priority. Mode is how we ingest: RSS poll, scrape (Playwright,
        Phase 3), API, or social. Paywalled outlets show a <span className="font-mono text-[10px] font-bold text-[color:var(--color-accent)] border border-[color:var(--color-accent)] px-1">$</span> badge; we surface their headlines and leads.
      </p>

      {[1, 2, 3, 4].map((t) => {
        const list = byTier.get(t);
        if (!list || list.length === 0) return null;
        return (
          <section key={t} className="mb-8">
            <h3 className="font-mono text-[11px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase mb-2">
              {tierLabels[t]} · {list.length}
            </h3>
            <ul className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] divide-y divide-[color:var(--color-border)]">
              {list.map((s) => (
                <SourceCard key={s.slug} s={s} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
