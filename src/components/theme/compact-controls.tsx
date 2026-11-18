"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LOCALES, languages, useI18n, type Locale } from "@/i18n";

const ICONS = {
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
  system: "M3 5h18v11H3zM8 20h8M12 16v4",
  chevron: "m7 10 5 5 5-5",
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

/**
 * The language choice for narrow screens: a globe and the short code, over the
 * same native select. The select stays the real control, so the picker of the
 * device opens and a screen reader reads the full language names.
 */
export function LanguageSwitchCompact() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="icon-btn relative !w-auto gap-1.5 px-2.5 font-mono text-xs tracking-wider">
      <Icon name="globe" />
      <span aria-hidden>{locale.slice(0, 2).toUpperCase()}</span>
      <span className="sr-only">{t("ui.language.label")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {languages[l].label}
          </option>
        ))}
      </select>
    </label>
  );
}

const ORDER = ["light", "dark", "system"] as const;

/** The theme choice for narrow screens: one button that goes through light, dark and system. */
export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = (mounted && ORDER.find((o) => o === theme)) || "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const label = `${t("ui.theme.label")}: ${t(`ui.theme.${current}`)}`;
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={label}
      title={`${label}. ${t(`ui.theme.${next}`)}?`}
      onClick={() => setTheme(next)}
    >
      <Icon name={current === "light" ? "sun" : current === "dark" ? "moon" : "system"} />
    </button>
  );
}
