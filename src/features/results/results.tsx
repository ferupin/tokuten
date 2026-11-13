"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { isBlank } from "@/core/draft";
import { buildCardData } from "@/core/share-card";
import { decodeShare, encodeShare } from "@/core/share-link";
import { profiles } from "@/profiles";
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
  const [status, setStatus] = useState("");

  // Layout and card theme are remembered. Personal enjoyment never is: it is off every visit.
  useEffect(() => {
    const prefs = readPreferences();
    if (prefs.cardLayout) setLayout(prefs.cardLayout);
    if (prefs.cardTheme) setTheme(prefs.cardTheme);
  }, []);

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
    return `${origin}#${encodeShare(profile, ownResult, { title: evaluation.title, enjoyment: evaluation.enjoyment, includeEnjoyment: withEnjoyment })}`;
  }, [shared, data, origin, profile, ownResult, evaluation.title, evaluation.enjoyment, withEnjoyment]);

  const say = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 2500);
  };
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      say(t("share.linkCopied"));
    } catch {
      say(t("share.copyFailed"));
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
            <section aria-labelledby="share-layouts" className="flex flex-col gap-3">
              <h2 id="share-layouts" className="label m-0">
                {t("share.layoutLabel")}
              </h2>
              <div role="radiogroup" aria-labelledby="share-layouts" className="grid items-start gap-3 sm:grid-cols-3">
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
                {!shared && evaluation.enjoyment !== null && (
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

            {!shared && link && (
              <section aria-labelledby="share-link" className="flex flex-col gap-2">
                <h2 id="share-link" className="label m-0">
                  {t("share.linkTitle")}
                </h2>
                <p className="m-0 text-sm text-soft">{t("share.linkHint")}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    readOnly
                    value={link}
                    aria-label={t("share.linkLabel")}
                    onFocus={(e) => e.currentTarget.select()}
                    className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-ink"
                  />
                  <button type="button" className="btn ghost" onClick={copyLink}>
                    {t("share.copyLink")}
                  </button>
                </div>
                <p className="m-0 text-xs text-soft">{t("share.linkPrivacy")}</p>
              </section>
            )}

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
