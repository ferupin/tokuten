"use client";

import Link from "next/link";
import { Hanko } from "@/components/brand/hanko";
import { LanguageSwitch } from "@/components/theme/language-switch";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Footer } from "@/components/ui/footer";
import { useI18n } from "@/i18n";
import { planned, releases } from "./entries";

export function Changelog() {
  const { t, locale } = useI18n();
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 text-ink no-underline" aria-label={t("ui.backToApp")}>
            <Hanko size={34}>点</Hanko>
            <span className="font-display text-lg tracking-wide">TOKUTEN</span>
          </Link>
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 pb-20 pt-10">
        <div>
          <Link href="/" className="label text-soft no-underline hover:text-ink">
            ← {t("ui.backToApp")}
          </Link>
          <h1 className="mb-2 mt-4 font-display text-[clamp(28px,5vw,44px)] font-normal leading-tight">{t("changelog.title")}</h1>
          <p className="m-0 max-w-2xl text-soft">{t("changelog.intro")}</p>
        </div>

        {releases.map((release) => (
          <article key={release.version} className="card space-y-5 p-5 sm:p-7" aria-labelledby={`v${release.version}`}>
            <header>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 id={`v${release.version}`} className="tnum m-0 font-display text-3xl font-normal">
                  v{release.version}
                </h2>
                <span className="font-serif text-lg font-extrabold">{release.title[locale]}</span>
              </div>
              <p className="label m-0 mt-1">
                {t("changelog.released", { date: formatDate(release.date) })} · {t("changelog.profileVersion", { version: release.sentaiProfileVersion })}
              </p>
              <p className="mb-0 mt-3 text-[15px]">{release.summary[locale]}</p>
            </header>
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
          </article>
        ))}

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
    </>
  );
}
