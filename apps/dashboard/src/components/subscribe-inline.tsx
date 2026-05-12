import Link from "next/link";

export function SubscribeInline() {
  return (
    <aside className="my-12 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-6 max-w-3xl">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-accent)] uppercase mb-1.5">
            Get the full brief
          </div>
          <p className="text-[15px] leading-snug text-[color:var(--color-fg)]">
            Extended source summaries, analyst notes per sector, full reasoning
            on assessments, and cross-sector synthesis — delivered every
            morning.
          </p>
        </div>
        <Link
          href="/subscribe"
          className="font-mono text-xs tracking-wider px-4 py-2.5 border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-transparent hover:text-[color:var(--color-accent)] transition-colors whitespace-nowrap"
        >
          SUBSCRIBE →
        </Link>
      </div>
    </aside>
  );
}
