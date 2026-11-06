"use client";

import Link from "next/link";
import { currentVersion } from "@/changelog/entries";
import { useI18n } from "@/i18n";

/** Quiet footer. Small and low contrast on purpose, so the app stays the focus. */
export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="no-print mt-4 border-t border-line pt-5 text-center text-[11px] leading-relaxed text-soft">
      <p className="m-0">{t("ui.footer")}</p>
      <p className="m-0 mt-1.5">
        <Link href="/changelog" className="text-soft underline-offset-2 hover:text-ink hover:underline" title={t("ui.changelog")}>
          {t("ui.version", { version: currentVersion })}
        </Link>
        <span aria-hidden className="mx-2 opacity-50">
          ·
        </span>
        {t("ui.madeBy")}{" "}
        <a
          href="https://github.com/ferupin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-soft underline-offset-2 hover:text-ink hover:underline"
        >
          ferupin
        </a>
      </p>
    </footer>
  );
}
