import { SectionLabel } from "./section-label";

export function SourceNotes({ text }: { text: string }) {
  return (
    <section className="py-8 rule-top">
      <SectionLabel>Source Notes</SectionLabel>
      <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed max-w-3xl">
        {text}
      </p>
    </section>
  );
}
