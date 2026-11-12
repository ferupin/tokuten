"use client";

import { useRef, type KeyboardEvent } from "react";

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

/**
 * Pick one of a few options, shown as one piece instead of separate buttons.
 * Arrow keys move the choice, as in any radio group.
 */
export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-lg border p-0.5"
      style={{ background: "var(--surface-2)", borderColor: "var(--line-strong)" }}
    >
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => move(e, i)}
            className="cursor-pointer rounded-md border-0 px-3 py-1 text-[13px] font-semibold transition-colors"
            style={{ background: on ? "var(--ink)" : "transparent", color: on ? "var(--bg)" : "var(--ink-soft)" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
