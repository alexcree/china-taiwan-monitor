export function formatBriefDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function domainOf(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Compact relative time, biztoc-style: "12m", "3h", "2d", or a date for older.
 * `nowISO` is optional — used for deterministic rendering against seed data.
 */
export function relativeTime(
  publishedAt: string | undefined,
  nowISO?: string,
): string {
  if (!publishedAt) return "";
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return "";
  const now = nowISO ? Date.parse(nowISO) : Date.now();
  const diffMs = Math.max(0, now - published);
  const m = Math.round(diffMs / 60_000);
  if (m < 60) return `${Math.max(1, m)}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d`;
  const date = new Date(published);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Render an article's publish time as an absolute date (and time if present).
 * Returns "May 12 · 14:30 UTC" when time is meaningful, "May 12, 2026" for
 * older items, or empty string if the input is missing/invalid.
 */
export function formatArticleTime(
  publishedAt: string | undefined,
  opts: { includeYear?: boolean } = {},
): string {
  if (!publishedAt) return "";
  const ms = Date.parse(publishedAt);
  if (Number.isNaN(ms)) return "";
  const d = new Date(ms);
  const month = MONTHS_SHORT[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");

  // If the ISO had a time component (anything but pure-midnight is meaningful;
  // even midnight UTC is meaningful if explicit), show time.
  const hasMeaningfulTime = /T\d{2}:\d{2}/.test(publishedAt);

  if (opts.includeYear) {
    return hasMeaningfulTime
      ? `${month} ${day}, ${year} · ${hh}:${mm} UTC`
      : `${month} ${day}, ${year}`;
  }
  return hasMeaningfulTime
    ? `${month} ${day} · ${hh}:${mm} UTC`
    : `${month} ${day}, ${year}`;
}

/**
 * Domains where most articles sit behind a paywall or hard registration.
 * Used as a fallback when an article doesn't carry an explicit paywall flag.
 * Keep this list focused on outlets where the default reader experience is
 * paywalled — not occasional metered access.
 */
const PAYWALLED_DOMAINS = new Set<string>([
  "ft.com",
  "wsj.com",
  "bloomberg.com",
  "nytimes.com",
  "economist.com",
  "nikkei.com",
  "asia.nikkei.com",
  "scmp.com",
  "foreignpolicy.com",
  "foreignaffairs.com",
  "defensenews.com",
  "janes.com",
  "theinformation.com",
  "semianalysis.com",
  "politico.eu",
  "theatlantic.com",
  "newyorker.com",
  "barrons.com",
  "marketwatch.com",
  "telegraph.co.uk",
  "thetimes.co.uk",
  "haaretz.com",
  "lemonde.fr",
  "handelsblatt.com",
  // Mandarin
  "caixin.com",          // selective paywall, treat as paywalled by default
  "theinitium.com",       // 端传媒 — paywalled
  "twreporter.org",       // 报导者 — membership
  "mirrormedia.mg",       // selective
]);

/** Returns true if the article should display a paywall indicator. */
export function isPaywalled(
  url: string,
  explicit?: boolean,
): boolean {
  if (explicit !== undefined) return explicit;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return PAYWALLED_DOMAINS.has(host);
  } catch {
    return false;
  }
}

/** Format a price-like number tersely — keeps tabular alignment readable. */
export function formatPrice(n: number): string {
  if (n >= 10_000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 100) return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (n >= 10) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

/** "+0.62%" / "-1.84%" / "0.00%" formatter for change_pct. */
export function formatChangePct(pct: number): string {
  const sign = pct > 0 ? "+" : pct < 0 ? "" : "";
  return `${sign}${pct.toFixed(2)}%`;
}
