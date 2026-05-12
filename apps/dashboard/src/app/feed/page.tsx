import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Live feed — China–Taiwan Monitor" };

export default function FeedPage() {
  return (
    <ComingSoon
      phase="Phase 1 — Pending ingestion"
      title="Live article feed"
      description="A continuously updating stream of the last 24 hours of articles across English, mainland, and Taiwan sources — filterable by sector, language, and country. Wired up once the ingestion worker is running."
    />
  );
}
