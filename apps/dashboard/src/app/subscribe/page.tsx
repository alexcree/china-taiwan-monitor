export const metadata = { title: "Subscribe — China–Taiwan Monitor" };

const FEATURES = [
  "Extended source summaries (3–4 sentences each, annotated) on every article",
  "Full source list per sector (8–20 articles, EN + ZH) vs. the dashboard's top 5",
  "Per-sector analyst note synthesizing what the sources collectively mean",
  "Cross-sector synthesis — how today's defense moves connect to today's economy moves",
  "Full reasoning behind every assessment",
  "Rationale behind every forward indicator",
  "Detailed scenarios with triggers, implications, and analyst commentary",
  "Extended bottom line and escalation rationale",
];

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-accent)] uppercase mb-3">
        Premium newsletter
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
        Get the full daily brief in your inbox.
      </h1>
      <p className="text-[color:var(--color-fg-muted)] leading-relaxed mb-10 text-lg">
        The dashboard gives you the headline read. The newsletter gives you the
        full annotated brief — written for a policymaker, every morning.
      </p>

      <div className="rule-top rule-bottom py-8 mb-10">
        <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-fg-dim)] uppercase mb-4">
          What subscribers receive
        </div>
        <ul className="space-y-2.5">
          {FEATURES.map((f, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[color:var(--color-accent)] pt-1 shrink-0">
                ◆
              </span>
              <span className="text-[color:var(--color-fg)]">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-6 py-6">
        <div className="font-mono text-xs tracking-wider text-[color:var(--color-fg-dim)] mb-2">
          STRIPE CHECKOUT — PHASE 5
        </div>
        <p className="text-[color:var(--color-fg-muted)] text-sm">
          Subscription checkout is wired in Phase 5. Pricing tiers (monthly,
          annual, optional 7-day trial) will be configured in Stripe and
          surface here. Until then, the newsletter goes to a manual allowlist —
          email{" "}
          <a
            href="mailto:alex@mosaic.it"
            className="text-[color:var(--color-accent)] hover:underline"
          >
            alex@mosaic.it
          </a>{" "}
          to be added.
        </p>
      </div>
    </div>
  );
}
