/**
 * Colors used when a card is drawn on a canvas. A canvas cannot read CSS
 * variables, so the values are repeated here. A test compares this table with
 * src/app/globals.css so the two cannot drift apart.
 */
export type CardTheme = "light" | "dark";

export interface Palette {
  bg: string;
  surface: string;
  ink: string;
  soft: string;
  line: string;
  lineStrong: string;
  accent: string;
  red: string;
  blue: string;
  yellow: string;
  green: string;
  pink: string;
}

export const palettes: Record<CardTheme, Palette> = {
  light: {
    bg: "#f3ecdc",
    surface: "#faf5e9",
    ink: "#221d16",
    soft: "#5d5446",
    line: "#d8ccb2",
    lineStrong: "#bba98a",
    accent: "#c23a22",
    red: "#b8392a",
    blue: "#2c6a85",
    yellow: "#a9770d",
    green: "#4f7440",
    pink: "#b45a7c",
  },
  dark: {
    bg: "#16130e",
    surface: "#1e1a14",
    ink: "#ece3cf",
    soft: "#a89f8b",
    line: "#342e23",
    lineStrong: "#4a4232",
    accent: "#ee6a50",
    red: "#ee7261",
    blue: "#6fb3cf",
    yellow: "#e0b04a",
    green: "#86b573",
    pink: "#e48fb1",
  },
};

/** CSS variable behind each palette key, used by the consistency test. */
export const cssVariable: Record<keyof Palette, string> = {
  bg: "--bg",
  surface: "--surface",
  ink: "--ink",
  soft: "--ink-soft",
  line: "--line",
  lineStrong: "--line-strong",
  accent: "--accent",
  red: "--red",
  blue: "--blue",
  yellow: "--yellow",
  green: "--green",
  pink: "--pink",
};
