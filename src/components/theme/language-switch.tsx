"use client";

import { LOCALES, localeLabels, useI18n, type Locale } from "@/i18n";

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="inline-flex items-center gap-2 text-xs text-soft">
      <span className="sr-only">{t("ui.language.label")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {localeLabels[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
