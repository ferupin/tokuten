"use client";

import { EVALUATION_MODES, type EvaluationMode } from "@/core/types";
import { useI18n } from "@/i18n";

/** Segmented control for the evaluation mode. Each option carries its kanji. */
export function ModeSwitch({ mode, onChange }: { mode: EvaluationMode; onChange: (mode: EvaluationMode) => void }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t("modes.label")} className="inline-flex rounded-lg border border-line p-0.5">
      {EVALUATION_MODES.map((option) => {
        const active = mode === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`flex items-baseline gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
              active ? "bg-ink text-bg" : "text-soft hover:text-ink"
            }`}
          >
            {t(`modes.${option}.name`)}
            <span lang="ja" className="font-serif text-[11px] font-extrabold opacity-80">
              {t(`modes.${option}.kanji`)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
