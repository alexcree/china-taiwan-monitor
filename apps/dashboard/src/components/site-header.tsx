import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Top Brief" },
  { href: "/feed", label: "Live feed" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="bg-[color:var(--color-surface)] rule-bottom">
      {/* Masthead */}
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="China–Taiwan Monitor seal"
            width={44}
            height={44}
            priority
            className="block"
          />
          <span className="text-2xl font-bold tracking-tight text-[color:var(--color-fg)]">
            China–Taiwan Monitor
          </span>
        </Link>
        <span className="text-xs text-[color:var(--color-fg-muted)] italic ml-auto">
          Daily intelligence on China–Taiwan developments
        </span>
      </div>

      {/* Nav strip */}
      <nav className="rule-top bg-[color:var(--color-surface-2)]">
        <div className="mx-auto max-w-7xl px-5 py-2 flex items-center gap-1 overflow-x-auto">
          {NAV.map((item, i) => (
            <span key={item.href} className="flex items-center">
              {i > 0 && (
                <span className="text-[color:var(--color-border-strong)] px-1 select-none">
                  /
                </span>
              )}
              <Link
                href={item.href}
                className="font-mono text-[12px] tracking-wide text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] px-2 py-1 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </div>
      </nav>
    </header>
  );
}
