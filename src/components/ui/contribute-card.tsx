"use client";

import { repo } from "@/config";
import { useI18n } from "@/i18n";

/** Invitation to report bugs and help build the project. Links go to GitHub. */
export function ContributeCard() {
  const { t } = useI18n();
  const link = "btn ghost no-underline";
  return (
    <section aria-labelledby="contribute-title" className="card border-dashed p-5 sm:p-7">
      <h2 id="contribute-title" className="m-0 font-serif text-xl font-extrabold">
        {t("contribute.title")}
      </h2>
      <p className="mb-4 mt-2 max-w-2xl text-[14px] text-soft">{t("contribute.text")}</p>
      <div className="flex flex-wrap gap-3">
        <a className={link} href={repo.bug} target="_blank" rel="noopener noreferrer">
          {t("contribute.bug")}
        </a>
        <a className={link} href={repo.idea} target="_blank" rel="noopener noreferrer">
          {t("contribute.idea")}
        </a>
        <a className={link} href={repo.guide} target="_blank" rel="noopener noreferrer">
          {t("contribute.guide")}
        </a>
      </div>
    </section>
  );
}
