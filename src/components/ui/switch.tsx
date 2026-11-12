"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label. It is also the accessible name. */
  label: string;
}

/**
 * An on or off setting, as opposed to a button that does something. The track
 * takes the accent color when on, so the state reads at a glance without text.
 */
export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-[13px] font-semibold text-ink"
    >
      <span
        aria-hidden
        className="relative inline-block h-5 w-9 shrink-0 rounded-full border transition-colors"
        style={{
          background: checked ? "var(--accent)" : "var(--surface-2)",
          borderColor: checked ? "var(--accent)" : "var(--line-strong)",
        }}
      >
        <span
          className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full transition-transform"
          style={{
            background: checked ? "var(--accent-ink)" : "var(--ink-soft)",
            transform: checked ? "translateX(16px)" : "translateX(0)",
          }}
        />
      </span>
      {label}
    </button>
  );
}
