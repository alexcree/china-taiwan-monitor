/**
 * Newsletter worker — Phase 3 (not yet implemented).
 *
 * Triggered when the brief generator persists a new brief:
 *   1. Render the FULL brief (extended summaries, analyst notes, synthesis)
 *      via React Email or MJML, with plain-text fallback.
 *   2. Send via Resend to subscribers where status = 'active'.
 *   3. Drop a Gmail draft to alex@mosaic.it + alexcree@gmail.com regardless,
 *      preserving the personal review loop.
 *   4. Volume-numbered from first send. Subject: "China–Taiwan Brief —
 *      {date} — Risk: {escalation_risk}".
 */

async function main() {
  console.log("[newsletter] not yet implemented — Phase 3");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
