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

/** A square seal in the style of a Japanese hanko, with an inset border. */
export function Hanko({ children, size = 44, color = "var(--accent)", rotate = 0, className, title }: HankoProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    color,
    borderColor: color,
    fontSize: size * 0.58,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };
  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`inline-grid shrink-0 place-items-center rounded-[6px] border-2 font-serif font-extrabold leading-none select-none ${className ?? ""}`}
      style={style}
    >
      <span className="grid place-items-center rounded-[3px] border" style={{ width: "82%", height: "82%", borderColor: color }}>
        {children}
      </span>
    </span>
  );
}
