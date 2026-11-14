"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { isBlank } from "@/core/draft";
import { applyAnchor, captureAnchor, type ScrollAnchor } from "@/components/ui/scroll-anchor";
import { Switch } from "@/components/ui/switch";
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

  // Read preferences and any stored draft once, after mount. When the page is
  // opened again by navigating inside the app, the work is still in memory and
  // already matches the draft, so there is nothing to offer back.
  useEffect(() => {
    const prefs = readPreferences();
    setEnabledState(prefs.draft);
    const inMemory = !isBlank(profile, useEvaluationStore.getState().evaluation);
    const found = prefs.draft && !inMemory ? readDraft(profile) : { ok: false as const };
    if (found.ok && !isBlank(profile, found.evaluation)) {
      setPending({ evaluation: found.evaluation, savedAt: found.savedAt });
    } else if (!inMemory && prefs.mode) {
      setMode(prefs.mode);
    }
    setReady(true);
  }, [profile, setMode]);

  const active = ready && !pending;

  // Answering the prompt changes the height of the page: the strip leaves and the result fills in.
  // The reader keeps their place instead of being carried to another part of the page.
  const anchor = useRef<ScrollAnchor | null>(null);
  useLayoutEffect(() => {
    if (pending || !anchor.current) return;
    const kept = anchor.current;
    anchor.current = null;
    applyAnchor(kept);
    // Once more after the next frame, for anything that settles late.
    window.requestAnimationFrame(() => applyAnchor(kept));
  }, [pending]);

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
      anchor.current = captureAnchor();
      load(pending.evaluation);
      setPending(null);
    },
    discard: () => {
      anchor.current = captureAnchor();
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

/**
 * Offers a stored draft back. It is a slim strip that rides under the header,
 * so it stays in view while scrolling, never covers the content and does not
 * compete with the back to top button. It stays until you choose.
 */
export function DraftBanner({ draft }: { draft: DraftController }) {
  const { t, locale } = useI18n();
  if (!draft.pending) return null;
  const when = formatWhen(draft.pending.savedAt, locale, true);
  return (
    <div
      role="region"
      aria-label={t("draft.foundTitle")}
      className="border-t"
      style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-x-4 gap-y-2 px-4 py-2">
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
        <p className="m-0 min-w-0 flex-1 text-[13px] leading-snug">
          <strong>{t("draft.foundTitle")}.</strong>{" "}
          <span className="hidden text-soft sm:inline">{t("draft.foundText", { when })}</span>
          <span className="block text-soft sm:hidden">{t("draft.foundWhen", { when })}</span>
        </p>
        <div className="flex shrink-0 flex-col gap-1.5 min-[480px]:flex-row min-[480px]:gap-2">
          <button type="button" className="btn !py-1 !text-xs" onClick={draft.restore}>
            {t("draft.restore")}
          </button>
          <button type="button" className="btn ghost !py-1 !text-xs" onClick={draft.discard}>
            {t("draft.discard")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Where the work is kept: one switch, one line of status, and a quiet way to delete. */
export function DraftStatus({ draft }: { draft: DraftController }) {
  const { t, locale } = useI18n();
  const status = draft.failed
    ? t("draft.failed")
    : !draft.enabled
      ? t("draft.hintOff")
      : draft.savedAt
        ? `${t("draft.savedAt", { time: formatWhen(draft.savedAt, locale, false) })}. ${t("draft.hintOn")}`
        : t("draft.hintOn");
  return (
    <div className="no-print flex flex-col items-center gap-1 text-center" data-testid="draft-status">
      <Switch checked={draft.enabled} onChange={draft.setEnabled} label={t("draft.switchLabel")} />
      <p className="m-0 max-w-xl text-xs text-soft" role="status">
        {status}
        {draft.enabled && draft.savedAt && (
          <>
            {" "}
            <button
              type="button"
              onClick={draft.remove}
              className="cursor-pointer border-0 bg-transparent p-0 text-xs text-soft underline underline-offset-2 hover:text-ink"
            >
              {t("draft.delete")}
            </button>
          </>
        )}
      </p>
    </div>
  );
}
