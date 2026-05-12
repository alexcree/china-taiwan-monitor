import Link from "next/link";

const NAV = [
  { href: "/", label: "Brief" },
  { href: "/feed", label: "Feed" },
  { href: "/archive", label: "Archive" },
  { href: "/indicators", label: "Indicators" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="rule-bottom sticky top-0 z-20 backdrop-blur-md bg-[color:var(--color-bg)]/85">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-mono text-[color:var(--color-accent)] text-sm tracking-wider">
            CTM
          </span>
          <span className="font-mono text-sm tracking-tight text-[color:var(--color-fg)]">
            China–Taiwan Monitor
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <Link
            href="/subscribe"
            className="font-mono text-xs tracking-wider px-3 py-1.5 border border-[color:var(--color-accent-dim)] text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-[color:var(--color-bg)] transition-colors"
          >
            SUBSCRIBE →
          </Link>
        </div>
      </div>
    </header>
  );
}
