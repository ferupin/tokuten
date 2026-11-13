import type { CardData } from "@/core/share-card";
import { palettes, type CardTheme, type Palette } from "./palette";

export type CardLayout = "seal" | "ledger";
export const LAYOUTS: readonly CardLayout[] = ["seal", "ledger"];

/** Fixed size of each layout, drawn the same on every screen. */
export const LAYOUT_SIZE: Record<CardLayout, { width: number; height: number }> = {
  seal: { width: 1200, height: 630 },
  ledger: { width: 1080, height: 1080 },
};

const F = {
  display: '"Dela Gothic One", "Zen Kaku Gothic New", sans-serif',
  serif: '"Shippori Mincho", "Hiragino Mincho ProN", serif',
  sans: '"Zen Kaku Gothic New", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

/** Font faces the drawing uses. They are loaded before drawing, so the canvas never falls back. */
const FACES = [
  '400 40px "Dela Gothic One"',
  '800 40px "Shippori Mincho"',
  '400 40px "Zen Kaku Gothic New"',
  '700 40px "Zen Kaku Gothic New"',
  '400 40px "JetBrains Mono"',
  '700 40px "JetBrains Mono"',
];

/** The glyphs the card needs, so the split Japanese font files are requested. */
const SAMPLE = "決仮基準特点赤青黄緑桃0123456789Kijun";

/** Loads the fonts the card uses. Safe to call where the font API is missing. */
export async function loadCardFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  try {
    await Promise.all(FACES.map((face) => document.fonts.load(face, SAMPLE)));
  } catch {
    /* the fallback fonts still draw a readable card */
  }
}

/** The part of the canvas context the drawing uses, so a test can pass a fake. */
export type Ctx = CanvasRenderingContext2D;

function setSpacing(ctx: Ctx, px: number) {
  if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
}

function text(ctx: Ctx, value: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = "left", spacing = 0) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  setSpacing(ctx, spacing);
  ctx.fillText(value, x, y);
  setSpacing(ctx, 0);
}

/** Splits text into at most maxLines lines that fit maxWidth, ending with an ellipsis when cut. */
export function wrap(ctx: Ctx, value: string, font: string, maxWidth: number, maxLines: number): string[] {
  ctx.font = font;
  const tokens = value.includes(" ") ? value.split(/\s+/) : Array.from(value);
  const joiner = value.includes(" ") ? " " : "";
  const lines: string[] = [];
  let line = "";
  let i = 0;
  for (; i < tokens.length; i++) {
    const next = line ? line + joiner + tokens[i] : tokens[i];
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = tokens[i];
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines) {
    if (line) lines.push(line);
    i = tokens.length;
  }
  if (i < tokens.length || lines.length > maxLines) {
    const last = lines.slice(0, maxLines).pop() ?? "";
    let cut = last;
    while (cut && ctx.measureText(cut + "…").width > maxWidth) cut = cut.slice(0, -1);
    lines.splice(maxLines - 1, lines.length, cut.trimEnd() + "…");
  }
  // A single very long word still has to fit.
  return lines.slice(0, maxLines).map((l) => {
    if (ctx.measureText(l).width <= maxWidth) return l;
    let cut = l;
    while (cut && ctx.measureText(cut + "…").width > maxWidth) cut = cut.slice(0, -1);
    return cut + "…";
  });
}

/** Largest font size, from max down to min, at which the text fits the width. */
function fit(ctx: Ctx, value: string, family: (px: number) => string, max: number, min: number, width: number): number {
  for (let px = max; px > min; px -= 2) {
    ctx.font = family(px);
    if (ctx.measureText(value).width <= width) return px;
  }
  return min;
}

