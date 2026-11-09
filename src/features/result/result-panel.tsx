"use client";

import { formatGrade, gradeBand } from "@/core/grades";
import { readingTier, shapeOf } from "@/core/insights";
import type { EvaluationMode, EvaluationResult, Profile } from "@/core/types";
import { Hanko } from "@/components/brand/hanko";
import { Radar } from "@/components/ui/radar";
import { numeral } from "@/features/evaluation/numerals";
import { useI18n } from "@/i18n";

export function ResultPanel({ profile, result, mode }: { profile: Profile; result: EvaluationResult; mode: EvaluationMode }) {
  const { t } = useI18n();
  const pillarTone = (categoryId: string) => {
    const cat = profile.categories.find((c) => c.id === categoryId)!;
    return `var(--${profile.pillars.find((p) => p.id === cat.pillarId)!.tone})`;
  };

  const graded = result.categories.filter((c) => c.grade !== null);
  const best = graded.length ? graded.reduce((a, b) => ((b.grade ?? 0) > (a.grade ?? 0) ? b : a)) : null;
  const worst = graded.length > 1 ? graded.reduce((a, b) => ((b.grade ?? 0) < (a.grade ?? 0) ? b : a)) : null;
  const { shape } = shapeOf(result);
  const name = (id: string) => t(`profiles.${profile.id}.categories.${id}.name`);

  return (
    <section aria-labelledby="result-title" className="card p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="text-center">
          <h2 id="result-title" className="label m-0">
            {t("result.officialScore")}
          </h2>
          {mode === "quick" && (
            <p className="label m-0 mt-1">
              {t("modes.badge")} · <span lang="ja">{t("modes.quick.kanji")}</span>
            </p>
          )}
          <div className="relative mx-auto mt-4 inline-block">
            <div className="tnum font-display text-[clamp(64px,13vw,104px)] leading-none" aria-live="polite">
              {result.score === null ? "—" : formatGrade(result.score, 1)}
              <span className="ml-1 text-[0.28em] text-soft">/10</span>
            </div>
            {result.score !== null && (
              <span key={result.complete ? "done" : "part"} className={`absolute -right-14 -top-3 hidden sm:block ${result.complete ? "stamp-in" : ""}`}>
                <Hanko size={52} rotate={-4} title={result.complete ? t("result.complete") : t("result.partial")} color={result.complete ? "var(--accent)" : "var(--line-strong)"}>
                  {result.complete ? "決" : "仮"}
                </Hanko>
              </span>
            )}
          </div>
          <p className="mb-0 mt-3 font-serif text-xl font-extrabold">
            {result.score === null ? t("result.noScore") : t(`grades.${gradeBand(result.score)}`)}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-xs text-soft">
            {result.complete ? t("result.complete") : t("result.partialNote", { graded: result.gradedCount, total: result.applicableCount })}
            {result.redistributed && <> {t("result.redistributedNote", { count: result.applicableCount })}</>}
          </p>
          {result.score !== null && (
            <div className="mx-auto mt-4 max-w-md space-y-1.5 text-[13px] italic leading-relaxed text-soft">
              <p className="m-0">{t(`result.reading.${readingTier(result.score)}`)}</p>
              {shape !== "none" && <p className="m-0">{t(`result.shape.${shape}`)}</p>}
            </div>
          )}
          <div className="mt-6">
            <Radar
              points={result.categories.map((c, i) => ({ id: c.id, label: numeral(i), value: c.grade, color: pillarTone(c.id) }))}
            />
          </div>
        </div>

        <div>
          <h3 className="label mb-3 mt-0">{t("result.breakdown")}</h3>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="label text-left">
                <th className="pb-2 font-normal">{t("result.category")}</th>
                <th className="pb-2 text-right font-normal">{t("result.grade")}</th>
                <th className="pb-2 text-right font-normal">{t("result.weight")}</th>
                <th className="pb-2 text-right font-normal">{t("result.points")}</th>
              </tr>
            </thead>
            <tbody>
              {result.categories.map((c, i) => (
                <tr key={c.id} className="border-t border-dashed border-line" style={{ opacity: c.status === "not-applicable" ? 0.45 : 1 }}>
                  <td className="py-2 pr-2">
                    <span className="mr-2 font-serif font-extrabold" style={{ color: pillarTone(c.id) }} aria-hidden>
                      {numeral(i)}
                    </span>
                    {name(c.id)}
                  </td>
                  <td className="tnum py-2 text-right font-mono font-bold">{c.grade === null ? "—" : formatGrade(c.grade)}</td>
                  <td className="tnum py-2 text-right font-mono text-soft">{c.status === "not-applicable" ? "0%" : `${formatGrade(c.effectiveWeight, c.effectiveWeight % 1 === 0 ? 0 : 1)}%`}</td>
                  <td className="tnum py-2 text-right font-mono">{c.contribution === null ? "—" : formatGrade(c.contribution, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(best || worst) && (
            <dl className="mb-0 mt-5 grid gap-2 text-[13px] sm:grid-cols-2">
              {best && (
                <div>
                  <dt className="label">{t("result.strongest")}</dt>
                  <dd className="m-0">{name(best.id)} · <b className="tnum font-mono">{formatGrade(best.grade!)}</b></dd>
                </div>
              )}
              {worst && (
                <div>
                  <dt className="label">{t("result.weakest")}</dt>
                  <dd className="m-0">{name(worst.id)} · <b className="tnum font-mono">{formatGrade(worst.grade!)}</b></dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
