"use client";

import { formatGrade, gradeBand } from "@/core/grades";
import { readingTier, shapeOf } from "@/core/insights";
import type { EvaluationMode, EvaluationResult, Profile } from "@/core/types";
import { Hanko } from "@/components/brand/hanko";
import { Radar } from "@/components/ui/radar";
import { numeral } from "@/features/evaluation/numerals";
import { useI18n } from "@/i18n";

/**
 * The score side of the result: the season, the official score, its reading and
 * the radar. It stands on its own, with no dependency on the breakdown table,
 * so the same card can later be drawn as an image or on a results page.
 */
export function ScoreCard({
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
  const { shape } = shapeOf(result);
  const pillarTone = (categoryId: string) => {
    const cat = profile.categories.find((c) => c.id === categoryId)!;
    return `var(--${profile.pillars.find((p) => p.id === cat.pillarId)!.tone})`;
  };

  return (
    <div className="text-center">
      <p className="label m-0">{t(`profiles.${profile.id}.name`)}</p>
      <p
        className={`mx-auto mb-0 mt-1.5 line-clamp-3 max-w-md text-balance break-words font-serif text-[clamp(20px,3.4vw,26px)] font-extrabold leading-tight ${
          title.trim() ? "" : "italic text-soft"
        }`}
        title={title.trim() || undefined}
      >
        {title.trim() || t("result.untitled")}
      </p>
      <h2 id="result-title" className="label m-0 mt-5">
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
  );
}
