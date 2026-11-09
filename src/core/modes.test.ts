import { describe, expect, it } from "vitest";
import { createEvaluationStore } from "@/features/evaluation/store";
import { sentaiProfile } from "@/profiles/sentai";
import { exportMarkdown } from "./export-markdown";
import { parseEnvelope, toEnvelope } from "./schema";
import { computeResult, createEvaluation } from "./scoring";

const t = (key: string) => key;

describe("evaluation modes", () => {
  it("start in detailed mode", () => {
    expect(createEvaluation(sentaiProfile).mode).toBe("detailed");
  });

  it("do not change the calculation", () => {
    const ev = createEvaluation(sentaiProfile);
    ev.categories.story.override = 8;
    ev.categories.music.subcriteria.themeSongs.value = 6;
    const detailed = computeResult(sentaiProfile, { ...ev, mode: "detailed" });
    const quick = computeResult(sentaiProfile, { ...ev, mode: "quick" });
    expect(quick).toEqual(detailed);
  });

  it("load JSON exported before modes existed as detailed", () => {
    const old = JSON.parse(JSON.stringify(toEnvelope(createEvaluation(sentaiProfile))));
    delete old.evaluation.mode;
    const parsed = parseEnvelope(JSON.stringify(old), sentaiProfile);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.evaluation.mode).toBe("detailed");
  });

  it("keep the mode through a JSON round trip", () => {
    const ev = { ...createEvaluation(sentaiProfile), mode: "quick" as const };
    const parsed = parseEnvelope(JSON.stringify(toEnvelope(ev)), sentaiProfile);
    expect(parsed.ok && parsed.evaluation.mode).toBe("quick");
  });

  it("reject an unknown mode", () => {
    const bad = JSON.parse(JSON.stringify(toEnvelope(createEvaluation(sentaiProfile))));
    bad.evaluation.mode = "turbo";
    expect(parseEnvelope(JSON.stringify(bad), sentaiProfile)).toEqual({ ok: false, error: "invalidShape" });
  });
});

describe("markdown export by mode", () => {
  const build = (mode: "detailed" | "quick") => {
    const ev = createEvaluation(sentaiProfile);
    ev.mode = mode;
    ev.categories.story.subcriteria.structure.value = 8;
    return exportMarkdown(sentaiProfile, ev, computeResult(sentaiProfile, ev), t);
  };

  it("lists subcriteria in detailed mode and does not mention a quick evaluation", () => {
    const md = build("detailed");
    expect(md).toContain("- profiles.sentai.categories.story.subcriteria.structure: 8.0");
    expect(md).not.toContain("export.quickNote");
  });

  it("leaves subcriteria out in quick mode and says it was a quick evaluation", () => {
    const md = build("quick");
    expect(md).not.toContain("subcriteria.structure");
    expect(md).toContain("> export.quickNote");
  });
});

describe("store", () => {
  it("keeps every grade when the mode changes", () => {
    const store = createEvaluationStore(sentaiProfile);
    store.getState().setSubcriterion("story", "plot", 7);
    store.getState().setOverride("music", 9);
    store.getState().setMode("quick");
    store.getState().setMode("detailed");
    const ev = store.getState().evaluation;
    expect(ev.categories.story.subcriteria.plot.value).toBe(7);
    expect(ev.categories.music.override).toBe(9);
  });

  it("sets the mode", () => {
    const store = createEvaluationStore(sentaiProfile);
    store.getState().setMode("quick");
    expect(store.getState().evaluation.mode).toBe("quick");
  });

  it("clears grades on reset but keeps the mode", () => {
    const store = createEvaluationStore(sentaiProfile);
    store.getState().setMode("quick");
    store.getState().setOverride("story", 8);
    store.getState().reset();
    const ev = store.getState().evaluation;
    expect(ev.mode).toBe("quick");
    expect(ev.categories.story.override).toBeNull();
  });
});
