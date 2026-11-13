"use client";

import { formatGrade } from "@/core/grades";
import type { EvaluationMode, EvaluationResult, Profile } from "@/core/types";
import { ScoreCard } from "./score-card";
import { numeral } from "@/features/evaluation/numerals";
import { useI18n } from "@/i18n";

export function ResultPanel({
  profile,
  result,
  mode,
  title,
}: {
  profile: Profile;
  result: EvaluationResult;
  mode: EvaluationMode;
  title: string;
}) {
  const { t } = useI18n();
  const pillarTone = (categoryId: string) => {
    const cat = profile.categories.find((c) => c.id === categoryId)!;
    return `var(--${profile.pillars.find((p) => p.id === cat.pillarId)!.tone})`;
  };

  const graded = result.categories.filter((c) => c.grade !== null);
  const best = graded.length ? graded.reduce((a, b) => ((b.grade ?? 0) > (a.grade ?? 0) ? b : a)) : null;
  const worst = graded.length > 1 ? graded.reduce((a, b) => ((b.grade ?? 0) < (a.grade ?? 0) ? b : a)) : null;
  const name = (id: string) => t(`profiles.${profile.id}.categories.${id}.name`);

  return (
    <section aria-labelledby="result-title" className="card p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ScoreCard profile={profile} result={result} mode={mode} title={title} />

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
