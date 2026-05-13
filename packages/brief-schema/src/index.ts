import { z } from "zod";

export * from "./markets.js";

export const SECTORS = [
  "defense",
  "politics",
  "diplomacy",
  "economy",
  "tech",
  "property",
  "consumer",
  "cyber",
  "influence",
] as const;
export type Sector = (typeof SECTORS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  defense: "Defense",
  politics: "Politics",
  diplomacy: "Diplomacy",
  economy: "Economy & Finance",
  tech: "Technology",
  property: "Property",
  consumer: "Consumer & Business",
  cyber: "Cyber",
  influence: "Influence Ops",
};

export const ConfidenceSchema = z.enum(["low", "moderate", "high"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const EscalationRiskSchema = z.enum(["low", "moderate", "high"]);
export type EscalationRisk = z.infer<typeof EscalationRiskSchema>;

export const ActorSchema = z.enum(["china", "taiwan", "us", "allies", "multiple"]);
export type Actor = z.infer<typeof ActorSchema>;

export const EnglishSourceSchema = z.object({
  headline: z.string().min(1),
  summary_short: z.string().min(1),
  summary_extended: z.string().min(1),
  url: z.string().url(),
  /** Article publish time, ISO 8601. Used to render relative timestamps. */
  published_at: z.string().datetime().optional(),
});
export type EnglishSource = z.infer<typeof EnglishSourceSchema>;

export const ChineseSourceSchema = z.object({
  headline_original: z.string().min(1),
  headline_en: z.string().min(1),
  summary_short_en: z.string().min(1),
  summary_extended_en: z.string().min(1),
  url: z.string().url(),
  /** Article publish time, ISO 8601. Used to render relative timestamps. */
  published_at: z.string().datetime().optional(),
});
export type ChineseSource = z.infer<typeof ChineseSourceSchema>;

export const SectorBriefSchema = z.object({
  summary: z.array(z.string().min(1)).min(1),
  analyst_note: z.string().min(1),
  english_sources: z.array(EnglishSourceSchema),
  chinese_sources: z.array(ChineseSourceSchema),
});
export type SectorBrief = z.infer<typeof SectorBriefSchema>;

export const SectionsSchema = z.record(z.enum(SECTORS), SectorBriefSchema);
export type Sections = Partial<Record<Sector, SectorBrief>>;

export const AssessmentSchema = z.object({
  judgment: z.string().min(1),
  confidence: ConfidenceSchema,
  actor: ActorSchema,
  reasoning: z.string().min(1),
});
export type Assessment = z.infer<typeof AssessmentSchema>;

export const IndicatorSchema = z.object({
  text: z.string().min(1),
  rationale: z.string().min(1),
});
export type Indicator = z.infer<typeof IndicatorSchema>;

export const ScenarioSchema = z.object({
  name: z.string().min(1),
  probability_pct: z.number().min(0).max(100),
  one_line: z.string().min(1),
  triggers: z.array(z.string().min(1)),
  implications: z.array(z.string().min(1)),
  analyst_note: z.string().min(1),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

export const BriefSchema = z.object({
  brief_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
  generated_at: z.string().datetime(),
  exec_summary: z.array(z.string().min(1)).min(1),
  sections: SectionsSchema,
  assessments: z.array(AssessmentSchema),
  indicators: z.array(IndicatorSchema),
  scenarios: z.array(ScenarioSchema),
  escalation_risk: EscalationRiskSchema,
  escalation_rationale: z.string().min(1),
  bottom_line: z.string().min(1),
  bottom_line_extended: z.string().min(1),
  cross_sector_synthesis: z.string().min(1),
  source_notes: z.string().min(1),
});
export type Brief = z.infer<typeof BriefSchema>;

/**
 * Strip newsletter-only fields from a brief for the public dashboard view.
 * Generation produces ONE full brief — this is the read-time transform.
 */
export type PublicBrief = Omit<
  Brief,
  | "escalation_rationale"
  | "bottom_line_extended"
  | "cross_sector_synthesis"
  | "assessments"
  | "indicators"
  | "scenarios"
  | "sections"
> & {
  assessments: Array<Pick<Assessment, "judgment" | "confidence" | "actor">>;
  indicators: Array<Pick<Indicator, "text">>;
  scenarios: Array<Pick<Scenario, "name" | "probability_pct" | "one_line">>;
  sections: Partial<
    Record<
      Sector,
      Omit<SectorBrief, "analyst_note" | "english_sources" | "chinese_sources"> & {
        english_sources: Array<Omit<EnglishSource, "summary_extended">>;
        chinese_sources: Array<Omit<ChineseSource, "summary_extended_en">>;
      }
    >
  >;
};

const TOP_SOURCES_PER_SECTOR = 8;

export function toPublicBrief(b: Brief): PublicBrief {
  const sections: PublicBrief["sections"] = {};
  for (const sector of SECTORS) {
    const sec = b.sections[sector];
    if (!sec) continue;

    // Top 5 sources per section, mixed EN/ZH, EN first then ZH (interleaving
    // is a render-time concern — we just trim here).
    const en = sec.english_sources.slice(0, TOP_SOURCES_PER_SECTOR).map(
      ({ summary_extended: _e, ...rest }) => rest,
    );
    const zhBudget = Math.max(0, TOP_SOURCES_PER_SECTOR - en.length);
    const zh = sec.chinese_sources.slice(0, zhBudget).map(
      ({ summary_extended_en: _e, ...rest }) => rest,
    );

    sections[sector] = {
      summary: sec.summary,
      english_sources: en,
      chinese_sources: zh,
    };
  }

  return {
    brief_date: b.brief_date,
    generated_at: b.generated_at,
    exec_summary: b.exec_summary,
    sections,
    assessments: b.assessments.map(({ judgment, confidence, actor }) => ({
      judgment,
      confidence,
      actor,
    })),
    indicators: b.indicators.map(({ text }) => ({ text })),
    scenarios: b.scenarios.map(({ name, probability_pct, one_line }) => ({
      name,
      probability_pct,
      one_line,
    })),
    escalation_risk: b.escalation_risk,
    bottom_line: b.bottom_line,
    source_notes: b.source_notes,
  };
}
