import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cssVariable, palettes, type CardTheme } from "./palette";

const css = readFileSync("src/app/globals.css", "utf8");

function block(selector: string): string {
  const start = css.indexOf(selector);
  const open = css.indexOf("{", start);
  return css.slice(open, css.indexOf("}", open));
}

describe("card palette", () => {
  const blocks: Record<CardTheme, string> = { light: block(":root,"), dark: block('[data-theme="dark"] {') };
  for (const theme of ["light", "dark"] as const) {
    it(`matches the ${theme} theme tokens in globals.css`, () => {
      for (const [key, variable] of Object.entries(cssVariable)) {
        const match = new RegExp(`${variable}:\\s*(#[0-9a-fA-F]{6})`).exec(blocks[theme]);
        expect(match, `${theme} ${variable}`).not.toBeNull();
        expect(palettes[theme][key as keyof typeof cssVariable].toLowerCase(), `${theme} ${key}`).toBe(match![1].toLowerCase());
      }
    });
  }
});
