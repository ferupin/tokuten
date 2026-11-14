"use client";

import { useI18n } from "@/i18n";

/** The grades that have a reference point, in order. */
export const ANCHOR_GRADES = [
  { grade: 3, key: "three" },
  { grade: 5, key: "five" },
  { grade: 7, key: "seven" },
  { grade: 9, key: "nine" },
] as const;

/**
 * Reference points for one category: what a 3, a 5, a 7 and a 9 look like.
 * Help for the person grading. They never change the score.
 */
export function Anchors({ base }: { base: string }) {
  const { t } = useI18n();
  return (
    <details className="group rounded-lg border border-line bg-surface-2 px-3 py-2">
      <summary className="label cursor-pointer select-none">{t("evaluation.anchorsTitle")}</summary>
      <p className="m-0 mt-2 text-xs text-soft">{t("evaluation.anchorsHint")}</p>
      <ul className="m-0 mt-2 list-none space-y-2 p-0 text-[13px]">
        {ANCHOR_GRADES.map(({ grade, key }) => (
          <li key={key} className="flex gap-3">
            <span className="w-6 shrink-0 text-right font-mono font-bold">{grade}</span>
            <span className="text-soft">{t(`${base}.anchors.${key}`)}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
