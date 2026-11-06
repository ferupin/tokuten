import type { EvaluationResult } from "./types";

/**
 * Quiet context shown next to the official score.
 *
 * A single number cannot describe a work. These helpers give the number a
 * tone of reading and show how the grades are spread, without ever changing
 * the score itself.
 */

export type ReadingTier = "low" | "middle" | "solid" | "high";

/**
 * Maps a score to the tone of its reading note.
 * 6 and 7 share their own tier on purpose: they are solid results.
 */
export function readingTier(score: number): ReadingTier {
  if (score < 3.5) return "low";
  if (score < 5.5) return "middle";
  if (score < 7.5) return "solid";
  return "high";
}

export type Shape = "balanced" | "contrasted" | "none";

/** Smallest number of graded categories needed to talk about a shape. */
export const MIN_FOR_SHAPE = 4;

/**
 * Describes how far apart the highest and lowest category grades are.
 * Returns "none" when there is too little data or nothing worth saying.
 */
export function shapeOf(result: EvaluationResult): { shape: Shape; range: number } {
  const grades = result.categories.flatMap((c) => (c.grade === null ? [] : [c.grade]));
  if (grades.length < MIN_FOR_SHAPE) return { shape: "none", range: 0 };
  const range = Math.max(...grades) - Math.min(...grades);
  if (range <= 1.5) return { shape: "balanced", range };
  if (range >= 4) return { shape: "contrasted", range };
  return { shape: "none", range };
}
