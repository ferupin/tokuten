/**
 * Grade bands of the Kijun scale.
 *
 * Each integer on the 0 to 10 scale has a label. A score belongs to the band
 * of its nearest integer, with halves rounding up, so 4.5 is "Average" and
 * 6.49 is "Fine". Labels are resolved through i18n using `grades.<band>`.
 */
export const GRADE_BANDS = [
  "abysmal", // 0
  "terrible", // 1
  "veryPoor", // 2
  "poor", // 3
  "mediocre", // 4
  "average", // 5
  "fine", // 6
  "good", // 7
  "great", // 8
  "outstanding", // 9
  "masterpiece", // 10
] as const;

export type GradeBand = (typeof GRADE_BANDS)[number];

/** Returns the band for a score, clamping values outside 0 to 10. */
export function gradeBand(score: number): GradeBand {
  const clamped = Math.min(10, Math.max(0, score));
  // Add a tiny epsilon so values like 4.5 resolve upward despite float noise.
  const index = Math.floor(clamped + 0.5 + 1e-9);
  return GRADE_BANDS[Math.min(10, index)];
}

/** Rounds to a fixed number of decimals, avoiding binary float artifacts. */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Formats a grade for display with one decimal, for example "7.5". */
export function formatGrade(value: number, decimals = 1): string {
  return round(value, decimals).toFixed(decimals);
}
