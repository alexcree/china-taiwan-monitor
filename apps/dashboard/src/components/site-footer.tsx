import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="rule-top mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="font-mono text-[color:var(--color-accent)] text-xs tracking-wider mb-3">
            CHINA–TAIWAN MONITOR
          </div>
          <p className="text-[color:var(--color-fg-muted)] leading-relaxed">
            Daily intelligence on China–Taiwan developments. Mixed English,
            mainland, and Taiwan sources. Dashboard is free; newsletter
            subscribers get the full annotated brief.
          </p>
        </div>

        <div>
          <div className="font-mono text-xs tracking-wider text-[color:var(--color-fg-dim)] mb-3">
            NAVIGATE
          </div>
          <ul className="space-y-1.5 text-[color:var(--color-fg-muted)] font-mono text-xs">
            <li>
              <Link href="/" className="hover:text-[color:var(--color-fg)]">
                Today&rsquo;s brief
              </Link>
            </li>
            <li>
              <Link href="/feed" className="hover:text-[color:var(--color-fg)]">
                Live article feed
              </Link>
            </li>
            <li>
              <Link
                href="/archive"
                className="hover:text-[color:var(--color-fg)]"
              >
                Archive
              </Link>
            </li>
            <li>
              <Link
                href="/indicators"
                className="hover:text-[color:var(--color-fg)]"
              >
                Indicator tracker
              </Link>
            </li>
            <li>
              <Link
                href="/sources"
                className="hover:text-[color:var(--color-fg)]"
              >
                Source registry
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-[color:var(--color-fg)]"
              >
                Methodology
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-xs tracking-wider text-[color:var(--color-fg-dim)] mb-3">
            SUBSCRIBE TO THE FULL BRIEF
          </div>
          <p className="text-[color:var(--color-fg-muted)] text-xs leading-relaxed mb-3">
            The newsletter delivers the full annotated brief with extended
            source summaries, analyst notes, and cross-sector synthesis.
          </p>
          <Link
            href="/subscribe"
            className="inline-block font-mono text-xs tracking-wider px-3 py-1.5 border border-[color:var(--color-accent-dim)] text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-[color:var(--color-bg)] transition-colors"
          >
            START FREE TRIAL →
          </Link>
        </div>
      </div>

      <div className="rule-top">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between text-xs text-[color:var(--color-fg-dim)] font-mono">
          <div>© {new Date().getFullYear()} AC&amp;A Global Advisors</div>
          <div>v0.0.1 · Phase 1 (scaffold)</div>
        </div>
      </div>
    </footer>
  );
}
