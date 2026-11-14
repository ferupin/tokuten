import { describe, expect, it } from "vitest";
import { sentaiProfile } from "@/profiles/sentai";
import { GRADE_BANDS, formatGrade, gradeBand } from "./grades";
import { computeResult, createEvaluation, deriveCategoryGrade, totalWeight } from "./scoring";
import { exportMarkdown } from "./export-markdown";
import { parseEnvelope, toEnvelope } from "./schema";
import type { Evaluation } from "./types";

/** Sets every category to a single override grade. */
function gradeAll(evaluation: Evaluation, values: Record<string, number>): Evaluation {
  for (const [id, value] of Object.entries(values)) {
    evaluation.categories[id].override = value;
  }
  return evaluation;
}

describe("sentai profile", () => {
  it("has weights that add up to 100", () => {
    expect(totalWeight(sentaiProfile)).toBe(100);
  });

  it("matches the framework weights", () => {
    const weights = Object.fromEntries(sentaiProfile.categories.map((c) => [c.id, c.weight]));
    expect(weights).toEqual({
      theme: 8,
      suits: 8,
      mecha: 8,
      story: 14,
      characters: 14,
      chemistry: 12,
      music: 8,
      action: 10,
      production: 8,
      pacing: 10,
    });
  });

  it("assigns every category to an existing pillar", () => {
    const pillars = new Set(sentaiProfile.pillars.map((p) => p.id));
    for (const c of sentaiProfile.categories) expect(pillars.has(c.pillarId)).toBe(true);
  });

  it("has unique subcriteria inside each category", () => {
    for (const c of sentaiProfile.categories) {
      expect(new Set(c.subcriteria).size).toBe(c.subcriteria.length);
    }
  });
});

describe("grade bands", () => {
  it("covers every integer from 0 to 10", () => {
    expect(GRADE_BANDS).toHaveLength(11);
    GRADE_BANDS.forEach((band, i) => expect(gradeBand(i)).toBe(band));
  });

  it("rounds halves upward", () => {
    expect(gradeBand(4.5)).toBe("average");
    expect(gradeBand(5.49)).toBe("average");
    expect(gradeBand(5.5)).toBe("fine");
    expect(gradeBand(9.5)).toBe("masterpiece");
  });

  it("clamps out of range values", () => {
    expect(gradeBand(-3)).toBe("abysmal");
    expect(gradeBand(14)).toBe("masterpiece");
  });

  it("formats grades with fixed decimals", () => {
    expect(formatGrade(7)).toBe("7.0");
    expect(formatGrade(7.456, 2)).toBe("7.46");
  });
});

describe("category grade derivation", () => {
  it("is pending when nothing is graded", () => {
    const entry = createEvaluation(sentaiProfile).categories.story;
    expect(deriveCategoryGrade(entry).grade).toBeNull();
  });

  it("averages graded and applicable subcriteria only", () => {
    const entry = createEvaluation(sentaiProfile).categories.story;
    entry.subcriteria.structure.value = 8;
    entry.subcriteria.plot.value = 6;
    entry.subcriteria.resolution.value = 10;
    entry.subcriteria.continuity.value = 2;
    entry.subcriteria.continuity.applicable = false;
    const derived = deriveCategoryGrade(entry);
    expect(derived.grade).toBe(8);
    expect(derived.source).toBe("average");
    expect(derived.gradedSubcriteria).toBe(3);
    expect(derived.applicableSubcriteria).toBe(5);
  });

  it("lets an override replace the average", () => {
    const entry = createEvaluation(sentaiProfile).categories.story;
    entry.subcriteria.structure.value = 4;
    entry.override = 9;
    expect(deriveCategoryGrade(entry)).toMatchObject({ grade: 9, source: "override" });
  });
});

