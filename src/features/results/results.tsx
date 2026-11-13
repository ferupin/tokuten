"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildCardData } from "@/core/share-card";
import { computeResult } from "@/core/scoring";
import { BackToTop } from "@/components/ui/back-to-top";
import { Footer } from "@/components/ui/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { useScrollTop } from "@/components/ui/use-scroll-top";
import { readPreferences, writePreferences } from "@/features/evaluation/persistence";
import { useEvaluationStore } from "@/features/evaluation/use-store";
import { useI18n } from "@/i18n";
import { LAYOUTS, LAYOUT_SIZE, drawCard, loadCardFonts, renderCard, type CardLayout } from "./draw-card";
import type { CardTheme } from "./palette";

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "season";

/** A card drawn on a canvas that scales down with its container. */
function CardCanvas({ layout, data, theme, label }: { layout: CardLayout; data: NonNullable<ReturnType<typeof buildCardData>>; theme: CardTheme; label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = LAYOUT_SIZE[layout];
  useEffect(() => {
    let live = true;
    loadCardFonts().then(() => {
      const ctx = ref.current?.getContext("2d");
      if (live && ctx) drawCard(ctx, layout, data, theme);
    });
    return () => {
      live = false;
    };
  }, [layout, data, theme]);
  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      role="img"
      aria-label={label ?? data.description}
      className="block h-auto w-full rounded-md border border-line"
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
}

export function Results() {
  const { t } = useI18n();
  const { resolvedTheme } = useTheme();
  const profile = useEvaluationStore((s) => s.profile);
  const evaluation = useEvaluationStore((s) => s.evaluation);
  const result = useMemo(() => computeResult(profile, evaluation), [profile, evaluation]);
  useScrollTop();

  const [layout, setLayout] = useState<CardLayout>("seal");
  const [theme, setTheme] = useState<CardTheme | null>(null);
  const [withEnjoyment, setWithEnjoyment] = useState(false);
  const [status, setStatus] = useState("");

  // Layout and card theme are remembered. Personal enjoyment never is: it is off every visit.
  useEffect(() => {
    const prefs = readPreferences();
    if (prefs.cardLayout) setLayout(prefs.cardLayout);
    if (prefs.cardTheme) setTheme(prefs.cardTheme);
  }, []);

  const cardTheme: CardTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light");
  const data = useMemo(
    () =>
      buildCardData(profile, result, { title: evaluation.title, enjoyment: evaluation.enjoyment, includeEnjoyment: withEnjoyment }, t),
    [profile, result, evaluation.title, evaluation.enjoyment, withEnjoyment, t],
  );

  const say = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 2500);
  };
  const fileName = `${slug(evaluation.title)}.png`;

  const download = async () => {
    if (!data) return;
    try {
      const blob = await renderCard(layout, data, cardTheme);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      say(t("share.downloaded"));
    } catch {
      say(t("share.failed"));
    }
  };

  const copyImage = async () => {
    if (!data) return;
    try {
      const blob = await renderCard(layout, data, cardTheme);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      say(t("share.imageCopied"));
    } catch {
      say(t("share.copyFailed"));
    }
  };

  const [canShareFile, setCanShareFile] = useState(false);
  useEffect(() => {
    try {
      const probe = new File([""], "x.png", { type: "image/png" });
      setCanShareFile(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    } catch {
      setCanShareFile(false);
    }
  }, []);

  const share = async () => {
    if (!data) return;
    try {
      const blob = await renderCard(layout, data, cardTheme);
      await navigator.share({ files: [new File([blob], fileName, { type: "image/png" })], title: data.title, text: data.description });
    } catch (e) {
      // Closing the share sheet is not an error.
      if (!(e instanceof DOMException && e.name === "AbortError")) say(t("share.failed"));
    }
  };

  const copyDescription = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.description);
      say(t("share.descriptionCopied"));
    } catch {
      say(t("share.copyFailed"));
    }
  };

  const layoutName = (l: CardLayout) => t(`share.${l}`);

  return (
    <>
      <PageHeader width="max-w-4xl" />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-20 pt-10">
        <Link href="/" className="label no-underline hover:text-ink">
          ← {t("share.back")}
        </Link>
        <header className="flex flex-col gap-3">
          <h1 className="m-0 font-display text-[clamp(28px,6vw,44px)] leading-tight">
            {t("share.title")} <span lang="ja" className="font-serif text-soft">{t("share.kanji")}</span>
          </h1>
          <p className="m-0 max-w-2xl text-soft">{t("share.intro")}</p>
        </header>

        {!data ? (
          <p className="card m-0 p-6">{t("share.nothing")}</p>
        ) : (
          <>
            <section aria-labelledby="share-layouts" className="flex flex-col gap-3">
              <h2 id="share-layouts" className="label m-0">
                {t("share.layoutLabel")}
              </h2>
              <div role="radiogroup" aria-labelledby="share-layouts" className="grid gap-3 sm:grid-cols-3">
                {LAYOUTS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={layout === l}
                    onClick={() => {
                      setLayout(l);
                      writePreferences({ cardLayout: l });
                    }}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-colors ${
                      layout === l ? "border-accent bg-surface" : "border-line bg-surface-2 hover:border-line-strong"
                    }`}
                  >
                    <CardCanvas layout={l} data={data} theme={cardTheme} label={layoutName(l)} />
                    <span className="font-serif text-lg font-extrabold">{layoutName(l)}</span>
                    <span className="text-xs text-soft">{t(`share.${l}Hint`)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section aria-label={t("share.previewLabel")} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-3">
                  <span className="label">{t("share.themeLabel")}</span>
                  <Segmented
                    label={t("share.themeLabel")}
                    value={cardTheme}
                    options={[
                      { value: "light", label: t("ui.theme.light") },
                      { value: "dark", label: t("ui.theme.dark") },
                    ]}
                    onChange={(v) => {
                      setTheme(v);
                      writePreferences({ cardTheme: v });
                    }}
                  />
                </div>
                {evaluation.enjoyment !== null && (
                  <div className="flex flex-col gap-1">
                    <Switch checked={withEnjoyment} onChange={setWithEnjoyment} label={t("share.enjoymentSwitch")} />
                    <p className="m-0 text-xs text-soft">{t("share.enjoymentHint")}</p>
                  </div>
                )}
              </div>
              <CardCanvas layout={layout} data={data} theme={cardTheme} />
              <p className="m-0 text-xs text-soft">{t("share.privacy")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn" onClick={download}>
                  {t("share.download")}
                </button>
                <button type="button" className="btn ghost" onClick={copyImage}>
                  {t("share.copyImage")}
                </button>
                {canShareFile && (
                  <button type="button" className="btn ghost" onClick={share}>
                    {t("share.shareImage")}
                  </button>
                )}
                <span role="status" aria-live="polite" className="text-xs text-soft">
                  {status}
                </span>
              </div>
            </section>

            <section aria-labelledby="share-description" className="flex flex-col gap-2">
              <h2 id="share-description" className="label m-0">
                {t("share.descriptionTitle")}
              </h2>
              <p className="m-0 text-xs text-soft">{t("share.descriptionHint")}</p>
              <p className="card m-0 p-4 text-sm leading-relaxed">{data.description}</p>
              <div>
                <button type="button" className="btn ghost" onClick={copyDescription}>
                  {t("share.copyDescription")}
                </button>
              </div>
            </section>
          </>
        )}
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
