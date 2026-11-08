"use client";

import Link from "next/link";
import { Hanko } from "@/components/brand/hanko";
import { LanguageSwitch } from "@/components/theme/language-switch";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useI18n } from "@/i18n";

/** Header for secondary pages: logo that links home, language and theme. */
export function PageHeader({ width = "max-w-3xl" }: { width?: string }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className={`mx-auto flex ${width} items-center gap-3 px-4 py-3`}>
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 text-ink no-underline" aria-label={t("ui.backToApp")}>
          <Hanko size={34}>点</Hanko>
          <span className="font-display text-lg tracking-wide">TOKUTEN</span>
        </Link>
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </header>
  );
}
