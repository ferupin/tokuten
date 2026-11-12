/**
 * Turns a computed CSS color such as "rgb(34, 29, 22)" into "#221D16".
 * Returns null for anything it does not understand, so the interface can
 * hide the code instead of showing a wrong one.
 */
export function cssColorToHex(value: string): string | null {
  const m = value.trim().match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,/]+([\d.]+%?))?\s*\)$/i);
  if (!m) return null;
  const channels = [m[1], m[2], m[3]].map(Number);
  if (channels.some((c) => c > 255)) return null;
  return "#" + channels.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
}
