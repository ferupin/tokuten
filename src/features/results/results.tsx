"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { isBlank } from "@/core/draft";
import { buildCardData } from "@/core/share-card";
import { decodeShare, encodeShare } from "@/core/share-link";
import { DEFAULT_MESSAGE_STYLE, type MessageStyle } from "@/core/share-message";
import { profiles } from "@/profiles";
import { computeResult } from "@/core/scoring";
import { BackToTop } from "@/components/ui/back-to-top";
import { Footer } from "@/components/ui/footer";
import { PageHeader } from "@/components/ui/page-header";
import { CopyButton } from "@/components/ui/copy-button";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { useScrollTop } from "@/components/ui/use-scroll-top";
import { readPreferences, writePreferences } from "@/features/evaluation/persistence";
import { useEvaluationStore } from "@/features/evaluation/use-store";
import { useI18n } from "@/i18n";
import { LAYOUTS, LAYOUT_SIZE, drawCard, loadCardFonts, renderCard, type CardLayout } from "./draw-card";
import type { CardTheme } from "./palette";
import { SocialShare } from "./social-share";

const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "season";

/** A card drawn on a canvas that scales down with its container. */
function CardCanvas({
  layout,
  data,
  theme,
  label,
  thumb,
}: {
  layout: CardLayout;
  data: NonNullable<ReturnType<typeof buildCardData>>;
  theme: CardTheme;
  label?: string;
  /** Fit inside a frame of fixed height instead of taking the full width. */
  thumb?: boolean;
}) {
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
      className={thumb ? "block h-full w-full object-contain" : "block h-auto w-full rounded-md border border-line"}
      style={thumb ? undefined : { aspectRatio: `${width} / ${height}` }}
    />
  );
}

