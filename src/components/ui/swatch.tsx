"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { cssColorToHex } from "./color";

interface SwatchProps {
  /** CSS custom property that holds the color, for example "--bg". */
  token: string;
  /** Visible name under the color. Empty keeps the space. */
  name?: string;
  /** Marks the name as Japanese text for screen readers and fonts. */
  japanese?: boolean;
  size?: "md" | "sm";
}

/**
 * A color sample that reveals its hex code on hover or keyboard focus, and
 * copies it on click or Enter. The code is read from the real computed color,
 * so it can never drift from what is on screen. Touch has no hover, so a tap
 * reveals the code too. It must sit inside an element with data-theme, so the
 * token resolves to that theme.
 */
export function Swatch({ token, name, japanese, size = "md" }: SwatchProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLButtonElement>(null);
  const [hex, setHex] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shown, setShown] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current) setHex(cssColorToHex(getComputedStyle(ref.current).backgroundColor));
    return () => window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    if (!hex) return;
    setShown(true);
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
    } catch {
      /* The code stays visible, so it can still be read and copied by hand. */
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setShown(false);
    }, 1600);
  };

  const box = size === "md" ? "h-12 w-12" : "h-8 w-8";
  const label = name ? `${name}, ${hex ?? ""}`.replace(/, $/, "") : (hex ?? token);

  return (
    <div className="group flex w-14 flex-col items-center text-center">
      <button
        ref={ref}
        type="button"
        disabled={!hex}
        onClick={copy}
        onBlur={() => setShown(false)}
        aria-label={hex ? t("meaning.colors.copyLabel", { name: label }) : label}
        className={`${box} cursor-pointer rounded-lg border transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5`}
        style={{ background: `var(${token})`, borderColor: "var(--line-strong)" }}
      />
      <span lang={japanese ? "ja" : undefined} className="mt-1 block min-h-[16px] text-[11px] leading-4" style={{ color: "var(--ink-soft)" }}>
        {name || " "}
      </span>
      <span
        aria-hidden
        className={`block font-mono text-[10px] leading-4 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${shown || copied ? "opacity-100" : "opacity-0"}`}
        style={{ color: "var(--ink)" }}
      >
        {copied ? t("meaning.colors.copied") : (hex ?? " ")}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("meaning.colors.copied") : ""}
      </span>
    </div>
  );
}
