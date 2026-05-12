export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--color-accent)] mb-3 uppercase">
      {children}
    </div>
  );
}
