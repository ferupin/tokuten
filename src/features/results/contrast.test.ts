import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");

function block(selector: string): string {
  const start = css.indexOf(selector);
  const open = css.indexOf("{", start);
  return css.slice(open, css.indexOf("}", open));
}

const themes = { light: block(":root,"), dark: block('[data-theme="dark"] {') };

function color(theme: string, name: string): string {
  const match = new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`).exec(theme);
  if (!match) throw new Error(`Missing ${name}`);
  return match[1];
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("contrast", () => {
  for (const [name, theme] of Object.entries(themes)) {
    it(`keeps category colors readable as text in the ${name} theme (AA, 4.5:1)`, () => {
      for (const token of ["--red", "--blue", "--yellow", "--green", "--pink", "--silver", "--gold", "--violet"]) {
        for (const surface of ["--bg", "--surface"]) {
          expect(ratio(color(theme, token), color(theme, surface)), `${token} on ${surface}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });

    it(`keeps control edges visible in the ${name} theme (3:1)`, () => {
      for (const surface of ["--bg", "--surface"]) {
        expect(ratio(color(theme, "--control"), color(theme, surface)), `--control on ${surface}`).toBeGreaterThanOrEqual(3);
      }
    });
  }
});
