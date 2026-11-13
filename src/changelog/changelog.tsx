"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackToTop } from "@/components/ui/back-to-top";
import { Footer } from "@/components/ui/footer";
import { PageHeader } from "@/components/ui/page-header";
import { useScrollTop } from "@/components/ui/use-scroll-top";
import { useI18n } from "@/i18n";
import { planned, releases } from "./entries";

export function Changelog() {
  const { t, locale } = useI18n();

  useScrollTop();

  // Only the newest release starts open, so the page is easy to scan.
  const [open, setOpen] = useState<Set<string>>(() => new Set(releases.slice(0, 1).map((r) => r.version)));
  const allOpen = open.size === releases.length;

  const toggle = (version: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version);
      else next.add(version);
      return next;
    });

  // A link such as /changelog#v0.5.0 opens that release and brings it into view,
  // whether it is followed from another page or from this one.
  useEffect(() => {
    let timer: number | undefined;
    const reveal = () => {
      const match = window.location.hash.match(/^#v(\d+\.\d+\.\d+)$/);
      if (!match || !releases.some((r) => r.version === match[1])) return;
      setOpen((prev) => new Set(prev).add(match[1]));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => document.getElementById(`v${match[1]}`)?.scrollIntoView({ block: "start" }), 60);
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => {
      window.removeEventListener("hashchange", reveal);
      window.clearTimeout(timer);
    };
  }, []);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

  return (
    <>
      <PageHeader />

      <main className="mx-auto max-w-3xl space-y-10 px-4 pb-20 pt-10">
        <div>
          <Link href="/" className="label text-soft no-underline hover:text-ink">
            ← {t("ui.backToApp")}
          </Link>
          <h1 className="mb-2 mt-4 font-display text-[clamp(28px,5vw,44px)] font-normal leading-tight">{t("changelog.title")}</h1>
          <p className="m-0 max-w-2xl text-soft">{t("changelog.intro")}</p>
        </div>

        <div className="flex justify-end">
          <button type="button" className="btn ghost !py-1 !text-xs" onClick={() => setOpen(allOpen ? new Set() : new Set(releases.map((r) => r.version)))}>
            {allOpen ? t("changelog.collapseAll") : t("changelog.expandAll")}
          </button>
        </div>

        {releases.map((release) => {
          const isOpen = open.has(release.version);
          const detailsId = `details-${release.version}`;
          return (
            <article key={release.version} className="card scroll-mt-24 p-5 sm:p-7" aria-labelledby={`v${release.version}`}>
              <header>
                <h2 className="m-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    onClick={() => toggle(release.version)}
                    className="flex w-full cursor-pointer items-baseline gap-x-3 gap-y-1 border-0 bg-transparent p-0 text-left text-ink"
                  >
                    <span id={`v${release.version}`} className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="tnum font-display text-3xl font-normal">v{release.version}</span>
                      <span className="font-serif text-lg font-extrabold">{release.title[locale]}</span>
                    </span>
                    <svg
                      aria-hidden
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="shrink-0 self-center text-soft transition-transform"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    >
                      <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </h2>
                <p className="label m-0 mt-1">
                  {t("changelog.released", { date: formatDate(release.date) })} · {t("changelog.profileVersion", { version: release.sentaiProfileVersion })}
                </p>
                <p className="mb-0 mt-3 text-[15px]">{release.summary[locale]}</p>
              </header>
              <div id={detailsId} hidden={!isOpen} className="mt-5 flex flex-col gap-5">
                {release.groups.map((group) => (
                  <section key={group.area}>
                    <h3 className="label mb-2 mt-0">{t(`changelog.areas.${group.area}`)}</h3>
                    <ul className="m-0 space-y-2 pl-5 text-[14px] marker:text-accent">
                      {group.items.map((item, i) => (
                        <li key={i}>{item[locale]}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          );
        })}

        <section className="card border-dashed p-5 sm:p-7" aria-labelledby="planned">
          <h2 id="planned" className="m-0 font-serif text-xl font-extrabold">
            {t("changelog.planned")}
          </h2>
          <p className="mb-3 mt-1 text-[13px] text-soft">{t("changelog.plannedHint")}</p>
          <ul className="m-0 space-y-2 pl-5 text-[14px] marker:text-soft">
            {planned.map((item, i) => (
              <li key={i}>{item[locale]}</li>
            ))}
          </ul>
        </section>

        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
