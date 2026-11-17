"use client";

import { formatGrade } from "@/core/grades";
import { computeSensitivity } from "@/core/sensitivity";
import type { EvaluationResult, Profile } from "@/core/types";
import { numeral } from "@/features/evaluation/numerals";
import { useI18n } from "@/i18n";

/**
 * Shows how much each category moves the score, as a section that stays closed
 * until the reader opens it. It describes the weight of the method. It never
 * changes the score and does not say which grade to give.
 */
export function SensitivityPanel({ profile, result }: { profile: Profile; result: EvaluationResult }) {
  const { t } = useI18n();
  const data = computeSensitivity(result);
  if (!data) return null;

  const name = (id: string) => t(`profiles.${profile.id}.categories.${id}.name`);
  const tone = (id: string) => {
    const cat = profile.categories.find((c) => c.id === id)!;
    return `var(--${profile.pillars.find((p) => p.id === cat.pillarId)!.tone})`;
  };
  const index = (id: string) => profile.categories.findIndex((c) => c.id === id);
  const widest = data.rows[0].perPoint;
  const plus = (value: number) => `+${formatGrade(value, 2)}`;
  const notes = [
    !result.complete && t("sensitivity.partialNote", { count: data.rows.length }),
    result.redistributed && t("sensitivity.redistributedNote"),
    data.pending.length > 0 && t("sensitivity.pending", { names: data.pending.map(name).join(", ") }),
  ].filter((note): note is string => Boolean(note));

  return (
    <details className="card group no-print">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[10px] p-5 sm:px-8 sm:py-6 [&::-webkit-details-marker]:hidden">
        <span className="grid gap-1">
          <span className="label">{t("sensitivity.label")}</span>
          <span className="font-display text-xl leading-tight">{t("sensitivity.title")}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 text-xs text-soft">
          <span className="group-open:hidden">{t("sensitivity.show")}</span>
          <span className="hidden group-open:inline">{t("sensitivity.hide")}</span>
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>

      <div className="grid gap-8 border-t border-dashed border-line p-5 sm:px-8 sm:pb-8 sm:pt-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)]">
        <div className="grid content-start gap-4">
          <p className="m-0 text-[13px] text-soft">{t("sensitivity.intro")}</p>
          {data.topShare && (
            <div className="rounded-[10px] border border-line px-4 py-3">
              <span className="label">{t("sensitivity.topTitle")}</span>
              <div className="tnum font-display text-3xl leading-tight">{formatGrade(data.topShare.percent, 0)}%</div>
              <p className="m-0 text-xs text-soft">
                {t("sensitivity.topText", { names: data.topShare.ids.map(name).join(", ") })}
              </p>
            </div>
          )}
          {notes.length > 0 && (
            <ul className="m-0 grid list-none gap-1 p-0 text-xs text-soft">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>

        <ol className="m-0 list-none p-0">
          {data.rows.map((row) => (
            <li
              key={row.id}
              className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-t border-dashed border-line py-2.5 first:border-t-0 sm:grid-cols-[28px_minmax(120px,1.1fr)_3fr_auto] sm:gap-x-4"
            >
              <span className="font-serif font-extrabold" style={{ color: tone(row.id) }} aria-hidden>
                {numeral(index(row.id))}
              </span>
              <span className="text-[13px]">{name(row.id)}</span>
              <span
                aria-hidden
                className="h-2.5 overflow-hidden rounded-full border border-line bg-surface-2 max-sm:order-1 max-sm:col-span-3 sm:h-2.5"
              >
                <i className="block h-full rounded-full" style={{ width: `${(row.perPoint / widest) * 100}%`, background: tone(row.id) }} />
              </span>
              <span className="tnum text-right font-mono text-xs">
                {plus(row.perPoint)}
                <span className="sr-only"> {t("sensitivity.unit")}</span>
                <span className="text-soft"> · {t("sensitivity.upTo", { value: formatGrade(row.up, 2) })}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
