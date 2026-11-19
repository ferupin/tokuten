"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { computeResult } from "@/core/scoring";
import { Hanko } from "@/components/brand/hanko";
import { LanguageSwitch } from "@/components/theme/language-switch";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BackToTop } from "@/components/ui/back-to-top";
import { Footer } from "@/components/ui/footer";
import { useScrollTop } from "@/components/ui/use-scroll-top";
import { useI18n } from "@/i18n";
import { ActionsBar } from "@/features/result/actions-bar";
import { ChecklistCard } from "@/features/result/checklist-card";
import { EnjoymentCard } from "@/features/result/enjoyment-card";
import { ResultPanel } from "@/features/result/result-panel";
import { CategoryCard } from "./category-card";
import { ModeSwitch } from "./mode-switch";
import { DraftBanner, DraftSavedChip, DraftStatus, useDraft } from "./draft";
import { QuickRow } from "./quick-row";
import { ShortcutsButton, ShortcutsDialog, useShortcuts } from "./shortcuts";
import { ProfileSwitch } from "./profile-switch";
import { ProfileProvider, useEvaluationStore } from "./use-store";

/** The evaluation page of one profile. Each profile has its own store and its own draft. */
export function Evaluator({ profileId }: { profileId: string }) {
  return (
    <ProfileProvider profileId={profileId}>
      <EvaluatorView />
    </ProfileProvider>
  );
}

