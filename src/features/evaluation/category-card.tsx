"use client";

import { formatGrade, gradeBand } from "@/core/grades";
import type { Category, CategoryResult, Pillar } from "@/core/types";
import { Hanko } from "@/components/brand/hanko";
import { GradeSlider } from "@/components/ui/grade-slider";
import { Anchors } from "./anchors";
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
  open: boolean;
  onToggle: () => void;
}

export function CategoryCard({ index, profileId, category, pillar, result, store, open, onToggle }: Props) {
  const { t } = useI18n();
  const entry = store((s) => s.evaluation.categories[category.id]);
  const s = store.getState();
  const manual = entry.override !== null;

  const base = `profiles.${profileId}.categories.${category.id}`;
  const tone = `var(--${pillar.tone})`;
  const na = result.status === "not-applicable";
  const statusKey = result.status === "not-applicable" ? "notApplicable" : result.status;
  const bodyId = `body-${category.id}`;

  return (
    <article className="card overflow-hidden" style={{ borderLeft: `4px solid ${na ? "var(--line-strong)" : tone}` }}>
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex w-full items-center gap-4 bg-transparent px-4 py-4 text-left sm:px-5"
        >
          <span className="font-serif text-2xl font-extrabold leading-none" style={{ color: tone }} aria-hidden>
            {numeral(index)}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block truncate text-[15px] font-bold ${na ? "text-soft line-through" : "text-ink"}`}>{t(`${base}.name`)}</span>
            <span className="label block">
              <span aria-hidden>{pillar.kanji}</span> {t(`profiles.${profileId}.pillars.${pillar.id}`)} · {t("evaluation.weightLabel", { weight: category.weight })}
            </span>
          </span>
          <span className="text-right">
            <span className="tnum block font-mono text-lg font-bold" style={{ color: result.grade === null ? "var(--ink-soft)" : tone }}>
              {result.grade === null ? "—" : formatGrade(result.grade)}
            </span>
            <span className="label block">{t(`evaluation.status.${statusKey}`)}</span>
          </span>
          <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-soft transition-transform ${open ? "rotate-180" : ""}`}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h3>

      {open && (
        <div id={bodyId} className="space-y-5 border-t border-dashed border-line px-4 pb-6 pt-4 sm:px-5">
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
          <Anchors base={base} />

          <label className="flex items-start gap-3 rounded-lg bg-surface-2 px-3 py-2.5 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={na}
              onChange={(e) => s.setCategoryApplicable(category.id, !e.target.checked)}
            />
            <span>
              <strong className="font-semibold">{t("evaluation.categoryNotApplicable")}</strong>
              <span className="block text-xs text-soft">{t("evaluation.categoryNotApplicableHint")}</span>
            </span>
          </label>

          {!na && (
            <>
              <div>
                <h4 className="m-0 text-sm font-bold">{t("evaluation.subcriteriaTitle")}</h4>
                <p className="mb-3 mt-0.5 text-xs text-soft">{t("evaluation.subcriteriaHint")}</p>
                <ul className="m-0 grid list-none gap-3 p-0">
                  {category.subcriteria.map((id) => {
                    const sub = entry.subcriteria[id];
                    return (
                      <li key={id} className="grid grid-cols-[1fr_auto] items-center gap-3">
                        <GradeSlider
                          label={t(`${base}.subcriteria.${id}`)}
                          value={sub.value}
                          tone={tone}
                          disabled={!sub.applicable}
                          onChange={(v) => s.setSubcriterion(category.id, id, v)}
                        />
                        <button
                          type="button"
                          className="btn ghost !px-2.5 !py-1 text-xs"
                          aria-pressed={!sub.applicable}
                          onClick={() => s.setSubcriterionApplicable(category.id, id, !sub.applicable)}
                        >
                          {sub.applicable ? t("evaluation.subcriterionApplicable") : t("evaluation.subcriterionNotApplicable")}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-lg border border-line p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="label">{t("evaluation.categoryGrade")}</span>
                  <span className="text-xs text-soft">
                    {result.source === "override"
                      ? t("evaluation.fromOverride")
                      : result.source === "average"
                        ? t("evaluation.fromAverage", { count: result.gradedSubcriteria })
                        : t("evaluation.noGradeYet")}
                  </span>
                </div>
                {manual ? (
                  <div className="mt-2 space-y-2">
                    <GradeSlider
                      label={t("evaluation.categoryGrade")}
                      value={entry.override}
                      tone={tone}
                      showHint
                      onChange={(v) => s.setOverride(category.id, v)}
                    />
                    <button
                      type="button"
                      className="btn ghost !py-1 text-xs"
                      onClick={() => s.setOverride(category.id, null)}
                    >
                      {t("evaluation.useAverage")}
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-sm">
                      {result.grade !== null && (
                        <>
                          <strong className="tnum font-mono">{formatGrade(result.grade)}</strong> · {t(`grades.${gradeBand(result.grade)}`)}
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      className="btn ghost !py-1 text-xs"
                      onClick={() => s.setOverride(category.id, result.grade ?? 5)}
                    >
                      {t("evaluation.overrideGrade")}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor={`notes-${category.id}`} className="label mb-1.5 block">
              {t("evaluation.notesLabel")}
            </label>
            <textarea
              id={`notes-${category.id}`}
              className="field min-h-[88px] resize-y"
              placeholder={t("evaluation.notesPlaceholder")}
              value={entry.notes}
              onChange={(e) => s.setNotes(category.id, e.target.value)}
            />
          </div>

          {result.contribution !== null && (
            <p className="label m-0">
              {t("evaluation.contribution")}:{" "}
              <b className="tnum text-ink">{t("evaluation.points", { value: formatGrade(result.contribution, 2) })}</b>
              {result.effectiveWeight !== category.weight && <> · {t("evaluation.effectiveWeightLabel", { weight: formatGrade(result.effectiveWeight, 1) })}</>}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
