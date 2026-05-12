import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Sources — China–Taiwan Monitor" };

export default function SourcesPage() {
  return (
    <ComingSoon
      phase="Phase 1 — Pending ingestion"
      title="Source registry"
      description="Every source we pull from, with last-fetch timestamp, article count, language, and country of origin. Transparency is part of the methodology."
    />
  );
}