export function Results() {
  const { t } = useI18n();
  const { resolvedTheme } = useTheme();
  const profile = useEvaluationStore((s) => s.profile);
  const evaluation = useEvaluationStore((s) => s.evaluation);
  const load = useEvaluationStore((s) => s.load);
  const router = useRouter();
  const ownResult = useMemo(() => computeResult(profile, evaluation), [profile, evaluation]);
  useScrollTop();

  // A link carries a result in the part of the address after #. It is read after mount, so the
  // static page and the first render agree.
  const [hash, setHash] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    setOrigin(window.location.origin + window.location.pathname);
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const decoded = useMemo(
    () => (hash.length > 1 ? decodeShare(hash, (id) => (Object.hasOwn(profiles, id) ? profiles[id] : undefined)) : null),
    [hash],
  );
  const shared = decoded?.ok ? decoded : null;
  const [confirming, setConfirming] = useState(false);

  const [layout, setLayout] = useState<CardLayout>("seal");
  const [theme, setTheme] = useState<CardTheme | null>(null);
  const [withEnjoyment, setWithEnjoyment] = useState(false);
  // Messages show as the same fading toast the evaluator uses, since the buttons that
  // cause them are spread over the page.
  const [status, setStatus] = useState<{ message: string; leaving: boolean } | null>(null);
  const statusTimers = useRef<number[]>([]);
  const [messageStyle, setMessageStyle] = useState<MessageStyle>(DEFAULT_MESSAGE_STYLE);

  // Layout and card theme are remembered. Personal enjoyment never is: it is off every visit.
  useEffect(() => {
    const prefs = readPreferences();
    if (prefs.cardLayout) setLayout(prefs.cardLayout);
    if (prefs.cardTheme) setTheme(prefs.cardTheme);
    if (prefs.shareStyle) setMessageStyle(prefs.shareStyle);
  }, []);

  // A link from someone else opens on the card they chose. Changing it afterwards is free,
  // and it is not saved as this person's own choice.
  useEffect(() => {
    if (!shared) return;
    if (shared.layout) setLayout(shared.layout);
    if (shared.theme) setTheme(shared.theme);
  }, [shared]);

  const cardTheme: CardTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light");
  const cardProfile = shared?.profile ?? profile;
  const cardResult = shared?.result ?? ownResult;
  const cardTitle = shared ? shared.title : evaluation.title;
  const cardEnjoyment = shared ? shared.enjoyment : evaluation.enjoyment;
  const includeEnjoyment = shared ? shared.enjoyment !== null : withEnjoyment;
  const data = useMemo(
    () => buildCardData(cardProfile, cardResult, { title: cardTitle, enjoyment: cardEnjoyment, includeEnjoyment }, t),
    [cardProfile, cardResult, cardTitle, cardEnjoyment, includeEnjoyment, t],
  );

  const link = useMemo(() => {
    if (shared || !data || !origin) return "";
    return `${origin}#${encodeShare(profile, ownResult, { title: evaluation.title, enjoyment: evaluation.enjoyment, includeEnjoyment: withEnjoyment, layout, theme: cardTheme })}`;
  }, [shared, data, origin, profile, ownResult, evaluation.title, evaluation.enjoyment, withEnjoyment, layout, cardTheme]);

  const say = (message: string) => {
    statusTimers.current.forEach(window.clearTimeout);
    setStatus({ message, leaving: false });
    statusTimers.current = [
      window.setTimeout(() => setStatus({ message, leaving: true }), 2400),
      window.setTimeout(() => setStatus(null), 2400 + 280),
    ];
  };
  useEffect(() => () => statusTimers.current.forEach(window.clearTimeout), []);
  const fileName = `${slug(cardTitle)}.png`;

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
    if (!data) return false;
    try {
      const blob = await renderCard(layout, data, cardTheme);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      say(t("share.imageCopied"));
      return true;
    } catch {
      say(t("share.copyFailed"));
      return false;
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      say(t("share.linkCopied"));
      return true;
    } catch {
      say(t("share.copyFailed"));
      return false;
    }
  };

  const openShared = () => {
    if (!shared) return;
    if (!isBlank(profile, evaluation) && !confirming) {
      setConfirming(true);
      return;
    }
    load(shared.evaluation);
    router.push("/");
  };

  const showOwn = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setHash("");
    setConfirming(false);
  };

  const linkError = decoded && !decoded.ok ? decoded.error : null;
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

        {linkError && (
          <p role="alert" className="card m-0 border-accent p-4 text-sm">
            {t(linkError === "version" ? "share.linkVersion" : linkError === "profile" ? "share.linkProfile" : "share.linkInvalid")}
          </p>
        )}
        {shared && (
          <section aria-label={t("share.sharedTitle")} className="card flex flex-col gap-3 p-5">
            <h2 className="m-0 font-serif text-xl font-extrabold">{t("share.sharedTitle")}</h2>
            <p className="m-0 text-sm text-soft">{t("share.sharedNote")}</p>
            {confirming && (
              <p role="alert" className="m-0 text-sm">
                {t("share.openConfirm")}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="btn" onClick={openShared}>
                {confirming ? t("share.openConfirmYes") : t("share.openInApp")}
              </button>
              {confirming && (
                <button type="button" className="btn ghost" onClick={() => setConfirming(false)}>
                  {t("actions.cancel")}
                </button>
              )}
              <button type="button" className="btn ghost" onClick={showOwn}>
                {t("share.sharedOwn")}
              </button>
            </div>
          </section>
        )}
        {!data ? (
          <p className="card m-0 p-6">{t("share.nothing")}</p>
        ) : (
          <>
            <section
              aria-label={t("share.previewLabel")}
              className="card flex flex-col gap-4 p-5"
              style={{ borderColor: "var(--line-strong)", borderWidth: 1.5, boxShadow: "var(--shadow-lifted)" }}
            >
              <div id="share-layouts" className="label m-0">
                {t("share.layoutLabel")}
              </div>
              <div role="radiogroup" aria-labelledby="share-layouts" className="grid grid-cols-3 gap-2 sm:gap-3">
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
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-colors ${
                      layout === l ? "border-accent bg-surface" : "border-line bg-surface-2 hover:border-line-strong"
                    }`}
                  >
                    <span className="block h-20 w-full sm:h-28">
                      <CardCanvas thumb layout={l} data={data} theme={cardTheme} label={layoutName(l)} />
                    </span>
                    <span className="font-serif text-base font-extrabold">{layoutName(l)}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-line pt-4">
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
                {!shared && evaluation.enjoyment !== null && (
                  <Switch checked={withEnjoyment} onChange={setWithEnjoyment} label={t("share.enjoymentSwitch")} />
                )}
              </div>

              <div className="mx-auto w-full max-w-[720px]">
                <CardCanvas layout={layout} data={data} theme={cardTheme} />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button type="button" className="btn" onClick={download}>
                  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
                  </svg>
                  {t("share.download")}
                </button>
                <CopyButton onCopy={copyImage}>{t("share.copyImage")}</CopyButton>
                {!shared && link && <CopyButton onCopy={copyLink}>{t("share.copyLink")}</CopyButton>}
              </div>
            </section>

            {!shared && link && (
              <SocialShare
                title={data.title}
                score={data.scoreText}
                link={link}
                style={messageStyle}
                onStyle={(style) => {
                  setMessageStyle(style);
                  writePreferences({ shareStyle: style });
                }}
                renderImage={() => renderCard(layout, data, cardTheme)}
                canShareFile={canShareFile}
                fileName={fileName}
                onStatus={say}
              />
            )}

          </>
        )}
        <Footer />
      </main>
      <BackToTop />
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center no-print">
        {status && (
          <span data-leaving={status.leaving} className="toast rounded-full bg-ink px-5 py-2.5 font-mono text-xs text-bg shadow-sm">
            {status.message}
          </span>
        )}
      </div>
    </>
  );
}
