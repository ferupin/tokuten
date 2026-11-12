import { describe, expect, it } from "vitest";
import { createEvaluationStore } from "@/features/evaluation/store";
import { sentaiProfile } from "@/profiles/sentai";
import { exportAs } from "./export";
import { parseEnvelope, toEnvelope } from "./schema";
import { computeResult, createEvaluation } from "./scoring";

const t = (key: string, values?: Record<string, string | number>) =>
  values ? `${key}(${Object.entries(values).map(([k, v]) => `${k}=${v}`).join(",")})` : key;

describe("consistency checklist", () => {
  it("starts empty and never changes the score", () => {
    const e = createEvaluation(sentaiProfile);
    e.categories.story.override = 8;
    const before = computeResult(sentaiProfile, e).score;
    e.checked = [...sentaiProfile.checklist];
    expect(computeResult(sentaiProfile, e).score).toBe(before);
    expect(createEvaluation(sentaiProfile).checked).toEqual([]);
  });

  it("keeps profile order whatever order the boxes are ticked in", () => {
    const store = createEvaluationStore(sentaiProfile);
    const s = store.getState();
    s.setChecked("wholeSeason", true);
    s.setChecked("noNostalgia", true);
    expect(store.getState().evaluation.checked).toEqual(["noNostalgia", "wholeSeason"]);
    store.getState().setChecked("noNostalgia", false);
    expect(store.getState().evaluation.checked).toEqual(["wholeSeason"]);
  });

  it("survives a JSON round trip", () => {
    const e = createEvaluation(sentaiProfile);
    e.checked = ["noNostalgia", "noForcedLow"];
    const back = parseEnvelope(JSON.stringify(toEnvelope(e)), sentaiProfile);
    expect(back.ok).toBe(true);
    if (back.ok) expect(back.evaluation.checked).toEqual(["noNostalgia", "noForcedLow"]);
  });

  it("reads files saved before the checklist existed", () => {
    const e = createEvaluation(sentaiProfile);
    const env = JSON.parse(JSON.stringify(toEnvelope(e)));
    delete env.evaluation.checked;
    const back = parseEnvelope(JSON.stringify(env), sentaiProfile);
    expect(back.ok).toBe(true);
    if (back.ok) expect(back.evaluation.checked).toEqual([]);
  });

  it("drops unknown ids instead of failing", () => {
    const e = createEvaluation(sentaiProfile);
    const env = JSON.parse(JSON.stringify(toEnvelope(e)));
    env.evaluation.checked = ["noNostalgia", "madeUp"];
    const back = parseEnvelope(JSON.stringify(env), sentaiProfile);
    expect(back.ok).toBe(true);
    if (back.ok) expect(back.evaluation.checked).toEqual(["noNostalgia"]);
  });

  it("appears in both exports only when something is ticked", () => {
    const e = createEvaluation(sentaiProfile);
    const r = () => computeResult(sentaiProfile, e);
    for (const f of ["standard", "obsidian"] as const) {
      expect(exportAs(f, sentaiProfile, e, r(), t)).not.toContain("export.checklist");
    }
    e.checked = ["noNostalgia", "wholeSeason"];
    const std = exportAs("standard", sentaiProfile, e, r(), t);
    expect(std).toContain("## export.checklist");
    expect(std).toContain("- [x] profiles.sentai.checklist.noNostalgia");
    expect(std).toContain("- [ ] profiles.sentai.checklist.noAgePenalty");
    expect(std.match(/^- \[[x ]\]/gm)).toHaveLength(10);
    const obs = exportAs("obsidian", sentaiProfile, e, r(), t);
    expect(obs).toContain("> [!todo]- export.checklistCount(done=2,total=10)");
    expect(obs).toContain("> - [x] profiles.sentai.checklist.wholeSeason");
    expect(obs).toContain("checklist_done: 2");
  });
});
