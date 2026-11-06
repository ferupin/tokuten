import type { Profile } from "@/core/types";

/**
 * Kijun: Sentai.
 *
 * Source of truth for the Super Sentai method. The weights match
 * docs/framework.md and are verified by the test suite.
 */
export const sentaiProfile: Profile = {
  id: "sentai",
  version: 1,
  scale: { min: 0, max: 10, step: 0.1 },
  pillars: [
    { id: "narrative", kanji: "赤", reading: "aka", tone: "red" },
    { id: "concept", kanji: "青", reading: "ao", tone: "blue" },
    { id: "visual", kanji: "黄", reading: "ki", tone: "yellow" },
    { id: "craft", kanji: "緑", reading: "midori", tone: "green" },
    { id: "rhythm", kanji: "桃", reading: "momo", tone: "pink" },
  ],
  categories: [
    {
      id: "theme",
      pillarId: "concept",
      weight: 8,
      subcriteria: ["originality", "identity", "premise", "consistency", "exploration"],
    },
    {
      id: "suits",
      pillarId: "visual",
      weight: 8,
      subcriteria: ["rangerSuits", "visualIdentity", "enemyDesigns", "aesthetics", "visualConsistency"],
    },
    {
      id: "mecha",
      pillarId: "visual",
      weight: 8,
      subcriteria: ["mechaDesigns", "combinations", "weapons", "functionality", "variety", "integration"],
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
      subcriteria: ["characterization", "arcs", "motivations", "consistency", "relationships", "growth"],
    },
    {
      id: "chemistry",
      pillarId: "narrative",
      weight: 12,
      subcriteria: ["teamwork", "interactions", "friendships", "dynamics", "unity"],
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
