"use client";

import { useEffect, useRef, useState } from "react";
import { EXPORT_FORMATS, exportAs, type ExportFormat } from "@/core/export";
import { parseEnvelope, toEnvelope } from "@/core/schema";
import type { EvaluationResult } from "@/core/types";
import { useI18n } from "@/i18n";
import { readPreferences, writePreferences } from "@/features/evaluation/persistence";
import { useEvaluationStore } from "@/features/evaluation/use-store";

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "season";

export function ActionsBar({ result, onMessage }: { result: EvaluationResult; onMessage: (m: string) => void }) {
  const { t } = useI18n();
  const profile = useEvaluationStore((s) => s.profile);
  const evaluation = useEvaluationStore((s) => s.evaluation);
  const load = useEvaluationStore((s) => s.load);
  const reset = useEvaluationStore((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("standard");

  // The chosen format is remembered between visits.
  useEffect(() => {
    const saved = readPreferences().format;
    if (saved) setFormat(saved);
  }, []);

  const markdown = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return exportAs(format, profile, evaluation, result, t, { date });
  };

  return (
    <div className="no-print flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <div role="radiogroup" aria-label={t("actions.format")} className="inline-flex items-center gap-2">
          <span className="label">{t("actions.format")}</span>
          {EXPORT_FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={format === f}
              className={`btn !py-1 ${format === f ? "" : "ghost"}`}
              onClick={() => {
                setFormat(f);
                writePreferences({ format: f });
              }}
            >
              {t(f === "obsidian" ? "actions.formatObsidian" : "actions.formatStandard")}
            </button>
          ))}
        </div>
        <p className="m-0 text-xs text-soft">
          {t(format === "obsidian" ? "actions.formatHintObsidian" : "actions.formatHintStandard")}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        className="btn"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(markdown());
            onMessage(t("actions.copied"));
          } catch {
            download(`${slug(evaluation.title)}.md`, markdown(), "text/markdown");
          }
        }}
      >
        {t("actions.copyMarkdown")}
      </button>
      <button type="button" className="btn ghost" onClick={() => download(`${slug(evaluation.title)}.md`, markdown(), "text/markdown")}>
        {t("actions.downloadMarkdown")}
      </button>
      <button type="button" className="btn ghost" onClick={() => download(`${slug(evaluation.title)}.tokuten.json`, JSON.stringify(toEnvelope(evaluation), null, 2), "application/json")}>
        {t("actions.downloadJson")}
      </button>
      <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
        {t("actions.importJson")}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const parsed = parseEnvelope(await file.text(), profile);
          if (parsed.ok) {
            load(parsed.evaluation);
            onMessage(t("actions.imported"));
          } else {
            onMessage(t(`actions.importError.${parsed.error}`));
          }
        }}
      />
      {confirming ? (
        <span role="alertdialog" aria-label={t("actions.resetConfirm")} className="inline-flex flex-wrap items-center gap-2 text-xs text-soft">
          {t("actions.resetConfirm")}
          <button
            type="button"
            className="btn danger !py-1"
            onClick={() => {
              reset();
              setConfirming(false);
              onMessage(t("actions.cleared"));
            }}
          >
            {t("actions.confirm")}
          </button>
          <button type="button" className="btn ghost !py-1" onClick={() => setConfirming(false)}>
            {t("actions.cancel")}
          </button>
        </span>
      ) : (
        <button type="button" className="btn danger" onClick={() => setConfirming(true)}>
          {t("actions.reset")}
        </button>
      )}
      </div>
    </div>
  );
}
