import type { CSSProperties } from "react";

export interface RadarPoint {
  id: string;
  label: string;
  value: number | null;
  color: string;
}

/** Ten axis radar chart in plain SVG. Missing values stay at the center. */
export function Radar({ points, max = 10, size = 320 }: { points: RadarPoint[]; max?: number; size?: number }) {
  const c = size / 2;
  const r = size / 2 - 38;
  const n = points.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const at = (i: number, ratio: number) => [c + Math.cos(angle(i)) * r * ratio, c + Math.sin(angle(i)) * r * ratio] as const;

  const polygon = points
    .map((p, i) => at(i, p.value === null ? 0 : p.value / max))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  // The kanji take the color of their pillar, so each axis reads like its row in the table.
  const label = (color: string): CSSProperties => ({ fontFamily: "Shippori Mincho, serif", fontWeight: 800, fontSize: 14, fill: color });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar chart of category grades" className="mx-auto h-auto w-full max-w-[340px]">
      {[0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={points.map((_, i) => at(i, ratio).join(",")).join(" ")}
          fill="none"
          stroke="var(--line)"
          strokeWidth={ratio === 1 ? 1.2 : 0.8}
        />
      ))}
      {points.map((p, i) => {
        const [x, y] = at(i, 1);
        const [lx, ly] = at(i, 1.15);
        const anchor = Math.abs(lx - c) < 6 ? "middle" : lx > c ? "start" : "end";
        return (
          <g key={p.id}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="var(--line)" strokeWidth={0.8} />
            <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" style={label(p.color)}>
              {p.label}
            </text>
          </g>
        );
      })}
      <polygon points={polygon} fill="var(--accent)" fillOpacity={0.16} stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
      {points.map((p, i) => {
        if (p.value === null) return null;
        const [x, y] = at(i, p.value / max);
        return <circle key={p.id} cx={x} cy={y} r={3.5} fill={p.color} stroke="var(--surface)" strokeWidth={1.5} />;
      })}
    </svg>
  );
}
