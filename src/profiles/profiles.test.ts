import { describe, expect, it } from "vitest";
import { computeResult, createEvaluation } from "@/core/scoring";
import { defaultProfileId, getProfile, profileList, profileRoute, profiles } from "./index";

/** The shape every profile keeps: ten categories under five pillars, weights that add up to 100. */
describe("profile registry", () => {
  it("lists every profile once, with the default one first", () => {
    expect(profileList.map((p) => p.id)).toEqual(["sentai", "kamen-rider"]);
    expect(profileList[0].id).toBe(defaultProfileId);
    expect(Object.keys(profiles).sort()).toEqual(profileList.map((p) => p.id).sort());
  });

  it("serves the default profile at the root and the others under their own id", () => {
    expect(profileRoute("sentai")).toBe("/");
    expect(profileRoute("kamen-rider")).toBe("/kamen-rider");
  });

  it("refuses an unknown profile, including inherited property names", () => {
    expect(() => getProfile("nope")).toThrow();
    expect(() => getProfile("toString")).toThrow();
  });

  for (const profile of profileList) {
    describe(profile.id, () => {
      it("keeps the identity of the method: ten categories, five pillars, weights that add up to 100", () => {
        expect(profile.categories).toHaveLength(10);
        expect(profile.pillars).toHaveLength(5);
        expect(profile.categories.reduce((sum, c) => sum + c.weight, 0)).toBe(100);
      });

      it("has unique ids and valid pillar references", () => {
        const pillarIds = new Set(profile.pillars.map((p) => p.id));
        expect(pillarIds.size).toBe(5);
        expect(new Set(profile.pillars.map((p) => p.tone)).size).toBe(5);
        expect(new Set(profile.pillars.map((p) => p.kanji)).size).toBe(5);
        expect(new Set(profile.categories.map((c) => c.id)).size).toBe(10);
        for (const c of profile.categories) {
          expect(pillarIds.has(c.pillarId), c.id).toBe(true);
          expect(new Set(c.subcriteria).size, c.id).toBe(c.subcriteria.length);
          expect(c.subcriteria.length, c.id).toBeGreaterThanOrEqual(5);
          expect(c.subcriteria.length, c.id).toBeLessThanOrEqual(6);
        }
      });

      it("gives every pillar at least one category", () => {
        for (const pillar of profile.pillars) {
          expect(profile.categories.some((c) => c.pillarId === pillar.id), pillar.id).toBe(true);
        }
      });

      it("scores a full set of equal grades as that grade", () => {
        const evaluation = createEvaluation(profile);
        for (const c of profile.categories) evaluation.categories[c.id].override = 7;
        expect(computeResult(profile, evaluation).score).toBeCloseTo(7, 10);
      });
    });
  }
});

describe("Kamen Rider profile", () => {
  const rider = getProfile("kamen-rider");

  it("uses the Sentai weights, with Antagonists & Threat in the place of Squad Chemistry", () => {
    const sentai = getProfile("sentai");
    const weights = (p: typeof rider) => p.categories.map((c) => c.weight);
    expect(weights(rider)).toEqual(weights(sentai));
    expect(rider.categories.find((c) => c.id === "antagonists")?.weight).toBe(12);
    expect(sentai.categories.find((c) => c.id === "chemistry")?.weight).toBe(12);
  });

  it("keeps the numeral order and the pillar of every position, as decided", () => {
    const sentai = getProfile("sentai");
    expect(rider.categories.map((c) => c.pillarId)).toEqual(sentai.categories.map((c) => c.pillarId));
  });

  it("takes its own palette, with red and green shared with Sentai", () => {
    expect(rider.pillars.map((p) => p.kanji)).toEqual(["赤", "銀", "金", "緑", "紫"]);
    expect(rider.pillars.map((p) => p.tone)).toEqual(["red", "silver", "gold", "green", "violet"]);
  });

  it("is marked as provisional until the community has reviewed it", () => {
    expect(rider.provisional).toBe(true);
    expect(getProfile("sentai").provisional).toBeUndefined();
  });
});
