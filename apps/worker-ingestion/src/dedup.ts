import { createHash } from "node:crypto";

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "ref_url",
  "spm",
  "share",
  "from",
  "source",
]);

/**
 * Canonicalize a URL for dedup:
 *   - lowercase host
 *   - drop tracking params
 *   - strip fragments
 *   - drop a trailing slash on path (except root)
 *   - sort remaining query params for stable string equality
 */
export function canonicalizeUrl(input: string): string {
  let u: URL;
  try {
    u = new URL(input);
  } catch {
    return input.trim();
  }

  u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
  u.hash = "";

  const params = new URLSearchParams();
  const keys: string[] = [];
  for (const [k, v] of u.searchParams.entries()) {
    if (TRACKING_PARAMS.has(k.toLowerCase())) continue;
    keys.push(k);
    params.append(k, v);
  }
  keys.sort();
  const sortedParams = new URLSearchParams();
  for (const k of keys) {
    for (const v of u.searchParams.getAll(k)) {
      if (TRACKING_PARAMS.has(k.toLowerCase())) continue;
      sortedParams.append(k, v);
    }
  }
  u.search = sortedParams.toString();

  if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
    u.pathname = u.pathname.replace(/\/+$/, "");
  }

  return u.toString();
}

/**
 * Compute a stable content hash. Uses normalized title + lead 500 chars of
 * summary so near-duplicates of the same story (e.g., AP wire pickup) hash
 * to the same value.
 */
export function contentHash(title: string, summary: string | null): string {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
  const titleN = norm(title);
  const summaryN = summary ? norm(summary).slice(0, 500) : "";
  return createHash("sha256").update(`${titleN}\n${summaryN}`).digest("hex");
}
