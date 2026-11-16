import { describe, expect, it } from "vitest";
import { applyGradeKey } from "./shortcuts";

function type(keys: string) {
  let buffer = "";
  let grade: number | null = null;
  for (const key of keys) {
    const r = applyGradeKey(buffer, key);
    if (!r) continue;
    buffer = r.buffer;
    if (r.grade !== null) grade = r.grade;
  }
  return grade;
}

describe("applyGradeKey", () => {
  it("accepts whole grades", () => {
    expect(type("0")).toBe(0);
    expect(type("7")).toBe(7);
    expect(type("9")).toBe(9);
  });
  it("builds 10 from 1 then 0", () => {
    expect(type("10")).toBe(10);
  });
  it("builds a decimal with a dot or a comma", () => {
    expect(type("7.5")).toBe(7.5);
    expect(type("7,5")).toBe(7.5);
    expect(type("0.5")).toBe(0.5);
  });
  it("keeps the last valid grade while a decimal is typed", () => {
    expect(applyGradeKey("7", ".")).toEqual({ buffer: "7.", grade: null });
  });
  it("starts over when the number would be invalid", () => {
    expect(type("75")).toBe(5);
    expect(type("105")).toBe(5);
    expect(type("10.5")).toBe(5);
    expect(type("7.55")).toBe(5);
  });
  it("ignores a lone dot and keys that are not part of a grade", () => {
    expect(applyGradeKey("", ".")).toEqual({ buffer: "", grade: null });
    expect(applyGradeKey("", "a")).toBeNull();
    expect(applyGradeKey("", "Enter")).toBeNull();
  });
});
