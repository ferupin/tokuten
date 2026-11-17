import { describe, expect, it } from "vitest";
import { sentaiProfile as sentai } from "@/profiles/sentai";
import { computeResult, createEvaluation } from "./scoring";
import { computeSensitivity } from "./sensitivity";

function evaluate(grades: Record<string, number | null>, notApplicable: string[] = []) {
  const e = createEvaluation(sentai);
  for (const [id, g] of Object.entries(grades)) e.categories[id].override = g;
  for (const id of notApplicable) e.categories[id].applicable = false;
  return computeResult(sentai, e);
}

const ids = sentai.categories.map((c) => c.id);
const allGraded = (g: number) => Object.fromEntries(ids.map((id) => [id, g]));

describe("computeSensitivity", () => {
  it("is null with fewer than two graded categories", () => {
    expect(computeSensitivity(evaluate({}))).toBeNull();
    expect(computeSensitivity(evaluate({ [ids[0]]: 7 }))).toBeNull();
  });

  it("gives each category its weight divided by 100 when everything is graded", () => {
    const s = computeSensitivity(evaluate(allGraded(7)))!;
    for (const row of s.rows) {
      const weight = sentai.categories.find((c) => c.id === row.id)!.weight;
      expect(row.perPoint).toBeCloseTo(weight / 100, 6);
    }
  });

  it("matches the real change of the score when a grade moves by one point", () => {
    const base = evaluate(allGraded(6));
    const s = computeSensitivity(base)!;
    for (const row of s.rows) {
      const moved = evaluate({ ...allGraded(6), [row.id]: 7 });
      expect(moved.score! - base.score!).toBeCloseTo(row.perPoint, 1);
    }
  });

  it("orders by weight and keeps the profile order on ties", () => {
    const s = computeSensitivity(evaluate(allGraded(5)))!;
    const perPoints = s.rows.map((r) => r.perPoint);
    expect(perPoints).toEqual([...perPoints].sort((a, b) => b - a));
    const tied = s.rows.filter((r) => r.perPoint === s.rows[s.rows.length - 1].perPoint).map((r) => r.id);
    expect(tied).toEqual(ids.filter((id) => tied.includes(id)));
  });

  it("does not depend on the grades, only on which categories count", () => {
    const low = computeSensitivity(evaluate(allGraded(2)))!;
    const high = computeSensitivity(evaluate(allGraded(9)))!;
    expect(low.rows.map((r) => [r.id, r.perPoint])).toEqual(high.rows.map((r) => [r.id, r.perPoint]));
  });

  it("reports the room to rise and to fall", () => {
    const s = computeSensitivity(evaluate(allGraded(8)))!;
    const row = s.rows[0];
    expect(row.up).toBeCloseTo(2 * row.perPoint, 6);
    expect(row.down).toBeCloseTo(8 * row.perPoint, 6);
  });

  it("shares weight again when a category is not applicable", () => {
    const full = computeSensitivity(evaluate(allGraded(7)))!;
    const without = computeSensitivity(evaluate(allGraded(7), [ids[0]]))!;
    expect(without.rows.find((r) => r.id === ids[0])).toBeUndefined();
    const total = without.rows.reduce((s, r) => s + r.perPoint, 0);
    expect(total).toBeCloseTo(1, 6);
    expect(without.rows.length).toBe(full.rows.length - 1);
  });

  it("keeps ungraded categories out of the rows and lists them as pending", () => {
    const grades = Object.fromEntries(ids.slice(0, 5).map((id) => [id, 7]));
    const s = computeSensitivity(evaluate(grades))!;
    expect(s.rows).toHaveLength(5);
    expect(s.pending).toEqual(ids.slice(5));
    expect(s.rows.reduce((sum, r) => sum + r.perPoint, 0)).toBeCloseTo(1, 6);
  });

  it("states the top three share only with enough graded categories", () => {
    const three = Object.fromEntries(ids.slice(0, 3).map((id) => [id, 7]));
    expect(computeSensitivity(evaluate(three))!.topShare).toBeNull();
    const full = computeSensitivity(evaluate(allGraded(7)))!;
    expect(full.topShare!.ids).toHaveLength(3);
    expect(full.topShare!.percent).toBeGreaterThan(30);
    expect(full.topShare!.percent).toBeLessThanOrEqual(100);
  });
});
