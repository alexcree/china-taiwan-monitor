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
