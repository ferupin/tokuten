import { create } from "zustand";
import { createEvaluation } from "@/core/scoring";
import type { CategoryId, Evaluation, Profile, SubcriterionId } from "@/core/types";

interface EvaluationState {
  profile: Profile;
  evaluation: Evaluation;
  setTitle: (value: string) => void;
  setIntroduction: (value: string) => void;
  setConclusion: (value: string) => void;
  setEnjoyment: (value: number | null) => void;
  setNotes: (category: CategoryId, value: string) => void;
  setCategoryApplicable: (category: CategoryId, applicable: boolean) => void;
  setOverride: (category: CategoryId, value: number | null) => void;
  setSubcriterion: (category: CategoryId, sub: SubcriterionId, value: number | null) => void;
  setSubcriterionApplicable: (category: CategoryId, sub: SubcriterionId, applicable: boolean) => void;
  load: (evaluation: Evaluation) => void;
  reset: () => void;
}

/**
 * In-memory store. Nothing is persisted: closing the tab clears the evaluation,
 * which is intentional. Export to JSON when you want to keep one.
 */
export function createEvaluationStore(profile: Profile) {
  return create<EvaluationState>((set) => {
    const patchCategory = (id: CategoryId, patch: (c: Evaluation["categories"][string]) => Evaluation["categories"][string]) =>
      set((s) => ({
        evaluation: {
          ...s.evaluation,
          categories: { ...s.evaluation.categories, [id]: patch(s.evaluation.categories[id]) },
        },
      }));

    return {
      profile,
      evaluation: createEvaluation(profile),
      setTitle: (title) => set((s) => ({ evaluation: { ...s.evaluation, title } })),
      setIntroduction: (introduction) => set((s) => ({ evaluation: { ...s.evaluation, introduction } })),
      setConclusion: (conclusion) => set((s) => ({ evaluation: { ...s.evaluation, conclusion } })),
      setEnjoyment: (enjoyment) => set((s) => ({ evaluation: { ...s.evaluation, enjoyment } })),
      setNotes: (id, notes) => patchCategory(id, (c) => ({ ...c, notes })),
      setCategoryApplicable: (id, applicable) => patchCategory(id, (c) => ({ ...c, applicable })),
      setOverride: (id, override) => patchCategory(id, (c) => ({ ...c, override })),
      setSubcriterion: (id, sub, value) =>
        patchCategory(id, (c) => ({
          ...c,
          subcriteria: { ...c.subcriteria, [sub]: { ...c.subcriteria[sub], value } },
        })),
      setSubcriterionApplicable: (id, sub, applicable) =>
        patchCategory(id, (c) => ({
          ...c,
          subcriteria: { ...c.subcriteria, [sub]: { ...c.subcriteria[sub], applicable } },
        })),
      load: (evaluation) => set({ evaluation }),
      reset: () => set({ evaluation: createEvaluation(profile) }),
    };
  });
}
