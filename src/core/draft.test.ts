import { describe, expect, it } from "vitest";
import { sentaiProfile } from "@/profiles/sentai";
import { defaultPreferences, isBlank, parseDraft, parsePreferences, toDraft } from "./draft";
import { createEvaluation } from "./scoring";

describe("draft", () => {
  it("round trips an evaluation", () => {
    const e = createEvaluation(sentaiProfile);
    e.title = "Draft";
    e.categories.story.override = 7.5;
    const parsed = parseDraft(JSON.stringify(toDraft(e)), sentaiProfile);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.evaluation.categories.story.override).toBe(7.5);
  });

  it("rejects missing, broken and foreign data", () => {
    expect(parseDraft(null, sentaiProfile).ok).toBe(false);
    expect(parseDraft("{nope", sentaiProfile).ok).toBe(false);
    expect(parseDraft(JSON.stringify({ app: "other" }), sentaiProfile).ok).toBe(false);
    const e = createEvaluation(sentaiProfile);
    // A JSON export is not a draft.
    expect(parseDraft(JSON.stringify({ app: "tokuten", schema: 1, evaluation: e }), sentaiProfile).ok).toBe(false);
  });

  it("rejects a grade outside the scale", () => {
    const e = createEvaluation(sentaiProfile);
    e.categories.story.override = 42;
    expect(parseDraft(JSON.stringify(toDraft(e)), sentaiProfile).ok).toBe(false);
  });

  it("treats a fresh evaluation as blank, whatever the mode", () => {
    const e = createEvaluation(sentaiProfile);
    expect(isBlank(sentaiProfile, e)).toBe(true);
    expect(isBlank(sentaiProfile, { ...e, mode: "quick" })).toBe(true);
  });

  it("is not blank after any input", () => {
    const a = createEvaluation(sentaiProfile);
    a.title = "x";
    expect(isBlank(sentaiProfile, a)).toBe(false);
    const b = createEvaluation(sentaiProfile);
    b.categories.mecha.applicable = false;
    expect(isBlank(sentaiProfile, b)).toBe(false);
    const c = createEvaluation(sentaiProfile);
    c.enjoyment = 0;
    expect(isBlank(sentaiProfile, c)).toBe(false);
  });

  it("ignores key order when judging blank", () => {
    const e = createEvaluation(sentaiProfile);
    const reordered = Object.fromEntries(Object.entries(e).reverse()) as typeof e;
    expect(isBlank(sentaiProfile, reordered)).toBe(true);
  });
});

describe("preferences", () => {
  it("defaults to draft on", () => {
    expect(defaultPreferences.draft).toBe(true);
    expect(parsePreferences(null)).toEqual(defaultPreferences);
    expect(parsePreferences("garbage")).toEqual(defaultPreferences);
  });

  it("keeps valid values and repairs invalid ones", () => {
    expect(parsePreferences('{"draft":false,"mode":"quick","format":"obsidian"}')).toEqual({
      draft: false,
      mode: "quick",
      format: "obsidian",
      cardLayout: null,
      cardTheme: null,
    });
    expect(parsePreferences('{"cardLayout":"ledger","cardTheme":"dark"}')).toMatchObject({ cardLayout: "ledger", cardTheme: "dark" });
    expect(parsePreferences('{"cardLayout":"banner","cardTheme":"blue"}')).toMatchObject({ cardLayout: null, cardTheme: null });
    expect(parsePreferences('{"draft":"yes","mode":"huge","format":3}')).toEqual(defaultPreferences);
  });
});
