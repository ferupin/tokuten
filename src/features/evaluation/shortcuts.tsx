"use client";

import { useEffect, useRef, useState } from "react";
import { SET_GRADE_EVENT } from "@/components/ui/grade-slider";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { applyGradeKey, GRADE_BUFFER_MS } from "@/core/shortcuts";
import { useI18n } from "@/i18n";
import { readPreferences, writePreferences } from "./persistence";
import type { EvaluationStore } from "./store";
import { useEvaluationStoreApi } from "./use-store";

const TEXT_INPUTS = new Set(["", "text", "search", "email", "url", "tel", "password", "number", "date", "time"]);

/** True while the reader is typing, when a letter or digit belongs to the field. */
function isTyping(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  return el instanceof HTMLInputElement && TEXT_INPUTS.has(el.type);
}

const enabledSliders = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLInputElement>('input[type="range"]:not(:disabled)'));

/** Where focus goes for a category: its first slider, else its header button, else the card. */
function focusTarget(article: HTMLElement): HTMLElement {
  return enabledSliders(article)[0] ?? article.querySelector<HTMLElement>("h3 button") ?? article;
}

const SUB_SLIDERS = "[data-subcriteria] input[type=\"range\"]:not(:disabled)";

/** Opens or closes a category card through its own header button, the way a click would. */
function setCardOpen(article: HTMLElement, open: boolean) {
  const button = article.querySelector<HTMLButtonElement>("h3 button[aria-expanded]");
  if (button && button.getAttribute("aria-expanded") !== String(open)) button.click();
}

/** Calls `run` once React has drawn the card that was just opened or closed. */
function afterDraw(run: () => void) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(run));
}

/**
 * Moves through the subcriteria sliders of the Detailed mode, one after the other.
 * The grade of a whole category is a manual choice outside this walk. Entering a
 * category opens its card, and leaving it closes the card, so only one stays open.
 * Categories that are not applicable, or with no subcriterion left, are skipped.
 */
function walkSubcriteria(api: EvaluationStore, direction: 1 | -1, active: Element | null) {
  const store = api.getState();
  const articles = Array.from(document.querySelectorAll<HTMLElement>("[data-category]"));
  const walkable = (article: HTMLElement) => {
    const entry = store.evaluation.categories[article.dataset.category!];
    return Boolean(entry?.applicable) && Object.values(entry.subcriteria).some((sub) => sub.applicable);
  };

  const current = active?.closest<HTMLElement>("[data-category]") ?? null;
  const from = current ? articles.indexOf(current) : direction === 1 ? -1 : articles.length;
  const sliderIn = (article: HTMLElement) => Array.from(article.querySelectorAll<HTMLInputElement>(SUB_SLIDERS));

  // Inside a card that is open, with the focus on one of its subcriteria sliders.
  if (current && active instanceof HTMLInputElement && active.closest("[data-subcriteria]")) {
    const sliders = sliderIn(current);
    const next = sliders[sliders.indexOf(active) + direction];
    if (next) return reveal(next);
  }

  // From a card with the focus elsewhere, "forward" enters that same card.
  const enterSame = current !== null && direction === 1 && !(active instanceof HTMLInputElement && active.closest("[data-subcriteria]"));
  let target = enterSame ? from : from + direction;
  while (target >= 0 && target < articles.length && !walkable(articles[target])) target += direction;
  if (target < 0 || target >= articles.length) return;

  const destination = articles[target];
  if (current && destination !== current) setCardOpen(current, false);
  setCardOpen(destination, true);
  afterDraw(() => {
    const sliders = sliderIn(destination);
    const slider = direction === 1 ? sliders[0] : sliders[sliders.length - 1];
    if (slider) reveal(slider);
  });
}

function reveal(el: HTMLElement) {
  el.focus({ preventScroll: true });
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
}

