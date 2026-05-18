import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="rule-top mt-12 bg-[color:var(--color-surface-2)]">
      <div className="mx-auto max-w-7xl px-5 py-10 grid gap-8 md:grid-cols-2 text-sm">
        <div>
          <div className="font-mono text-[color:var(--color-accent)] text-xs tracking-[0.18em] font-bold mb-3">
            CHINA–TAIWAN MONITOR
          </div>
          <p className="text-[color:var(--color-fg-muted)] leading-relaxed text-[13px]">
            Daily intelligence on China–Taiwan developments. Mixed English,
            mainland, and Taiwan sources.
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
                href="/sources"
                className="hover:text-[color:var(--color-accent)] transition-colors"
              >
                Source registry
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
      </div>
    </footer>
  );
}
