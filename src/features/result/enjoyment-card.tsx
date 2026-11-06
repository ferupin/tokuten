"use client";

import { GradeSlider } from "@/components/ui/grade-slider";
import { useI18n } from "@/i18n";
import { useEvaluationStore } from "@/features/evaluation/use-store";

/** Personal enjoyment. Lives in its own card so it can never look like part of the official score. */
export function EnjoymentCard() {
  const { t } = useI18n();
  const enjoyment = useEvaluationStore((s) => s.evaluation.enjoyment);
  const setEnjoyment = useEvaluationStore((s) => s.setEnjoyment);

  return (
    <section aria-labelledby="enjoy-title" className="card border-dashed p-5 sm:p-6">
      <h2 id="enjoy-title" className="m-0 text-[15px] font-bold">{t("enjoyment.title")}</h2>
      <p className="mb-4 mt-1 max-w-xl text-[13px] text-soft">{t("enjoyment.description")}</p>
      <GradeSlider label={t("enjoyment.title")} value={enjoyment} tone="var(--pink)" showHint onChange={setEnjoyment} />
      {enjoyment !== null && (
        <button type="button" className="btn ghost mt-2 !py-1 text-xs" onClick={() => setEnjoyment(null)}>
          {t("enjoyment.clear")}
        </button>
      )}
    </section>
  );
}
