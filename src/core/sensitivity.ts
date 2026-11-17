import type { EvaluationResult } from "./types";

/** Smallest number of graded categories for which a sensitivity view says anything. */
export const MIN_GRADED_FOR_SENSITIVITY = 2;
/** Smallest number of graded categories for which a "top three" share is worth stating. */
export const MIN_GRADED_FOR_TOP_SHARE = 4;

export interface SensitivityRow {
  id: string;
  /** Change of the shown score for one point more in this category. */
  perPoint: number;
  /** Largest rise this category can still give, if it went to 10. */
  up: number;
  /** Largest drop this category can still cause, if it went to 0. */
  down: number;
}

export interface Sensitivity {
  /** Graded categories, the ones that move the score most first. Ties keep the profile order. */
  rows: SensitivityRow[];
  /** Ids of categories not graded yet. They are not part of the shown score. */
  pending: string[];
  /** Share of the shown score held by the three heaviest categories, in percent. Null when too few are graded. */
  topShare: { ids: string[]; percent: number } | null;
}

/**
 * How much each category moves the score that is shown.
 *
 * The score is a weighted average of the graded categories, so one more point
 * in a category moves it by that category's share of the graded weight. Nothing
 * is simulated: this is the weight made visible, and it changes with the
 * categories that are graded or marked not applicable, never with the grades.
 */
export function computeSensitivity(result: EvaluationResult): Sensitivity | null {
  const graded = result.categories.filter((c) => c.status === "graded" && c.grade !== null);
  if (graded.length < MIN_GRADED_FOR_SENSITIVITY) return null;

  const gradedWeight = graded.reduce((sum, c) => sum + c.effectiveWeight, 0);
  if (gradedWeight <= 0) return null;

  const rows = graded
    .map((c, index) => {
      const perPoint = c.effectiveWeight / gradedWeight;
      return { index, row: { id: c.id, perPoint, up: (10 - c.grade!) * perPoint, down: c.grade! * perPoint } };
    })
    .sort((a, b) => b.row.perPoint - a.row.perPoint || a.index - b.index)
    .map((r) => r.row);

  const top = rows.slice(0, 3);
  const topShare =
    graded.length >= MIN_GRADED_FOR_TOP_SHARE
      ? { ids: top.map((r) => r.id), percent: top.reduce((s, r) => s + r.perPoint, 0) * 100 }
      : null;

  return {
    rows,
    pending: result.categories.filter((c) => c.status === "pending").map((c) => c.id),
    topShare,
  };
}
