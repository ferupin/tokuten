import { describe, expect, it } from "vitest";
import { cssColorToHex } from "./color";

describe("cssColorToHex", () => {
  it("converts rgb", () => {
    expect(cssColorToHex("rgb(34, 29, 22)")).toBe("#221D16");
    expect(cssColorToHex("rgb(243 236 220)")).toBe("#F3ECDC");
    expect(cssColorToHex("rgba(0, 0, 0, 1)")).toBe("#000000");
  });
  it("pads small values", () => {
    expect(cssColorToHex("rgb(1, 2, 3)")).toBe("#010203");
  });
  it("rejects what it does not understand", () => {
    expect(cssColorToHex("oklch(0.5 0.1 20)")).toBeNull();
    expect(cssColorToHex("rgb(300, 0, 0)")).toBeNull();
    expect(cssColorToHex("")).toBeNull();
  });
});
