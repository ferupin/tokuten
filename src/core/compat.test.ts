import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { sentaiProfile } from "@/profiles/sentai";
import { FILE_SCHEMA, parseEnvelope, toEnvelope } from "./schema";
import { computeResult } from "./scoring";

/**
 * File format promise (see docs/file-format.md).
 *
 * Every file written by an earlier version must keep opening, and the file the
 * current version writes is pinned here. If a test below fails, the file format
 * changed. That is a decision: either undo the change, or follow the rules in
 * docs/file-format.md and update the fixtures on purpose.
 */
const dir = "src/core/fixtures";
const read = (name: string) => readFileSync(`${dir}/${name}`, "utf8");
const files = readdirSync(dir).filter((f) => f.endsWith(".tokuten.json"));

describe("file format compatibility", () => {
  it("has fixtures from earlier versions", () => {
    expect(files.length).toBeGreaterThanOrEqual(3);
  });

  for (const name of files) {
    it(`opens ${name}`, () => {
      const parsed = parseEnvelope(read(name), sentaiProfile);
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) return;
      const result = computeResult(sentaiProfile, parsed.evaluation);
      // The same fixture data must keep giving the same official score, whatever the version.
      expect(result.score).not.toBeNull();
      expect(result.categories.find((c) => c.id === "mecha")?.status).toBe("not-applicable");
      expect(parsed.evaluation.title).toBe("Fixture Season");
      expect(parsed.evaluation.enjoyment).toBe(8.5);
    });
  }

  it("gives the same score for the same grades in every fixture mode", () => {
    const scores = files.map((n) => {
      const p = parseEnvelope(read(n), sentaiProfile);
      return p.ok ? computeResult(sentaiProfile, p.evaluation).score : null;
    });
    expect(new Set(scores).size).toBe(1);
  });

  it("fills in what old files did not have", () => {
    const old = parseEnvelope(read("v0.1-detailed.tokuten.json"), sentaiProfile);
    expect(old.ok && old.evaluation.mode).toBe("detailed");
    expect(old.ok && old.evaluation.checked).toEqual([]);
  });

  it("writes exactly the pinned current format", () => {
    const fixture = JSON.parse(read("v0.7-checklist.tokuten.json"));
    const parsed = parseEnvelope(JSON.stringify(fixture), sentaiProfile);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const written = JSON.parse(JSON.stringify(toEnvelope(parsed.evaluation, new Date(fixture.exportedAt))));
    expect(written).toEqual(fixture);
  });

  it("states the schema version of the envelope", () => {
    expect(FILE_SCHEMA).toBe(1);
    expect(toEnvelope(parseEnvelopeOk("v0.1-detailed.tokuten.json")).schema).toBe(1);
  });

  it("ignores fields it does not know, so additive changes stay readable", () => {
    const fixture = JSON.parse(read("v0.7-checklist.tokuten.json"));
    fixture.evaluation.someFutureField = { a: 1 };
    fixture.somethingElse = true;
    expect(parseEnvelope(JSON.stringify(fixture), sentaiProfile).ok).toBe(true);
  });

  it("refuses a newer schema with its own message", () => {
    const fixture = JSON.parse(read("v0.7-checklist.tokuten.json"));
    fixture.schema = 2;
    const r = parseEnvelope(JSON.stringify(fixture), sentaiProfile);
    expect(r).toEqual({ ok: false, error: "newerSchema" });
  });

  it("still reports other problems as before", () => {
    expect(parseEnvelope("nope", sentaiProfile)).toEqual({ ok: false, error: "invalidJson" });
    expect(parseEnvelope('{"hello":1}', sentaiProfile)).toEqual({ ok: false, error: "notTokuten" });
    const fixture = JSON.parse(read("v0.7-checklist.tokuten.json"));
    fixture.evaluation.enjoyment = 99;
    expect(parseEnvelope(JSON.stringify(fixture), sentaiProfile)).toEqual({ ok: false, error: "invalidShape" });
  });
});

function parseEnvelopeOk(name: string) {
  const p = parseEnvelope(read(name), sentaiProfile);
  if (!p.ok) throw new Error("fixture does not parse");
  return p.evaluation;
}