export interface ShortcutsController {
  enabled: boolean;
  setEnabled: (on: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * Single key shortcuts for grading from the keyboard. They only act on the
 * evaluation page, never while typing and never with a modifier key, and they
 * can be turned off. Grading keys act on the category that holds the focus.
 */
export function useShortcuts(notify: (message: string) => void): ShortcutsController {
  const { t } = useI18n();
  const api = useEvaluationStoreApi();
  const [enabled, setEnabledState] = useState(true);
  const [open, setOpen] = useState(false);
  const typed = useRef({ buffer: "", at: 0 });
  const live = useRef({ t, notify, enabled, open });
  live.current = { t, notify, enabled, open };

  useEffect(() => setEnabledState(readPreferences().shortcuts), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { t, notify, enabled, open } = live.current;
      if (!enabled || open || e.defaultPrevented || e.isComposing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const active = document.activeElement;
      if (isTyping(active) || active?.closest("dialog")) return;
      const key = e.key;

      if (key === "?") {
        e.preventDefault();
        setOpen(true);
        return;
      }

      const articles = Array.from(document.querySelectorAll<HTMLElement>("[data-category]"));
      const current = active?.closest<HTMLElement>("[data-category]") ?? null;

      if (key === "j" || key === "k") {
        if (!articles.length) return;
        e.preventDefault();
        if (api.getState().evaluation.mode === "detailed") {
          walkSubcriteria(api, key === "j" ? 1 : -1, active);
          return;
        }
        const at = current ? articles.indexOf(current) : -1;
        const step = key === "j" ? 1 : -1;
        const next = at === -1 ? 0 : Math.min(articles.length - 1, Math.max(0, at + step));
        reveal(focusTarget(articles[next]));
        return;
      }

      if (!current) return;
      const id = current.dataset.category!;
      const store = api.getState();

      if (key === "n") {
        e.preventDefault();
        const applicable = store.evaluation.categories[id].applicable;
        store.setCategoryApplicable(id, !applicable);
        const name = t(`profiles.${store.profile.id}.categories.${id}.name`);
        notify(t(applicable ? "shortcuts.markedNotApplicable" : "shortcuts.restored", { name }));
        // The slider may appear or vanish with the change, so focus settles on the card once it renders.
        window.requestAnimationFrame(() => {
          const article = document.querySelector<HTMLElement>(`[data-category="${id}"]`);
          if (article) focusTarget(article).focus({ preventScroll: true });
        });
        return;
      }

      const now = Date.now();
      const buffer = now - typed.current.at > GRADE_BUFFER_MS ? "" : typed.current.buffer;
      const result = applyGradeKey(buffer, key);
      if (!result) return;
      // Whole category in Quick mode. In Detailed mode only the slider that holds the focus.
      const slider =
        active instanceof HTMLInputElement && active.type === "range" && !active.disabled
          ? active
          : store.evaluation.mode === "quick"
            ? enabledSliders(current)[0]
            : undefined;
      if (!slider) return;
      e.preventDefault();
      typed.current = { buffer: result.buffer, at: now };
      if (result.grade !== null) slider.dispatchEvent(new CustomEvent(SET_GRADE_EVENT, { detail: result.grade }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api]);

  return {
    enabled,
    setEnabled: (on) => {
      writePreferences({ shortcuts: on });
      setEnabledState(on);
    },
    open,
    setOpen,
  };
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

/** The small button that opens the list. It is hidden on touch screens, where there is no keyboard. */
export function ShortcutsButton({ controller }: { controller: ShortcutsController }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      className="btn ghost shortcuts-button"
      aria-haspopup="dialog"
      onClick={() => controller.setOpen(true)}
    >
      <span aria-hidden className="kbd">?</span>
      {t("shortcuts.open")}
    </button>
  );
}

/** The list of shortcuts, in a modal window. */
export function ShortcutsDialog({ controller }: { controller: ShortcutsController }) {
  const { t } = useI18n();
  const { open, setOpen } = controller;

  const rows: { keys: React.ReactNode; text: string }[] = [
    { keys: <><Kbd>J</Kbd> <Kbd>K</Kbd></>, text: `${t("shortcuts.next")} / ${t("shortcuts.previous")}` },
    { keys: <><Kbd>0</Kbd>–<Kbd>9</Kbd> <Kbd>.</Kbd></>, text: t("shortcuts.grade") },
    { keys: <Kbd>N</Kbd>, text: t("shortcuts.notApplicable") },
    { keys: <Kbd>?</Kbd>, text: t("shortcuts.help") },
    { keys: <Kbd>Esc</Kbd>, text: t("shortcuts.dismiss") },
  ];

  return (
    <Modal open={open} onClose={() => setOpen(false)} labelledBy="shortcuts-title">
      <div className="grid gap-4 p-5 sm:p-6">
        <h2 id="shortcuts-title" className="m-0 font-serif text-xl font-extrabold">
          {t("shortcuts.title")}
        </h2>
        <p className="m-0 text-[13px] text-soft">{t("shortcuts.intro")}</p>
        <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2.5 text-[13px]">
          {rows.map((row, i) => (
            <div key={i} className="contents">
              <dt className="whitespace-nowrap">{row.keys}</dt>
              <dd className="m-0">{row.text}</dd>
            </div>
          ))}
        </dl>
        <p className="m-0 text-xs text-soft">{t("shortcuts.detailedWalk")}</p>
        <p className="m-0 text-xs text-soft">{t("shortcuts.sliderKeys")}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <Switch checked={controller.enabled} onChange={controller.setEnabled} label={t("shortcuts.enable")} />
          <button type="button" className="btn" onClick={() => setOpen(false)}>
            {t("shortcuts.close")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
