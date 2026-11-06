"use client";

import type { CSSProperties } from "react";
import { formatGrade, gradeBand } from "@/core/grades";
import { useI18n } from "@/i18n";

interface GradeSliderProps {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  tone: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** Show the band label and its description under the slider. */
  showHint?: boolean;
}

export function GradeSlider({ label, value, onChange, tone, disabled, min = 0, max = 10, step = 0.1, showHint }: GradeSliderProps) {
  const { t } = useI18n();
  const shown = value ?? (min + max) / 2;
  const style = { "--tone": tone, "--pct": value === null ? "0%" : `${((shown - min) / (max - min)) * 100}%` } as CSSProperties;
  const band = value === null ? null : gradeBand(value);

  return (
    <div className={value === null ? "opacity-90" : ""}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink">{label}</span>
        <span className="tnum font-mono text-sm font-bold" style={{ color: value === null ? "var(--ink-soft)" : tone }}>
          {value === null ? t("evaluation.notGraded") : formatGrade(value)}
        </span>
      </div>
      <input
        type="range"
        className="grade"
        aria-label={label}
        aria-valuetext={value === null ? t("evaluation.notGraded") : `${formatGrade(value)}, ${t(`grades.${band}`)}`}
        min={min}
        max={max}
        step={step}
        value={shown}
        disabled={disabled}
        style={style}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      {showHint && band && (
        <p className="-mt-1 text-xs text-soft">
          <strong className="font-semibold text-ink">{t(`grades.${band}`)}.</strong> {t(`gradeHints.${band}`)}
        </p>
      )}
    </div>
  );
}
