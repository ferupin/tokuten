import type { CSSProperties, ReactNode } from "react";

interface HankoProps {
  children: ReactNode;
  size?: number;
  /** CSS color. Defaults to the accent vermilion. */
  color?: string;
  rotate?: number;
  className?: string;
  title?: string;
}

/**
 * A square seal in the style of a Japanese hanko, with an inset border.
 *
 * Two ways of drawing it, for two situations:
 * - Upright (the logo in the header): the frames are vector strokes. A CSS border
 *   is rounded to whole device pixels one side at a time, so at 125% or 150% zoom
 *   the four sides came out with different thickness. A stroke scales evenly.
 * - Tilted (the stamps on the result card and on the meaning page): CSS borders.
 *   A rotated vector stroke is smoothed by the browser and looks soft, while a
 *   rotated CSS border stays sharp.
 */
export function Hanko({ children, size = 44, color = "var(--accent)", rotate = 0, className, title }: HankoProps) {
  const common = {
    role: title ? ("img" as const) : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
  };

  if (rotate) {
    const style: CSSProperties = {
      width: size,
      height: size,
      color,
      borderColor: color,
      fontSize: size * 0.58,
      transform: `rotate(${rotate}deg)`,
    };
    return (
      <span
        {...common}
        className={`inline-grid shrink-0 place-items-center rounded-[6px] border-2 font-serif font-extrabold leading-none select-none ${className ?? ""}`}
        style={style}
      >
        <span className="grid place-items-center rounded-[3px] border" style={{ width: "82%", height: "82%", borderColor: color }}>
          {children}
        </span>
      </span>
    );
  }

  const inner = (size - 4) * 0.82;
  const at = (size - inner) / 2;
  return (
    <span
      {...common}
      className={`relative inline-block shrink-0 font-serif font-extrabold leading-none select-none ${className ?? ""}`}
      style={{ width: size, height: size, color, fontSize: size * 0.58 }}
    >
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        stroke="currentColor"
        shapeRendering="geometricPrecision"
        className="absolute inset-0"
      >
        <rect x={1} y={1} width={size - 2} height={size - 2} rx={5} strokeWidth={2} />
        <rect x={at + 0.5} y={at + 0.5} width={inner - 1} height={inner - 1} rx={2.5} strokeWidth={1} />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        {/* The font sets the mark a little low in its box. This lifts it to the optical center. */}
        <span className="block" style={{ transform: "translateY(-0.05em)" }}>
          {children}
        </span>
      </span>
    </span>
  );
}
