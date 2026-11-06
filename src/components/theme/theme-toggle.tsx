"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

const OPTIONS = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div role="group" aria-label={t("ui.theme.label")} className="inline-flex rounded-lg border border-line p-0.5">
      {OPTIONS.map((option) => {
        const active = mounted && theme === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(option)}
            className={`rounded-md px-2 py-1 text-xs sm:px-2.5 font-medium transition-colors ${
              active ? "bg-ink text-bg" : "text-soft hover:text-ink"
            }`}
          >
            {t(`ui.theme.${option}`)}
          </button>
        );
      })}
    </div>
  );
}
