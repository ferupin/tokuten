/**
 * Core domain types for Tokuten.
 *
 * Nothing in this folder knows about React, the DOM or any language.
 * Profiles are plain data, and all human readable text lives in the i18n
 * dictionaries, keyed by the ids defined here.
 */

export type PillarId = string;
export type CategoryId = string;
export type SubcriterionId = string;

/** A group of categories, shown with the color and kanji of a ranger. */
export interface Pillar {
  id: PillarId;
  /** Single kanji used as the visual mark, for example 赤. */
  kanji: string;
  /** Romanized reading, for example "aka". */
  reading: string;
  /** Design token name, resolved to a color by the theme. */
  tone: "red" | "blue" | "yellow" | "green" | "pink";
}

export interface Category {
  id: CategoryId;
  pillarId: PillarId;
  /** Weight in percent. All weights in a profile must add up to 100. */
  weight: number;
  subcriteria: readonly SubcriterionId[];
}

/**
 * A profile describes one evaluation method for one franchise.
 * Adding Kamen Rider means adding another profile, not changing the engine.
 */
export interface Profile {
  /** Stable identifier, for example "sentai". */
  id: string;
  /** Version of the weights and categories, bumped on any change. */
  version: number;
  pillars: readonly Pillar[];
  categories: readonly Category[];
  scale: { min: number; max: number; step: number };
  /** Ids of the consistency checks, in order. Text lives in the dictionaries. */
  checklist: readonly string[];
}

/** One subcriterion inside a category. */
export interface SubcriterionEntry {
  /** Grade on the profile scale, or null when not graded yet. */
  value: number | null;
  /** When false the subcriterion is excluded from the category average. */
  applicable: boolean;
}

export interface CategoryEntry {
  /** When false the whole category is excluded and its weight is redistributed. */
  applicable: boolean;
  /** When set, replaces the average of the subcriteria. */
  override: number | null;
  subcriteria: Record<SubcriterionId, SubcriterionEntry>;
  /** Reasoning with concrete examples. */
  notes: string;
}

/**
 * How the grades are entered.
 * - detailed: each subcriterion is graded and the category grade is their average.
 * - quick: one grade is set directly per category.
 * The mode never changes the calculation, only how much is graded by hand.
 */
export type EvaluationMode = "detailed" | "quick";

export const EVALUATION_MODES: readonly EvaluationMode[] = ["detailed", "quick"];

export interface Evaluation {
  profileId: string;
  profileVersion: number;
  mode: EvaluationMode;
  title: string;
  introduction: string;
  conclusion: string;
  /** Personal enjoyment. Kept apart from the official score on purpose. */
  enjoyment: number | null;
  /** Ids of the consistency checks the author confirmed. Never read by the scoring code. */
  checked: string[];
  categories: Record<CategoryId, CategoryEntry>;
}

export type CategoryStatus = "graded" | "pending" | "not-applicable";

export type GradeSource = "override" | "average" | "none";

export interface CategoryResult {
  id: CategoryId;
  weight: number;
  /** Weight after redistribution, in percent. Zero for not applicable categories. */
  effectiveWeight: number;
  status: CategoryStatus;
  grade: number | null;
  source: GradeSource;
  /** Grade multiplied by the effective weight, divided by 100. Null if not graded. */
  contribution: number | null;
  gradedSubcriteria: number;
  applicableSubcriteria: number;
}

export interface EvaluationResult {
  categories: CategoryResult[];
  /** Weighted score out of the scale maximum. Null until one category is graded. */
  score: number | null;
  /** True when every applicable category has a grade. */
  complete: boolean;
  /** True when at least one category was marked not applicable. */
  redistributed: boolean;
  gradedCount: number;
  applicableCount: number;
  totalCount: number;
}
