import Link from "next/link";
import { SectionLabel } from "./section-label";

export function BottomLine({ text }: { text: string }) {
  return (
    <section className="py-8 rule-top">
      <SectionLabel>Bottom Line</SectionLabel>
      <p className="text-xl md:text-2xl leading-snug max-w-3xl text-[color:var(--color-fg)] tracking-tight">
        {text}
      </p>
      <Link
        href="/subscribe"
        className="mt-4 inline-block font-mono text-xs text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        → Read the extended bottom line in today&rsquo;s newsletter
      </Link>
    </section>
  );
}