function seal(ctx: Ctx, cx: number, cy: number, size: number, mark: string, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-4 * Math.PI) / 180);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, size * 0.045);
  const r = size * 0.1;
  const h = size / 2;
  ctx.beginPath();
  ctx.moveTo(-h + r, -h);
  ctx.arcTo(h, -h, h, h, r);
  ctx.arcTo(h, h, -h, h, r);
  ctx.arcTo(-h, h, -h, -h, r);
  ctx.arcTo(-h, -h, h, -h, r);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = `800 ${size * 0.6}px ${F.serif}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(mark, 0, size * 0.04);
  ctx.restore();
}

function background(ctx: Ctx, w: number, h: number, p: Palette) {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  // A quiet inner frame, like the border of a certificate.
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, w - 40, h - 40);
}

function radar(ctx: Ctx, data: CardData, p: Palette, cx: number, cy: number, radius: number) {
  const n = data.rows.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, r: number) => ({ x: cx + Math.cos(angle(i)) * r, y: cy + Math.sin(angle(i)) * r });

  ctx.lineWidth = 1.5;
  for (const ring of [0.25, 0.5, 0.75, 1]) {
    ctx.strokeStyle = ring === 1 ? p.lineStrong : p.line;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const q = pt(i, radius * ring);
      if (i === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.strokeStyle = p.line;
  for (let i = 0; i < n; i++) {
    const q = pt(i, radius);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }

  // The shape joins graded categories only, so a dash never reads as a zero.
  const graded = data.rows.map((r, i) => ({ r, i })).filter((x) => x.r.grade !== null);
  if (graded.length >= 3) {
    ctx.beginPath();
    graded.forEach(({ r, i }, k) => {
      const q = pt(i, (radius * (r.grade as number)) / 10);
      if (k === 0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    });
    ctx.closePath();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = p.accent;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 3.5;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  for (const { r, i } of graded) {
    const q = pt(i, (radius * (r.grade as number)) / 10);
    ctx.fillStyle = p[r.tone];
    ctx.beginPath();
    ctx.arc(q.x, q.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Every axis is named in words, with its grade.
  data.rows.forEach((r, i) => {
    const q = pt(i, radius + 22);
    const cos = Math.cos(angle(i));
    const align: CanvasTextAlign = Math.abs(cos) < 0.2 ? "center" : cos > 0 ? "left" : "right";
    const sin = Math.sin(angle(i));
    const y = q.y + (sin < -0.5 ? -26 : sin > 0.5 ? 14 : -10);
    text(ctx, r.name, q.x, y, `700 24px ${F.sans}`, p.ink, align);
    text(ctx, r.gradeText, q.x, y + 28, `700 22px ${F.mono}`, r.grade === null ? p.soft : p[r.tone], align);
  });
}

function enjoymentLine(ctx: Ctx, data: CardData, p: Palette, x: number, y: number, align: CanvasTextAlign = "left") {
  if (!data.enjoyment) return;
  text(ctx, `${data.enjoyment.label} ${data.enjoyment.valueText} / 10`, x, y, `700 26px ${F.sans}`, p.ink, align);
  text(ctx, data.enjoyment.note, x, y + 30, `400 22px ${F.sans}`, p.soft, align);
}

function drawSeal(ctx: Ctx, data: CardData, p: Palette, w: number, h: number) {
  background(ctx, w, h, p);
  const left = 70;
  text(ctx, data.profileName.toUpperCase(), left, 84, `400 22px ${F.mono}`, p.soft, "left", 3);

  const titleFont = `800 50px ${F.serif}`;
  const lines = wrap(ctx, data.title, titleFont, 600, 2);
  lines.forEach((l, i) => text(ctx, l, left, 148 + i * 60, titleFont, data.titleIsPlaceholder ? p.soft : p.ink));

  const scoreY = 330;
  const scoreSize = fit(ctx, data.scoreText, (px) => `400 ${px}px ${F.display}`, 150, 90, 330);
  text(ctx, data.scoreText, left, scoreY, `400 ${scoreSize}px ${F.display}`, p.ink);
  ctx.font = `400 ${scoreSize}px ${F.display}`;
  const sw = ctx.measureText(data.scoreText).width;
  text(ctx, "/10", left + sw + 10, scoreY, `400 40px ${F.display}`, p.soft);

  text(ctx, data.band, left, scoreY + 56, `800 40px ${F.serif}`, p.ink);
  wrap(ctx, data.hint, `400 24px ${F.sans}`, 560, 2).forEach((l, i) =>
    text(ctx, l, left, scoreY + 94 + i * 32, `400 24px ${F.sans}`, p.soft),
  );

  // The seal always has its caption in words beside it.
  const sealY = data.enjoyment ? 466 : 480;
  seal(ctx, left + 40, sealY, 76, data.complete ? "決" : "仮", data.complete ? p.accent : p.lineStrong);
  text(ctx, data.caption, left + 100, sealY + 9, `700 26px ${F.sans}`, p.ink);
  enjoymentLine(ctx, data, p, left, 534);

  radar(ctx, data, p, 905, 318, 160);
  text(ctx, data.footer, left, h - 44, `400 22px ${F.sans}`, p.soft);
}

function drawLedger(ctx: Ctx, data: CardData, p: Palette, w: number, h: number) {
  background(ctx, w, h, p);
  const left = 70;
  const right = w - 70;
  text(ctx, data.profileName.toUpperCase(), left, 90, `400 22px ${F.mono}`, p.soft, "left", 3);

  const titleFont = `800 54px ${F.serif}`;
  wrap(ctx, data.title, titleFont, 560, 2).forEach((l, i) =>
    text(ctx, l, left, 162 + i * 66, titleFont, data.titleIsPlaceholder ? p.soft : p.ink),
  );

  const scoreSize = fit(ctx, data.scoreText, (px) => `400 ${px}px ${F.display}`, 130, 80, 280);
  text(ctx, data.scoreText, right, 196, `400 ${scoreSize}px ${F.display}`, p.ink, "right");
  text(ctx, `/10  ${data.band}`, right, 250, `800 32px ${F.serif}`, p.soft, "right");

  seal(ctx, left + 32, 296, 60, data.complete ? "決" : "仮", data.complete ? p.accent : p.lineStrong);
  text(ctx, data.caption, left + 80, 305, `700 26px ${F.sans}`, p.ink);

  const top = 352;
  const rowH = 62;
  const barX = 360;
  const barW = 540;
  data.rows.forEach((r, i) => {
    const y = top + i * rowH;
    ctx.strokeStyle = p.line;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.moveTo(left, y - 12);
    ctx.lineTo(right, y - 12);
    ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, r.kanji, left, y + 30, `800 28px ${F.serif}`, p[r.tone]);
    text(ctx, r.name, left + 46, y + 30, `700 30px ${F.sans}`, p.ink);
    ctx.fillStyle = p.line;
    ctx.fillRect(barX, y + 10, barW, 22);
    if (r.grade !== null) {
      ctx.fillStyle = p[r.tone];
      ctx.fillRect(barX, y + 10, (barW * r.grade) / 10, 22);
    }
    text(ctx, r.gradeText, right, y + 31, `700 32px ${F.mono}`, r.grade === null ? p.soft : p.ink, "right");
  });

  enjoymentLine(ctx, data, p, left, top + 10 * rowH + 26);
  text(ctx, data.footer, left, h - 44, `400 22px ${F.sans}`, p.soft);
}

/** Draws a card on a canvas context. The canvas must already have the layout size. */
export function drawCard(ctx: Ctx, layout: CardLayout, data: CardData, theme: CardTheme): void {
  const { width, height } = LAYOUT_SIZE[layout];
  const p = palettes[theme];
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  if (layout === "seal") drawSeal(ctx, data, p, width, height);
  else drawLedger(ctx, data, p, width, height);
  ctx.restore();
}

/** Renders a card to a PNG blob, loading the fonts first. */
export async function renderCard(layout: CardLayout, data: CardData, theme: CardTheme): Promise<Blob> {
  await loadCardFonts();
  const { width, height } = LAYOUT_SIZE[layout];
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  drawCard(ctx, layout, data, theme);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("no blob"))), "image/png"),
  );
}
