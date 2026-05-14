import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="rule-top mt-12 bg-[color:var(--color-surface-2)]">
      <div className="mx-auto max-w-7xl px-5 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-mono text-[color:var(--color-accent)] text-xs tracking-[0.18em] font-bold mb-3">
            CHINA–TAIWAN MONITOR
          </div>
          <p className="text-[color:var(--color-fg-muted)] leading-relaxed text-[13px]">
            Daily intelligence on China–Taiwan developments. Mixed English,
            mainland, and Taiwan sources. Dashboard is free; newsletter
            subscribers get the full annotated brief.
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--color-fg-dim)] font-semibold mb-3 uppercase">
            Navigate
          </div>
          <ul className="space-y-1.5 text-[color:var(--color-fg-muted)] font-mono text-[12px]">
            <li>
              <Link
                href="/"
                className="hover:text-[color:var(--color-accent)] transition-colors"
              >
                Today&rsquo;s brief
              </Link>
            </li>
            <li>
              <Link
                href="/feed"
                className="hover:text-[color:var(--color-accent)] transition-colors"
              >
                Live article feed
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-[color:var(--color-accent)] transition-colors"
              >
                Methodology
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--color-fg-dim)] font-semibold mb-3 uppercase">
            Subscribe to the full brief
          </div>
          <p className="text-[color:var(--color-fg-muted)] text-[13px] leading-relaxed mb-3">
            The newsletter delivers the full annotated brief with extended
            source summaries, analyst notes, and cross-sector synthesis.
          </p>
          <Link
            href="/subscribe"
            className="inline-block font-mono text-xs tracking-wider px-3 py-1.5 bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-2)] transition-colors font-semibold"
          >
            SUBSCRIBE →
          </Link>
        </div>
      </div>

      <div className="rule-top bg-[color:var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between text-xs text-[color:var(--color-fg-dim)] font-mono">
          <div>© {new Date().getFullYear()} AC&amp;A Global Advisors</div>
          <div>v0.0.1 · Phase 1 (scaffold)</div>
        </div>
      </div>
    </footer>
  );
}
