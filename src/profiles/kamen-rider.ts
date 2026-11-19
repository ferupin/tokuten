import type { Profile } from "@/core/types";

/**
 * Kijun: Kamen Rider.
 *
 * Same method as Sentai: ten categories under five pillars, the same weights
 * and the same scale. Antagonists & Threat takes the place of Squad Chemistry,
 * and Characters absorbs partners, allied or rival Riders and the supporting cast.
 * See docs/adr/0014-kamen-rider-profile.md.
 *
 * Provisional until people who know the series have reviewed it.
 */
export const kamenRiderProfile: Profile = {
  id: "kamen-rider",
  version: 1,
  provisional: true,
  scale: { min: 0, max: 10, step: 0.1 },
  checklist: [
    "noNostalgia",
    "noAgePenalty",
    "attemptAndSuccess",
    "conceptVsExecution",
    "quantityVsQuality",
    "noDoubleCounting",
    "wholeSeason",
    "concreteExamples",
    "noPopularityBonus",
    "noForcedLow",
  ],
  pillars: [
    { id: "narrative", kanji: "赤", reading: "aka", tone: "red" },
    { id: "concept", kanji: "銀", reading: "gin", tone: "silver" },
    { id: "visual", kanji: "金", reading: "kin", tone: "gold" },
    { id: "craft", kanji: "緑", reading: "midori", tone: "green" },
    { id: "rhythm", kanji: "紫", reading: "murasaki", tone: "violet" },
  ],
  categories: [
    {
      id: "theme",
      pillarId: "concept",
      weight: 8,
      subcriteria: ["originality", "identity", "premise", "consistency", "exploration"],
    },
    {
      id: "design",
      pillarId: "visual",
      weight: 8,
      subcriteria: ["riderDesigns", "visualIdentity", "villainDesigns", "aesthetics", "visualConsistency"],
    },
    {
      id: "gear",
      pillarId: "visual",
      weight: 8,
      subcriteria: ["devices", "forms", "weaponsVehicles", "rules", "variety", "integration"],
    },
    {
      id: "story",
      pillarId: "narrative",
      weight: 14,
      subcriteria: ["structure", "worldbuilding", "continuity", "plot", "conflicts", "resolution"],
    },
    {
      id: "characters",
      pillarId: "narrative",
      weight: 14,
      subcriteria: ["characterization", "arcs", "motivations", "bonds", "supportingCast", "consistency"],
    },
    {
      id: "antagonists",
      pillarId: "narrative",
      weight: 12,
      subcriteria: ["threat", "goals", "heroConnection", "escalation", "antagonistSide", "payoff"],
    },
    {
      id: "music",
      pillarId: "rhythm",
      weight: 8,
      subcriteria: ["themeSongs", "backgroundMusic", "insertSongs", "emotionalImpact", "soundDesign"],
    },
    {
      id: "action",
      pillarId: "craft",
      weight: 10,
      subcriteria: ["choreography", "stuntWork", "creativity", "clarity", "actionDirection"],
    },
    {
      id: "production",
      pillarId: "craft",
      weight: 8,
      subcriteria: ["cinematography", "editing", "directing", "practicalEffects", "presentation", "execution"],
    },
    {
      id: "pacing",
      pillarId: "rhythm",
      weight: 10,
      subcriteria: ["consistency", "rhythm", "filler", "momentum", "screenTime", "delivery"],
    },
  ],
};
