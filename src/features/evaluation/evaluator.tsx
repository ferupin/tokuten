"use client";

import { useMemo, useState } from "react";
import { computeResult } from "@/core/scoring";
import { Hanko } from "@/components/brand/hanko";
import { LanguageSwitch } from "@/components/theme/language-switch";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Footer } from "@/components/ui/footer";
import { useI18n } from "@/i18n";
import { ActionsBar } from "@/features/result/actions-bar";
import { EnjoymentCard } from "@/features/result/enjoyment-card";
import { ResultPanel } from "@/features/result/result-panel";
import { CategoryCard } from "./category-card";
import { useEvaluationStore } from "./use-store";

export function Evaluator() {
  const { t } = useI18n();
  const profile = useEvaluationStore((s) => s.profile);
  const evaluation = useEvaluationStore((s) => s.evaluation);
  const setTitle = useEvaluationStore((s) => s.setTitle);
  const setIntroduction = useEvaluationStore((s) => s.setIntroduction);
  const setConclusion = useEvaluationStore((s) => s.setConclusion);
  const result = useMemo(() => computeResult(profile, evaluation), [profile, evaluation]);

  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };
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
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 sm:gap-3">
          <Hanko size={38} title={t("app.kanji")}>点</Hanko>
          <span className="flex-1 min-[430px]:hidden" aria-hidden />
          <div className="hidden min-w-0 flex-1 leading-tight min-[430px]:block">
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
      </header>

      <main id="main" className="mx-auto max-w-5xl space-y-10 px-4 pb-24 pt-10">
        <section>
          <p className="label m-0">{t(`profiles.${profile.id}.name`)}</p>
          <h1 className="mb-2 mt-2 font-display text-[clamp(30px,5.5vw,52px)] font-normal leading-[1.05]">{t("app.tagline")}</h1>
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
              placeholder={t("evaluation.seasonPlaceholder")}
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

        <section aria-labelledby="cats-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="cats-title" className="m-0 font-serif text-2xl font-extrabold">{t("evaluation.sectionTitle")}</h2>
              <p className="tnum m-0 text-sm text-soft">
                {t("evaluation.progress", { graded: result.gradedCount, total: result.applicableCount })}
              </p>
            </div>
            <button
              type="button"
              className="btn ghost no-print"
              onClick={() => setOpenIds(allOpen ? new Set() : new Set(profile.categories.map((c) => c.id)))}
            >
              {allOpen ? t("evaluation.collapseAll") : t("evaluation.expandAll")}
            </button>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={result.applicableCount}
            aria-valuenow={result.gradedCount}
          >
            <div className="h-full bg-accent transition-all" style={{ width: `${result.applicableCount ? (result.gradedCount / result.applicableCount) * 100 : 0}%` }} />
          </div>
          <div className="grid gap-3">
            {profile.categories.map((category, i) => (
              <CategoryCard
                key={category.id}
                index={i}
                profileId={profile.id}
                category={category}
                pillar={profile.pillars.find((p) => p.id === category.pillarId)!}
                result={result.categories[i]}
                store={useEvaluationStore}
                open={openIds.has(category.id)}
                onToggle={() => toggle(category.id)}
              />
            ))}
          </div>
        </section>

        <ResultPanel profile={profile} result={result} />
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

        <ActionsBar result={result} onMessage={notify} />
        <Footer />
      </main>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 font-mono text-xs text-bg transition-all ${toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        {toast}
      </div>
    </>
  );
}
