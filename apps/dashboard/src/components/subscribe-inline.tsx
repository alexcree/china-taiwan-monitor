import Link from "next/link";

export function SubscribeInline() {
  return (
    <aside className="my-8 bg-[color:var(--color-accent-soft)] border-l-4 border-[color:var(--color-accent)] px-5 py-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-accent)] uppercase mb-1 font-bold">
            Get the full brief
          </div>
          <p className="text-[14px] leading-snug text-[color:var(--color-fg)]">
            Extended source summaries, per-sector analyst notes, cross-sector
            synthesis, and full reasoning on every assessment — delivered every
            morning.
          </p>
        </div>
        <Link
          href="/subscribe"
          className="font-mono text-xs tracking-wider px-4 py-2.5 bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-2)] transition-colors whitespace-nowrap font-semibold"
        >
          SUBSCRIBE →
        </Link>
      </div>
    </aside>
  );
}
