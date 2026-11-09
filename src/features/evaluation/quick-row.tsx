"use client";

import { useState } from "react";
import { formatGrade } from "@/core/grades";
import type { Category, CategoryResult, Pillar } from "@/core/types";
import { GradeSlider } from "@/components/ui/grade-slider";
import { useI18n } from "@/i18n";
import { numeral } from "./numerals";
import type { useEvaluationStore } from "./use-store";

interface Props {
  index: number;
  profileId: string;
  category: Category;
  pillar: Pillar;
  result: CategoryResult;
  store: typeof useEvaluationStore;
}

/**
 * One category in Quick mode: a single slider that sets the category grade
 * directly. Guidance and notes stay one click away, so the shortcut never
 * hides what the category covers.
 */
export function QuickRow({ index, profileId, category, pillar, result, store }: Props) {
  const { t } = useI18n();
  const entry = store((s) => s.evaluation.categories[category.id]);
  const actions = store.getState();
  const [open, setOpen] = useState(false);

  const base = `profiles.${profileId}.categories.${category.id}`;
  const tone = `var(--${pillar.tone})`;
  const na = result.status === "not-applicable";
  const direct = entry.override !== null;
  const notesId = `quick-notes-${category.id}`;

  return (
    <article className="card overflow-hidden px-4 py-4 sm:px-5" style={{ borderLeft: `4px solid ${na ? "var(--line-strong)" : tone}` }}>
      <div className="flex items-center gap-4">
        <span className="font-serif text-2xl font-extrabold leading-none" style={{ color: tone }} aria-hidden>
          {numeral(index)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`m-0 truncate text-[15px] font-bold ${na ? "text-soft line-through" : ""}`}>{t(`${base}.name`)}</h3>
          <p className="label m-0">
            <span aria-hidden>{pillar.kanji}</span> {t(`profiles.${profileId}.pillars.${pillar.id}`)} · {t("evaluation.weightLabel", { weight: category.weight })}
          </p>
        </div>
        <span className="tnum font-mono text-lg font-bold" style={{ color: result.grade === null ? "var(--ink-soft)" : tone }}>
          {result.grade === null ? "—" : formatGrade(result.grade)}
        </span>
      </div>

      {na ? (
        <p className="mb-0 mt-3 text-[13px] text-soft">{t("modes.row.skipped")}</p>
      ) : (
        <div className="mt-2">
          <GradeSlider
            bare
            showHint
            label={t(`${base}.name`)}
            value={result.grade}
            tone={tone}
            onChange={(v) => actions.setOverride(category.id, v)}
          />
          <p className="m-0 mt-1 text-[12px] text-soft">
            {direct
              ? t("modes.row.direct")
              : result.source === "average"
                ? t("modes.row.fromSubcriteria", { count: result.gradedSubcriteria })
                : t("evaluation.noGradeYet")}
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn ghost !px-3 !py-1 text-xs" aria-expanded={open} aria-controls={notesId} onClick={() => setOpen((v) => !v)}>
          {t("modes.row.guidance")}
        </button>
        {!na && direct && (
          <button type="button" className="btn ghost !px-3 !py-1 text-xs" onClick={() => actions.setOverride(category.id, null)}>
            {result.gradedSubcriteria > 0 ? t("modes.row.useAverage") : t("modes.row.clear")}
          </button>
        )}
        <button
          type="button"
          className="btn ghost !px-3 !py-1 text-xs"
          aria-pressed={na}
          onClick={() => actions.setCategoryApplicable(category.id, na)}
        >
          {na ? t("modes.row.restore") : t("modes.row.notApplicable")}
        </button>
      </div>

      {open && (
        <div id={notesId} className="mt-4 space-y-4 border-t border-dashed border-line pt-4">
          <div className="grid gap-3 text-[13px] text-soft sm:grid-cols-2">
            <p className="m-0">
              <span className="label block">{t("evaluation.scope")}</span>
              {t(`${base}.scope`)}
            </p>
            <p className="m-0">
              <span className="label block">{t("evaluation.boundary")}</span>
              {t(`${base}.boundary`)}
            </p>
          </div>
          <div>
            <label htmlFor={`${notesId}-text`} className="label mb-1.5 block">
              {t("evaluation.notesLabel")}
            </label>
            <textarea
              id={`${notesId}-text`}
              className="field min-h-[80px] resize-y"
              placeholder={t("evaluation.notesPlaceholder")}
              value={entry.notes}
              onChange={(e) => actions.setNotes(category.id, e.target.value)}
            />
          </div>
        </div>
      )}
    </article>
  );
}
