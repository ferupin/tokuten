/** How long a typed number waits for its next key, in milliseconds. */
export const GRADE_BUFFER_MS = 900;

const COMPLETE = /^(10|\d(\.\d)?)$/;
const PARTIAL = /^\d\.$/;

export interface GradeKeyResult {
  /** What the next key will be added to. */
  buffer: string;
  /** The grade to apply now, or null when the number is still being typed. */
  grade: number | null;
}

/**
 * Turns typed keys into a grade from 0 to 10 with at most one decimal.
 * "7" gives 7, "7" then "." then "5" gives 7.5, and "1" then "0" gives 10.
 * A key that would make the number invalid starts a new one, so "7" then "5" gives 5.
 * Returns null for a key that is not part of a grade.
 */
export function applyGradeKey(buffer: string, key: string): GradeKeyResult | null {
  const k = key === "," ? "." : key;
  if (!/^[0-9.]$/.test(k)) return null;
  const next = buffer + k;
  if (COMPLETE.test(next)) return { buffer: next, grade: Number(next) };
  if (PARTIAL.test(next)) return { buffer: next, grade: null };
  if (/^[0-9]$/.test(k)) return { buffer: k, grade: Number(k) };
  return { buffer: "", grade: null };
}