describe("weighted result", () => {
  it("returns no score for a blank evaluation", () => {
    const result = computeResult(sentaiProfile, createEvaluation(sentaiProfile));
    expect(result.score).toBeNull();
    expect(result.complete).toBe(false);
    expect(result.gradedCount).toBe(0);
  });

  it("matches the example from the framework", () => {
    // Story & Lore at 8.0 contributes 8.0 x 14 / 100 = 1.12 points.
    const evaluation = createEvaluation(sentaiProfile);
    evaluation.categories.story.override = 8;
    const story = computeResult(sentaiProfile, evaluation).categories.find((c) => c.id === "story");
    // Only one category graded and nothing removed, so the effective weight stays 14.
    expect(story?.effectiveWeight).toBe(14);
    expect(story?.contribution).toBeCloseTo(1.12, 4);
  });

  it("computes the plain weighted sum when everything is graded", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), {
      theme: 8,
      suits: 7,
      mecha: 6,
      story: 9,
      characters: 8,
      chemistry: 10,
      music: 7,
      action: 6,
      production: 7,
      pacing: 5,
    });
    // 0.64 + 0.56 + 0.48 + 1.26 + 1.12 + 1.20 + 0.56 + 0.60 + 0.56 + 0.50 = 7.48
    const result = computeResult(sentaiProfile, evaluation);
    expect(result.score).toBe(7.48);
    expect(result.complete).toBe(true);
    expect(result.redistributed).toBe(false);
  });

  it("returns the same grade when every category has the same grade", () => {
    const all = Object.fromEntries(sentaiProfile.categories.map((c) => [c.id, 6.3]));
    const result = computeResult(sentaiProfile, gradeAll(createEvaluation(sentaiProfile), all));
    expect(result.score).toBe(6.3);
  });

  it("flags a partial score while categories are pending", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), { story: 8, characters: 6 });
    const result = computeResult(sentaiProfile, evaluation);
    // (8 x 14 + 6 x 14) / 28 = 7
    expect(result.score).toBe(7);
    expect(result.complete).toBe(false);
    expect(result.gradedCount).toBe(2);
    expect(result.applicableCount).toBe(10);
  });

  it("redistributes the weight of not applicable categories", () => {
    const all = Object.fromEntries(sentaiProfile.categories.map((c) => [c.id, 8]));
    const evaluation = gradeAll(createEvaluation(sentaiProfile), all);
    evaluation.categories.music.applicable = false; // 8% removed
    const result = computeResult(sentaiProfile, evaluation);

    const music = result.categories.find((c) => c.id === "music");
    expect(music?.status).toBe("not-applicable");
    expect(music?.effectiveWeight).toBe(0);
    expect(music?.contribution).toBeNull();

    const sum = result.categories.reduce((s, c) => s + c.effectiveWeight, 0);
    expect(sum).toBeCloseTo(100, 2);

    const story = result.categories.find((c) => c.id === "story");
    expect(story?.effectiveWeight).toBeCloseTo((14 * 100) / 92, 3);

    expect(result.redistributed).toBe(true);
    expect(result.complete).toBe(true);
    expect(result.score).toBe(8);
  });

  it("keeps the score within the grades used", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), { story: 3, action: 9 });
    const { score } = computeResult(sentaiProfile, evaluation);
    expect(score).not.toBeNull();
    expect(score as number).toBeGreaterThanOrEqual(3);
    expect(score as number).toBeLessThanOrEqual(9);
  });

  it("never reads personal enjoyment into the official score", () => {
    const base = gradeAll(createEvaluation(sentaiProfile), { story: 7, characters: 7 });
    const a = computeResult(sentaiProfile, { ...base, enjoyment: 2 });
    const b = computeResult(sentaiProfile, { ...base, enjoyment: 10 });
    expect(a.score).toBe(b.score);
  });

  it("handles every category being not applicable", () => {
    const evaluation = createEvaluation(sentaiProfile);
    for (const id of Object.keys(evaluation.categories)) evaluation.categories[id].applicable = false;
    const result = computeResult(sentaiProfile, evaluation);
    expect(result.score).toBeNull();
    expect(result.complete).toBe(false);
  });
});

