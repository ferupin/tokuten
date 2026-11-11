"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isBlank } from "@/core/draft";
import type { Evaluation } from "@/core/types";
import { useI18n } from "@/i18n";
import { clearDraft, readDraft, readPreferences, writeDraft, writePreferences } from "./persistence";
import { useEvaluationStore } from "./use-store";

const SAVE_DELAY = 500;

export interface DraftController {
  enabled: boolean;
  pending: { evaluation: Evaluation; savedAt: string } | null;
  savedAt: string | null;
  failed: boolean;
  restore: () => void;
  discard: () => void;
  remove: () => void;
  setEnabled: (on: boolean) => void;
}

/**
 * Keeps a draft of the evaluation in this browser, and remembers the grading
 * mode. The draft never leaves the device. A stored draft is offered back with
 * a prompt instead of replacing what is on screen, and nothing is written until
 * that choice is made, so the offer cannot be overwritten by a blank page.
 */
export function useDraft(): DraftController {
  const profile = useEvaluationStore((s) => s.profile);
  const evaluation = useEvaluationStore((s) => s.evaluation);
  const load = useEvaluationStore((s) => s.load);
  const setMode = useEvaluationStore((s) => s.setMode);

  const [ready, setReady] = useState(false);
  const [enabled, setEnabledState] = useState(true);
  const [pending, setPending] = useState<DraftController["pending"]>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Read preferences and any stored draft once, after mount.
  useEffect(() => {
    const prefs = readPreferences();
    setEnabledState(prefs.draft);
    const found = prefs.draft ? readDraft(profile) : { ok: false as const };
    if (found.ok && !isBlank(profile, found.evaluation)) {
      setPending({ evaluation: found.evaluation, savedAt: found.savedAt });
    } else if (prefs.mode) {
      setMode(prefs.mode);
    }
    setReady(true);
  }, [profile, setMode]);

  const active = ready && !pending;

  useEffect(() => {
    if (active) writePreferences({ mode: evaluation.mode });
  }, [active, evaluation.mode]);

  const latest = useRef(evaluation);
  latest.current = evaluation;

  const save = useCallback(() => {
    const current = latest.current;
    if (isBlank(profile, current)) {
      clearDraft();
      setSavedAt(null);
      setFailed(false);
      return;
    }
    const ok = writeDraft(current);
    setFailed(!ok);
    setSavedAt(ok ? new Date().toISOString() : null);
  }, [profile]);

  useEffect(() => {
    if (!active || !enabled) return;
    const timer = window.setTimeout(save, SAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [active, enabled, evaluation, save]);

  // Write at once when the page is hidden or closed, instead of waiting for the delay.
  useEffect(() => {
    if (!active || !enabled) return;
    const flush = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", save);
    };
  }, [active, enabled, save]);

  // Without a draft, ask before leaving a page that holds work.
  const unsafe = active && (!enabled || failed) && !isBlank(profile, evaluation);
  useEffect(() => {
    if (!unsafe) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsafe]);

  return {
    enabled,
    pending,
    savedAt,
    failed,
    restore: () => {
      if (!pending) return;
      load(pending.evaluation);
      setPending(null);
    },
    discard: () => {
      clearDraft();
      setPending(null);
      const mode = readPreferences().mode;
      if (mode) setMode(mode);
    },
    remove: () => {
      clearDraft();
      setSavedAt(null);
    },
    setEnabled: (on) => {
      writePreferences({ draft: on });
      setEnabledState(on);
      setFailed(false);
      if (!on) {
        clearDraft();
        setSavedAt(null);
      }
    },
  };
}

function formatWhen(iso: string, locale: string, withDate: boolean) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return withDate
    ? d.toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })
    : d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

/** Offers a stored draft back, right under the header. */
export function DraftBanner({ draft }: { draft: DraftController }) {
  const { t, locale } = useI18n();
  if (!draft.pending) return null;
  const when = formatWhen(draft.pending.savedAt, locale, true);
  return (
    <section role="region" aria-label={t("draft.foundTitle")} className="card no-print flex flex-wrap items-center justify-between gap-3 p-4" style={{ borderColor: "var(--accent)" }}>
      <div className="min-w-0 flex-1">
        <p className="m-0 font-bold">{t("draft.foundTitle")}</p>
        <p className="m-0 text-[13px] text-soft">{t("draft.foundText", { when })}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={draft.restore}>
          {t("draft.restore")}
        </button>
        <button type="button" className="btn ghost" onClick={draft.discard}>
          {t("draft.discard")}
        </button>
      </div>
    </section>
  );
}

/** One quiet line that says where the work is kept, with the controls. */
export function DraftStatus({ draft }: { draft: DraftController }) {
  const { t, locale } = useI18n();
  const text = draft.failed
    ? t("draft.failed")
    : !draft.enabled
      ? t("draft.off")
      : draft.savedAt
        ? t("draft.saved", { time: formatWhen(draft.savedAt, locale, false) })
        : t("draft.on");
  return (
    <div className="no-print flex flex-col items-center gap-2 text-center" data-testid="draft-status">
      <p className="m-0 max-w-xl text-xs text-soft" role="status">
        {text}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {draft.enabled && draft.savedAt && (
          <button type="button" className="btn ghost !py-1 !text-xs" onClick={draft.remove}>
            {t("draft.delete")}
          </button>
        )}
        <button type="button" className="btn ghost !py-1 !text-xs" onClick={() => draft.setEnabled(!draft.enabled)}>
          {draft.enabled ? t("draft.turnOff") : t("draft.turnOn")}
        </button>
      </div>
    </div>
  );
}
