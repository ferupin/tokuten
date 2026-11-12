"use client";

import { useId, useState } from "react";
import { useI18n } from "@/i18n";
import { useEvaluationStore } from "@/features/evaluation/use-store";

/**
 * The consistency checklist of the method. It is a reminder for the author.
 * Nothing here is read by the scoring code, and nothing blocks the export.
 */
export function ChecklistCard() {
  const { t } = useI18n();
  const profile = useEvaluationStore((s) => s.profile);
  const checked = useEvaluationStore((s) => s.evaluation.checked);
  const setChecked = useEvaluationStore((s) => s.setChecked);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const p = `profiles.${profile.id}.checklist`;
  const total = profile.checklist.length;

  return (
    <section aria-labelledby={`${panelId}-title`} className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id={`${panelId}-title`} className="m-0 text-[15px] font-bold">
            {t("checklist.title")}
          </h2>
          <p className="m-0 mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-soft" aria-live="polite">
            {t("checklist.progress", { done: checked.length, total })}
          </p>
        </div>
        <button
          type="button"
          className="btn ghost !py-1 text-xs"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t("checklist.close") : t("checklist.open")}
        </button>
      </div>

      <div id={panelId} hidden={!open} className="mt-4">
        <p className="mb-3 mt-0 max-w-xl text-[13px] text-soft">{t("checklist.description")}</p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {profile.checklist.map((id) => {
            const on = checked.includes(id);
            return (
              <li key={id}>
                <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug">
                  <input
                    type="checkbox"
                    className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer"
                    style={{ accentColor: "var(--accent)" }}
                    checked={on}
                    onChange={(e) => setChecked(id, e.target.checked)}
                  />
                  <span>{t(`${p}.${id}`)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