describe("markdown export", () => {
  const t = (key: string, values?: Record<string, string | number>) =>
    values ? `${key}(${Object.entries(values).map(([k, v]) => `${k}=${v}`).join(",")})` : key;

  it("follows the seven part structure in order", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), { story: 8 });
    evaluation.title = "Test Season";
    evaluation.introduction = "A short introduction.";
    evaluation.conclusion = "Strong story.";
    evaluation.enjoyment = 9;
    evaluation.categories.story.notes = "Tight structure.";
    const result = computeResult(sentaiProfile, evaluation);
    const md = exportMarkdown(sentaiProfile, evaluation, result, t);

    const order = [
      "# Test Season",
      "A short introduction.",
      "## export.categoryEvaluations",
      "Tight structure.",
      "## export.summary",
      "## export.calculation",
      "## export.officialScore",
      "## export.personalEnjoyment",
      "## export.conclusion",
      "Strong story.",
    ].map((needle) => md.indexOf(needle));

    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("lists all ten categories in the summary table", () => {
    const evaluation = createEvaluation(sentaiProfile);
    const result = computeResult(sentaiProfile, evaluation);
    const md = exportMarkdown(sentaiProfile, evaluation, result, t);
    const rows = md.split("\n").filter((l) => l.startsWith("| profiles.sentai.categories."));
    // One row per category in the grade table and one in the summary.
    expect(rows).toHaveLength(20);
  });
});

describe("standard markdown format", () => {
  it("bolds the scale, the summary weights and the calculation names", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), { theme: 8.5, story: 6.6 });
    const md = exportMarkdown(sentaiProfile, evaluation, computeResult(sentaiProfile, evaluation), (k) => k);
    expect(md).toContain("| profiles.sentai.categories.theme.name | 8.5 / **10** |");
    expect(md).toMatch(/^\| profiles\.sentai\.categories\.theme\.name \| 8\.5 \| \*\*[\d.]+%\*\* \|$/m);
    expect(md).toMatch(/^- \*\*profiles\.sentai\.categories\.theme\.name:\*\* 8\.5 × /m);
  });

  it("leaves categories without subcriteria or notes out of the detail blocks", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), { theme: 8 });
    const md = exportMarkdown(sentaiProfile, evaluation, computeResult(sentaiProfile, evaluation), (k) => k);
    expect(md).not.toContain("### ");
  });
});

describe("json round trip", () => {
  it("accepts what it exported", () => {
    const evaluation = gradeAll(createEvaluation(sentaiProfile), { story: 7.5 });
    evaluation.title = "Round trip";
    const text = JSON.stringify(toEnvelope(evaluation, new Date("2026-01-01T00:00:00Z")));
    const parsed = parseEnvelope(text, sentaiProfile);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.evaluation).toEqual(evaluation);
  });

  it("rejects broken input", () => {
    expect(parseEnvelope("not json", sentaiProfile)).toEqual({ ok: false, error: "invalidJson" });
    expect(parseEnvelope("{}", sentaiProfile)).toEqual({ ok: false, error: "notTokuten" });
  });

  it("rejects grades outside the scale", () => {
    const evaluation = createEvaluation(sentaiProfile);
    evaluation.categories.story.override = 11;
    const text = JSON.stringify(toEnvelope(evaluation));
    expect(parseEnvelope(text, sentaiProfile)).toEqual({ ok: false, error: "invalidShape" });
  });
});

import { readingTier, shapeOf } from "./insights";

describe("insights", () => {
  it("keeps 6 and 7 in the same solid tier", () => {
    expect(readingTier(6)).toBe("solid");
    expect(readingTier(7)).toBe("solid");
    expect(readingTier(7.49)).toBe("solid");
    expect(readingTier(7.5)).toBe("high");
    expect(readingTier(5.5)).toBe("solid");
    expect(readingTier(5.49)).toBe("middle");
    expect(readingTier(3.49)).toBe("low");
  });

  it("needs enough graded categories before describing a shape", () => {
    const ev = gradeAll(createEvaluation(sentaiProfile), { story: 9, action: 2, music: 5 });
    expect(shapeOf(computeResult(sentaiProfile, ev)).shape).toBe("none");
  });

  it("detects balanced and contrasted grades", () => {
    const balanced = gradeAll(createEvaluation(sentaiProfile), { story: 7, action: 7.5, music: 6.5, mecha: 7 });
    expect(shapeOf(computeResult(sentaiProfile, balanced)).shape).toBe("balanced");
    const contrasted = gradeAll(createEvaluation(sentaiProfile), { story: 9, action: 4, music: 6, mecha: 8 });
    expect(shapeOf(computeResult(sentaiProfile, contrasted)).shape).toBe("contrasted");
  });
});
