/**
 * Article topic taxonomy for the China–Taiwan Monitor.
 *
 * Eight content topics drive the dashboard's primary navigation and
 * homepage bucket order. Each article (post-summarizer) is classified
 * into exactly one `primary_topic` and can carry free-form `subtopics`
 * tags for finer filtering.
 *
 * The eight slugs match the check constraint in
 * supabase/migrations/0003_topic_taxonomy.sql.
 */

export const PRIMARY_TOPICS = [
  "military",
  "politics",
  "us_china_taiwan",
  "semiconductors",
  "markets",
  "cyber_info_ops",
  "diplomacy",
  "general",
] as const;

export type PrimaryTopic = (typeof PRIMARY_TOPICS)[number];

export const PRIMARY_TOPIC_LABELS: Record<PrimaryTopic, string> = {
  military: "Military",
  politics: "Politics",
  us_china_taiwan: "U.S.–China–Taiwan",
  semiconductors: "Semiconductors",
  markets: "Markets",
  cyber_info_ops: "Cyber & Info Ops",
  diplomacy: "Diplomacy",
  general: "General",
};

/** Display order on the homepage and in the nav. */
export const PRIMARY_TOPIC_ORDER: PrimaryTopic[] = [
  "military",
  "us_china_taiwan",
  "politics",
  "semiconductors",
  "markets",
  "diplomacy",
  "cyber_info_ops",
  "general",
];

/** URL path segment for each topic (no leading slash). */
export const PRIMARY_TOPIC_PATHS: Record<PrimaryTopic, string> = {
  military: "military",
  politics: "politics",
  us_china_taiwan: "us-china-taiwan",
  semiconductors: "semiconductors",
  markets: "markets",
  cyber_info_ops: "cyber-info-ops",
  diplomacy: "diplomacy",
  general: "general",
};

/**
 * One-line scope description shown to the classifier and surfaced as
 * subtitle copy on each topic page.
 */
export const PRIMARY_TOPIC_SCOPES: Record<PrimaryTopic, string> = {
  military:
    "PLA activity, Taiwan defense and readiness, arms procurement and exercises, infrastructure resilience.",
  politics:
    "Taiwan domestic politics, PRC Taiwan policy (TAO, United Front, legal warfare), legal and sovereignty disputes.",
  us_china_taiwan:
    "U.S.–Taiwan policy, U.S.–China relations affecting Taiwan, Taiwan's international space, trilateral signaling.",
  semiconductors:
    "TSMC, SMIC, advanced packaging, AI hardware, export controls, supply-chain security.",
  markets:
    "Taiwan economy and equity / FX moves, China financial markets, corporate earnings, sanctions and tariff impact.",
  cyber_info_ops:
    "Cyberattacks, infrastructure intrusions, disinformation, deepfakes, election interference, narrative warfare.",
  diplomacy:
    "Regional diplomacy (Japan, Philippines, ASEAN, Europe), cross-strait society and exchanges, human rights, regional security.",
  general: "Relevant but does not fit the more specific topics above.",
};
