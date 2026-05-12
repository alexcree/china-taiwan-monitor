export const metadata = { title: "About — China–Taiwan Monitor" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-accent)] uppercase mb-3">
        Methodology
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        About China–Taiwan Monitor
      </h1>

      <div className="space-y-6 text-[color:var(--color-fg)] leading-relaxed">
        <p>
          China–Taiwan Monitor produces a daily classified-style intelligence
          brief on China–Taiwan developments. Coverage spans defense, politics,
          diplomacy, economy and finance, technology, property, consumer and
          business, cyber, and influence operations.
        </p>

        <h2 className="text-xl font-medium mt-10 mb-2 text-[color:var(--color-fg)]">
          How the brief is produced
        </h2>
        <p>
          An ingestion pipeline pulls articles every fifteen minutes from a
          curated source registry including major English wires, Chinese
          mainland state and independent media, and Taiwan press. Articles are
          translated where needed and scored for importance. At 06:00 local,
          the day&rsquo;s articles are passed to an analyst engine that produces a
          single annotated brief. The dashboard renders a lighter public view;
          the newsletter renders the full annotated version.
        </p>

        <h2 className="text-xl font-medium mt-10 mb-2 text-[color:var(--color-fg)]">
          What you can trust
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-[color:var(--color-fg-muted)]">
          <li>No fabricated sources or links. Cited URLs match input articles.</li>
          <li>Facts are separated from assessments. Every assessment carries a confidence level.</li>
          <li>
            Chinese-language coverage is mandatory per sector. Gaps are stated
            explicitly in source notes.
          </li>
          <li>
            The recency window is 24–48 hours unless older context is
            essential.
          </li>
        </ul>

        <h2 className="text-xl font-medium mt-10 mb-2 text-[color:var(--color-fg)]">
          Free and paid
        </h2>
        <p>
          The dashboard is free and always will be. The newsletter is a paid
          premium product: extended source summaries, per-sector analyst notes,
          cross-sector synthesis, reasoning behind every assessment, and
          detailed scenarios. One generation, two presentations.
        </p>
      </div>
    </div>
  );
}
