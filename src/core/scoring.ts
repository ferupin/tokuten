import { round } from "./grades";
import type {
  Category,
  CategoryEntry,
  CategoryResult,
  Evaluation,
  EvaluationResult,
  GradeSource,
  Profile,
} from "./types";

/** Creates an empty entry for a category: nothing graded, everything applicable. */
export function createCategoryEntry(category: Category): CategoryEntry {
  return {
    applicable: true,
    override: null,
    notes: "",
    subcriteria: Object.fromEntries(
      category.subcriteria.map((id) => [id, { value: null, applicable: true }]),
    ),
  };
}

/** Creates a blank evaluation for a profile. Nothing is graded by default. */
export function createEvaluation(profile: Profile): Evaluation {
  return {
    profileId: profile.id,
    profileVersion: profile.version,
    title: "",
    introduction: "",
    conclusion: "",
    enjoyment: null,
    categories: Object.fromEntries(profile.categories.map((c) => [c.id, createCategoryEntry(c)])),
  };
}

/** Sum of all weights in a profile. Expected to be 100. */
export function totalWeight(profile: Profile): number {
  return profile.categories.reduce((sum, c) => sum + c.weight, 0);
}

interface DerivedGrade {
  grade: number | null;
  source: GradeSource;
  gradedSubcriteria: number;
  applicableSubcriteria: number;
}

/**
 * Derives the grade of one category.
 * An explicit override wins. Otherwise the grade is the average of the
 * applicable subcriteria that have been graded.
 */
export function deriveCategoryGrade(entry: CategoryEntry): DerivedGrade {
  const subs = Object.values(entry.subcriteria).filter((s) => s.applicable);
  const graded = subs.filter((s) => s.value !== null) as { value: number }[];

  const base = { gradedSubcriteria: graded.length, applicableSubcriteria: subs.length };

  if (entry.override !== null) {
    return { ...base, grade: entry.override, source: "override" };
  }
  if (graded.length === 0) {
    return { ...base, grade: null, source: "none" };
  }
  const average = graded.reduce((sum, s) => sum + s.value, 0) / graded.length;
  return { ...base, grade: average, source: "average" };
}

/**
 * Computes the official result.
 *
 * Rules:
 * - Categories marked not applicable are removed and their weight is spread
 *   proportionally across the remaining ones.
 * - Categories that are applicable but not graded yet are left out of the
 *   score, so the number shown is a partial score until `complete` is true.
 * - A fully graded evaluation with nothing removed equals
 *   the sum of grade times weight divided by 100.
 */
export function computeResult(profile: Profile, evaluation: Evaluation): EvaluationResult {
  const applicable = profile.categories.filter((c) => evaluation.categories[c.id]?.applicable);
  const applicableWeight = applicable.reduce((sum, c) => sum + c.weight, 0);

  const categories: CategoryResult[] = profile.categories.map((category) => {
    const entry = evaluation.categories[category.id];
    const isApplicable = Boolean(entry?.applicable);
    const derived = entry
      ? deriveCategoryGrade(entry)
      : { grade: null, source: "none" as const, gradedSubcriteria: 0, applicableSubcriteria: 0 };

    const effectiveWeight =
      isApplicable && applicableWeight > 0 ? (category.weight * 100) / applicableWeight : 0;

    const status = !isApplicable ? "not-applicable" : derived.grade === null ? "pending" : "graded";

    return {
      id: category.id,
      weight: category.weight,
      effectiveWeight: round(effectiveWeight, 4),
      status,
      grade: isApplicable ? derived.grade : null,
      source: isApplicable ? derived.source : "none",
      contribution:
        status === "graded" && derived.grade !== null
          ? round((derived.grade * effectiveWeight) / 100, 4)
          : null,
      gradedSubcriteria: derived.gradedSubcriteria,
      applicableSubcriteria: derived.applicableSubcriteria,
    };
  });

  const graded = categories.filter((c) => c.status === "graded");
  const gradedWeight = graded.reduce((sum, c) => sum + c.effectiveWeight, 0);
  const weightedSum = graded.reduce((sum, c) => sum + (c.grade ?? 0) * c.effectiveWeight, 0);

  const score = graded.length === 0 || gradedWeight === 0 ? null : round(weightedSum / gradedWeight, 2);

  return {
    categories,
    score,
    complete: applicable.length > 0 && graded.length === applicable.length,
    redistributed: applicable.length < profile.categories.length,
    gradedCount: graded.length,
    applicableCount: applicable.length,
    totalCount: profile.categories.length,
  };
}
