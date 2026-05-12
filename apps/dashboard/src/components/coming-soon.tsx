import Link from "next/link";

export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-accent)] uppercase mb-3">
        {phase}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mb-4">{title}</h1>
      <p className="text-[color:var(--color-fg-muted)] leading-relaxed mb-8">
        {description}
      </p>
      <Link
        href="/"
        className="font-mono text-xs tracking-wider text-[color:var(--color-accent)] hover:text-[color:var(--color-fg)] transition-colors"
      >
        ← Back to today&rsquo;s brief
      </Link>
    </div>
  );
}
