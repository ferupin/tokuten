import { describe, expect, it } from "vitest";
import { en } from "@/i18n/en";
import { ptBR } from "@/i18n/pt-BR";
import { es } from "@/i18n/es";
import { sentaiProfile } from "@/profiles/sentai";
import { createEvaluation, computeResult } from "./scoring";
import { buildCardData, canShare } from "./share-card";
import type { Messages } from "@/i18n/en";
import type { Translate } from "./export-markdown";

const makeT = (m: Messages): Translate => (key, values) => {
  let node: unknown = m;
  for (const part of key.split(".")) {
    if (node && typeof node === "object" && part in node) node = (node as Record<string, unknown>)[part];
    else throw new Error(`missing key ${key}`);
  }
  if (typeof node !== "string") throw new Error(`not text ${key}`);
  return node.replace(/\{(\w+)\}/g, (_, n) => String(values?.[n] ?? `{${n}}`));
};

function sample() {
  const ev = createEvaluation(sentaiProfile);
  ev.title = "Kaizoku Sentai Gokaiger";
  ev.introduction = "SECRET-INTRO";
  ev.conclusion = "SECRET-CONCLUSION";
  for (const c of sentaiProfile.categories) {
    ev.categories[c.id].override = 7;
    ev.categories[c.id].notes = "SECRET-NOTE";
  }
  ev.categories.mecha.applicable = false;
  ev.enjoyment = 9;
  return ev;
}

describe("share card data", () => {
  it("is not offered when nothing is graded", () => {
    const ev = createEvaluation(sentaiProfile);
    const result = computeResult(sentaiProfile, ev);
    expect(canShare(result)).toBe(false);
    expect(buildCardData(sentaiProfile, result, { title: "x", enjoyment: null, includeEnjoyment: false }, makeT(en))).toBeNull();
  });

  for (const [name, messages] of [["en", en], ["pt-BR", ptBR], ["es", es]] as const) {
    it(`never carries the introduction, notes or conclusion (${name})`, () => {
      const ev = sample();
      const result = computeResult(sentaiProfile, ev);
      const data = buildCardData(sentaiProfile, result, { title: ev.title, enjoyment: ev.enjoyment, includeEnjoyment: true }, makeT(messages))!;
      expect(JSON.stringify(data)).not.toContain("SECRET");
    });
  }

  it("keeps personal enjoyment out unless asked", () => {
    const ev = sample();
    const result = computeResult(sentaiProfile, ev);
    const off = buildCardData(sentaiProfile, result, { title: ev.title, enjoyment: 9, includeEnjoyment: false }, makeT(en))!;
    const on = buildCardData(sentaiProfile, result, { title: ev.title, enjoyment: 9, includeEnjoyment: true }, makeT(en))!;
    expect(off.enjoyment).toBeNull();
    expect(off.description).not.toMatch(/enjoyment/i);
    expect(on.enjoyment?.valueText).toBe("9.0");
    expect(on.description).toMatch(/Personal enjoyment 9.0/);
  });

  it("names every row, dashes not applicable ones and marks partial scores", () => {
    const ev = sample();
    ev.categories.music.override = null;
    const result = computeResult(sentaiProfile, ev);
    const data = buildCardData(sentaiProfile, result, { title: "", enjoyment: null, includeEnjoyment: false }, makeT(en))!;
    expect(data.rows).toHaveLength(10);
    expect(data.rows.every((r) => r.name.length > 0)).toBe(true);
    expect(data.rows.find((r) => r.id === "mecha")?.gradeText).toBe("–");
    expect(data.complete).toBe(false);
    expect(data.caption).toMatch(/Partial score/);
    expect(data.titleIsPlaceholder).toBe(true);
    expect(data.title).toBe("Untitled season");
  });

  it("gives every category a short name in every language", () => {
    for (const messages of [en, ptBR, es]) {
      for (const c of sentaiProfile.categories) {
        const short = (messages.profiles.sentai.categories as Record<string, { short: string }>)[c.id].short;
        expect(short.trim().length, c.id).toBeGreaterThan(0);
        expect(short.length, c.id).toBeLessThanOrEqual(14);
      }
    }
  });
});
