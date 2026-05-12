/**
 * Ingestion worker — Phase 1 (not yet implemented).
 *
 * Will run every 15 minutes:
 *   1. Pull from RSS feeds in the source registry.
 *   2. Run per-outlet Playwright scrapers where RSS is unavailable.
 *   3. Store raw HTML + extracted text in Supabase `articles`.
 *   4. Enqueue translation (non-English) and scoring jobs.
 *
 * Respects robots.txt and per-domain rate limits. Skips duplicate URLs.
 */

async function main() {
  console.log("[ingestion] not yet implemented — Phase 1");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
