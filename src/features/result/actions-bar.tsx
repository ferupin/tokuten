"use client";

import { useEffect, useRef, useState } from "react";
import { EXPORT_FORMATS, exportAs, type ExportFormat } from "@/core/export";
import { parseEnvelope, toEnvelope } from "@/core/schema";
import type { EvaluationResult } from "@/core/types";
import { Segmented } from "@/components/ui/segmented";
import { useI18n } from "@/i18n";
import {
  readPreferences,
  writePreferences,
} from "@/features/evaluation/persistence";
import { useEvaluationStore } from "@/features/evaluation/use-store";

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const slug = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "season";

export function ActionsBar({
  result,
  onMessage,
}: {
  result: EvaluationResult;
  onMessage: (m: string) => void;
}) {
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

  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown());
      onMessage(t("actions.copied"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      download(`${slug(evaluation.title)}.md`, markdown(), "text/markdown");
    }
  };

  return (
    <div className="no-print flex flex-col items-center gap-3">
      <div
        role="group"
        aria-label={t("actions.groupMarkdown")}
        className="group-box"
      >
        <span className="label">{t("actions.groupMarkdown")}</span>
        <div className="group-row">
          <Segmented
            label={t("actions.format")}
            value={format}
            options={EXPORT_FORMATS.map((f) => ({
              value: f,
              label: t(
                f === "obsidian"
                  ? "actions.formatObsidian"
                  : "actions.formatStandard",
              ),
            }))}
            onChange={(f) => {
              setFormat(f);
              writePreferences({ format: f });
            }}
          />
          <span className="inline-flex">
            <button
              type="button"
              className="btn !rounded-r-none"
              onClick={copy}
            >
              <Icon name={copied ? "check" : "copy"} />
              {t("actions.copy")}
            </button>
            <button
              type="button"
              className="btn !rounded-l-none !border-l-0 !px-3"
              aria-label={t("actions.downloadMarkdown")}
              title={t("actions.downloadMarkdown")}
              onClick={() =>
                download(
                  `${slug(evaluation.title)}.md`,
                  markdown(),
                  "text/markdown",
                )
              }
            >
              <Icon name="download" />
            </button>
          </span>
        </div>
        <p className="m-0 text-xs text-soft">
          {t(
            format === "obsidian"
              ? "actions.formatHintObsidian"
              : "actions.formatHintStandard",
          )}
        </p>
      </div>

      <div
        role="group"
        aria-label={t("actions.groupFile")}
        className="group-box"
      >
        <span className="label">{t("actions.groupFile")}</span>
        <div className="group-row">
          <button
            type="button"
            className="btn ghost"
            onClick={() =>
              download(
                `${slug(evaluation.title)}.tokuten.json`,
                JSON.stringify(toEnvelope(evaluation), null, 2),
                "application/json",
              )
            }
          >
            <Icon name="download" />
            {t("actions.downloadJson")}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="upload" />
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
            <span
              role="alertdialog"
              aria-label={t("actions.resetConfirm")}
              className="inline-flex flex-wrap items-center gap-2 text-xs text-soft"
            >
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
              <button
                type="button"
                className="btn ghost !py-1"
                onClick={() => setConfirming(false)}
              >
                {t("actions.cancel")}
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="cursor-pointer border-0 bg-transparent p-0 text-xs underline underline-offset-2 hover:opacity-80"
              style={{ color: "var(--bad)" }}
            >
              {t("actions.reset")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ICONS: Record<string, string> = {
  copy: "M9 9h10v10H9zM5 15V5h10",
  check: "m5 12 5 5L20 7",
  download: "M12 4v11m0 0-4-4m4 4 4-4M5 20h14",
  upload: "M12 16V5m0 0-4 4m4-4 4 4M5 20h14",
};

/** Small line icons, drawn with the text color. They always sit next to a label or carry one. */
function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