function EvaluatorView() {
  const { t } = useI18n();
  useScrollTop();
  const profile = useEvaluationStore((s) => s.profile);
  const evaluation = useEvaluationStore((s) => s.evaluation);
  const setMode = useEvaluationStore((s) => s.setMode);
  const setTitle = useEvaluationStore((s) => s.setTitle);
  const setIntroduction = useEvaluationStore((s) => s.setIntroduction);
  const setConclusion = useEvaluationStore((s) => s.setConclusion);
  const draft = useDraft();
  const result = useMemo(() => computeResult(profile, evaluation), [profile, evaluation]);

  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  // The toast fades in and out like the draft check. The message stays in place while it fades
  // out, and a new message restarts the timers so two of them never fight.
  const [toast, setToast] = useState<{ message: string; leaving: boolean } | null>(null);
  const toastTimers = useRef<number[]>([]);
  const notify = (message: string) => {
    toastTimers.current.forEach(window.clearTimeout);
    setToast({ message, leaving: false });
    toastTimers.current = [
      window.setTimeout(() => setToast({ message, leaving: true }), 2400),
      window.setTimeout(() => setToast(null), 2400 + 280),
    ];
  };
  useEffect(() => () => toastTimers.current.forEach(window.clearTimeout), []);
  const shortcuts = useShortcuts(notify);
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const allOpen = openIds.size === profile.categories.length;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-bg">
        {t("ui.skipToContent")}
      </a>

      <header className="no-print sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3 sm:gap-x-3">
          <Hanko size={40} title={t("app.kanji")} className="mt-[3px] self-start">点</Hanko>
          <span className="flex-1 min-[430px]:hidden" aria-hidden />
          <div className="relative -top-[2px] hidden min-w-0 flex-1 leading-tight min-[430px]:block">
            <p className="m-0 font-display text-lg tracking-wide">TOKUTEN</p>
            <p className="label m-0 truncate">
              {t("app.kanji")} · {t("app.method")} {t("app.methodKanji")}
            </p>
          </div>
          <div className="tnum hidden text-right sm:block">
            <span className="label block">{t("result.officialScore")}</span>
            <span className="font-display text-xl">{result.score === null ? "—" : result.score.toFixed(1)}</span>
          </div>
          <LanguageSwitch />
          <ThemeToggle />
        </div>
        <DraftBanner draft={draft} />
        <DraftSavedChip draft={draft} />
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl space-y-10 px-4 pb-24 pt-10 outline-none">
        <section>
          <ProfileSwitch current={profile.id} />
          <h1 className="mb-2 mt-4 font-display text-[clamp(30px,5.5vw,52px)] font-normal leading-[1.05]">{t("app.tagline")}</h1>
          <p className="m-0 max-w-2xl text-soft">{t("app.description")}</p>
        </section>

        <section className="card grid gap-4 p-5 sm:p-6">
          <div>
            <label htmlFor="season" className="label mb-1.5 block">{t("evaluation.seasonLabel")}</label>
            <input
              id="season"
              className="field !text-xl font-bold"
              autoComplete="off"
              spellCheck={false}
              placeholder={t(`profiles.${profile.id}.example`)}
              value={evaluation.title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="intro" className="label mb-1.5 block">{t("evaluation.introductionLabel")}</label>
            <textarea
              id="intro"
              className="field min-h-[72px] resize-y"
              placeholder={t("evaluation.introductionPlaceholder")}
              value={evaluation.introduction}
              onChange={(e) => setIntroduction(e.target.value)}
            />
          </div>
        </section>

        <section aria-labelledby="cats-title" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="cats-title" className="m-0 font-serif text-2xl font-extrabold">{t("evaluation.sectionTitle")}</h2>
              <p className="tnum m-0 text-sm text-soft">
                {t("evaluation.progress", { graded: result.gradedCount, total: result.applicableCount })}
              </p>
            </div>
            <div className="no-print flex flex-wrap items-center gap-3">
              <ModeSwitch mode={evaluation.mode} onChange={setMode} />
              <ShortcutsButton controller={shortcuts} />
              {evaluation.mode === "detailed" && (
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setOpenIds(allOpen ? new Set() : new Set(profile.categories.map((c) => c.id)))}
                >
                  {allOpen ? t("evaluation.collapseAll") : t("evaluation.expandAll")}
                </button>
              )}
            </div>
          </div>
          <p className="m-0 max-w-2xl text-[13px] text-soft">
            {t(`modes.${evaluation.mode}.hint`)} {t("modes.keepNote")}
          </p>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-label={t("evaluation.progress", { graded: result.gradedCount, total: result.applicableCount })}
            aria-valuemin={0}
            aria-valuemax={result.applicableCount}
            aria-valuenow={result.gradedCount}
          >
            <div className="h-full bg-accent transition-all" style={{ width: `${result.applicableCount ? (result.gradedCount / result.applicableCount) * 100 : 0}%` }} />
          </div>
          <div className="grid gap-3">
            {profile.categories.map((category, i) => {
              const pillar = profile.pillars.find((p) => p.id === category.pillarId)!;
              return evaluation.mode === "quick" ? (
                <QuickRow
                  key={category.id}
                  index={i}
                  profileId={profile.id}
                  category={category}
                  pillar={pillar}
                  result={result.categories[i]}
                />
              ) : (
                <CategoryCard
                  key={category.id}
                  index={i}
                  profileId={profile.id}
                  category={category}
                  pillar={pillar}
                  result={result.categories[i]}
                  open={openIds.has(category.id)}
                  onToggle={() => toggle(category.id)}
                />
              );
            })}
          </div>
        </section>

        <ResultPanel profile={profile} result={result} mode={evaluation.mode} title={evaluation.title} />
        <EnjoymentCard />

        <section className="card grid gap-2 p-5 sm:p-6">
          <label htmlFor="conclusion" className="label">{t("evaluation.conclusionLabel")}</label>
          <textarea
            id="conclusion"
            className="field min-h-[96px] resize-y"
            placeholder={t("evaluation.conclusionPlaceholder")}
            value={evaluation.conclusion}
            onChange={(e) => setConclusion(e.target.value)}
          />
        </section>

        <ChecklistCard />

        <ActionsBar result={result} onMessage={notify} />
        <DraftStatus draft={draft} />
        <Footer />
      </main>

      <ShortcutsDialog controller={shortcuts} />
      <BackToTop />

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center no-print">
        {toast && (
          <span
            data-leaving={toast.leaving}
            className="toast rounded-full bg-ink px-5 py-2.5 font-mono text-xs text-bg shadow-sm"
          >
            {toast.message}
          </span>
        )}
      </div>
    </>
  );
}
