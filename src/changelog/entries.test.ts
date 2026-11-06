import { describe, expect, it } from "vitest";
import pkg from "../../package.json";
import { sentaiProfile } from "@/profiles/sentai";
import { currentVersion, planned, releases } from "./entries";

const SEMVER = /^\d+\.\d+\.\d+$/;
const compare = (a: string, b: string) => {
  const [x, y] = [a, b].map((v) => v.split(".").map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

describe("changelog", () => {
  it("matches the version in package.json", () => {
    expect(currentVersion).toBe(pkg.version);
  });

  it("uses valid versions, newest first, without duplicates", () => {
    const versions = releases.map((r) => r.version);
    versions.forEach((v) => expect(v).toMatch(SEMVER));
    expect(new Set(versions).size).toBe(versions.length);
    const sorted = [...versions].sort((a, b) => compare(b, a));
    expect(versions).toEqual(sorted);
  });

  it("has valid dates", () => {
    for (const r of releases) expect(Number.isNaN(Date.parse(r.date))).toBe(false);
  });

  it("records the current Sentai profile version", () => {
    expect(releases[0].sentaiProfileVersion).toBe(sentaiProfile.version);
  });

  it("has English and Portuguese text everywhere", () => {
    const texts = [
      ...planned,
      ...releases.flatMap((r) => [r.title, r.summary, ...r.groups.flatMap((g) => g.items)]),
    ];
    for (const text of texts) {
      expect(text.en.trim().length).toBeGreaterThan(0);
      expect(text["pt-BR"].trim().length).toBeGreaterThan(0);
    }
  });

  it("does not use em dashes", () => {
    const all = JSON.stringify({ releases, planned });
    expect(all.includes("—")).toBe(false);
  });
});
