"use client";

import Link from "next/link";
import { currentVersion } from "@/changelog/entries";
import { repo } from "@/config";
import { useI18n } from "@/i18n";

const linkClass = "text-soft underline-offset-2 hover:text-ink hover:underline";
const Dot = () => (
  <span aria-hidden className="opacity-50">
    ·
  </span>
);

/** Quiet footer. Small and low contrast on purpose, so the app stays the focus. */
export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="no-print mt-4 border-t border-line pt-6 text-center text-[13px] leading-relaxed text-soft">
      <p className="m-0">{t("ui.footer")}</p>
      <p className="m-0 mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
        <Link href="/changelog" className={linkClass} title={t("ui.changelog")}>
          {t("ui.version", { version: currentVersion })}
        </Link>
        <Dot />
        <Link href="/meaning" className={linkClass}>
          {t("ui.meaning")}
        </Link>
        <Dot />
        <a href={repo.issuesChoose} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {t("ui.contribute")}
        </a>
        <Dot />
        <span>
          {t("ui.madeBy")}{" "}
          <a href={repo.author} target="_blank" rel="noopener noreferrer" className={linkClass}>
            ferupin
          </a>
        </span>
      </p>
    </footer>
  );
}
