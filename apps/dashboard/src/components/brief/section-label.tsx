export function SectionLabel({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="rule-top-strong pt-3 pb-4 mb-5 flex items-baseline gap-3">
      <div className="font-mono text-[11px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
        {children}
      </div>
      {subtitle && (
        <div className="font-mono text-[11px] text-[color:var(--color-fg-dim)] tracking-wide">
          {subtitle}
        </div>
      )}
    </div>
  );
}
