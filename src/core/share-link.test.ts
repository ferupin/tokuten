import { describe, expect, it } from "vitest";
import { sentaiProfile } from "@/profiles/sentai";
import { computeResult, createEvaluation } from "./scoring";
import { decodeShare, encodeShare, MAX_PAYLOAD, MAX_TITLE } from "./share-link";

const lookup = (id: string) => (id === "sentai" ? sentaiProfile : undefined);

function make(grades: (number | null | "n")[], title = "Season") {
  const ev = createEvaluation(sentaiProfile);
  ev.title = title;
  sentaiProfile.categories.forEach((c, i) => {
    const g = grades[i];
    if (g === "n") ev.categories[c.id].applicable = false;
    else if (g !== null) ev.categories[c.id].override = g;
  });
  return ev;
}
const full = [8, 7.5, 7, 7, 8.5, 9, 8, 7.5, 6.5, 7] as const;

describe("share link", () => {
  it("is short, plain and readable", () => {
    const ev = make([...full], "Kaizoku Sentai Gokaiger");
    const link = encodeShare(sentaiProfile, computeResult(sentaiProfile, ev), { title: ev.title, enjoyment: 8.5, includeEnjoyment: true });
    expect(link).toBe("1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7/e=8.5/t=Kaizoku%20Sentai%20Gokaiger");
    expect(link.length).toBeLessThan(120);
  });

  it("round trips to the same score", () => {
    const ev = make([...full]);
    const result = computeResult(sentaiProfile, ev);
    const link = encodeShare(sentaiProfile, result, { title: ev.title, enjoyment: null, includeEnjoyment: false });
    const back = decodeShare(link, lookup);
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(back.result.score).toBe(result.score);
      expect(back.result.complete).toBe(true);
      expect(back.title).toBe("Season");
      expect(back.enjoyment).toBeNull();
    }
  });

  it("keeps not applicable and not graded categories", () => {
    const ev = make([8, "n", 7, null, 8.5, 9, 8, 7.5, 6.5, 7]);
    const result = computeResult(sentaiProfile, ev);
    const link = encodeShare(sentaiProfile, result, { title: "", enjoyment: null, includeEnjoyment: false });
    expect(link.split("/")[2]).toBe("8,n,7,-,8.5,9,8,7.5,6.5,7");
    const back = decodeShare(link, lookup);
    expect(back.ok && back.result.score).toBe(result.score);
    if (back.ok) {
      expect(back.result.complete).toBe(false);
      expect(back.result.redistributed).toBe(true);
    }
  });

  it("matches the score of subcriteria averages that are not round", () => {
    const ev = createEvaluation(sentaiProfile);
    for (const c of sentaiProfile.categories) {
      c.subcriteria.forEach((s, i) => (ev.categories[c.id].subcriteria[s].value = [7, 8, 8, 6, 9, 7][i % 6]));
    }
    const result = computeResult(sentaiProfile, ev);
    const link = encodeShare(sentaiProfile, result, { title: "", enjoyment: null, includeEnjoyment: false });
    const back = decodeShare(link, lookup);
    expect(back.ok).toBe(true);
    if (back.ok) expect(Math.abs((back.result.score as number) - (result.score as number))).toBeLessThan(0.001);
  });

  it("includes enjoyment only when asked", () => {
    const result = computeResult(sentaiProfile, make([...full]));
    expect(encodeShare(sentaiProfile, result, { title: "", enjoyment: 9, includeEnjoyment: false })).not.toContain("e=");
    expect(encodeShare(sentaiProfile, result, { title: "", enjoyment: 9, includeEnjoyment: true })).toContain("/e=9");
  });

  it("survives titles with slashes, accents, kanji and emoji", () => {
    const title = "Zyuden Sentai / キョウリュウジャー ñ 🦖 100%";
    const result = computeResult(sentaiProfile, make([...full]));
    const link = encodeShare(sentaiProfile, result, { title, enjoyment: null, includeEnjoyment: false });
    expect(link.split("/")).toHaveLength(4);
    const back = decodeShare(link, lookup);
    expect(back.ok && back.title).toBe(title);
  });

  it("cuts a very long title", () => {
    const result = computeResult(sentaiProfile, make([...full]));
    const link = encodeShare(sentaiProfile, result, { title: "x".repeat(500), enjoyment: null, includeEnjoyment: false });
    const back = decodeShare(link, lookup);
    expect(back.ok && back.title.length).toBe(MAX_TITLE);
  });

  it("accepts a leading #", () => {
    expect(decodeShare("#1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7", lookup).ok).toBe(true);
  });

  const bad: [string, string, string][] = [
    ["empty", "", "invalid"],
    ["garbage", "hello", "invalid"],
    ["newer version", "2/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7", "version"],
    ["version zero", "0/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7", "invalid"],
    ["unknown profile", "1/rider/8,7.5,7,7,8.5,9,8,7.5,6.5,7", "profile"],
    ["too few grades", "1/sentai/8,7.5,7", "invalid"],
    ["too many grades", "1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7,7", "invalid"],
    ["above scale", "1/sentai/11,7.5,7,7,8.5,9,8,7.5,6.5,7", "invalid"],
    ["negative", "1/sentai/-1,7.5,7,7,8.5,9,8,7.5,6.5,7", "invalid"],
    ["not a number", "1/sentai/a,7.5,7,7,8.5,9,8,7.5,6.5,7", "invalid"],
    ["too many decimals", "1/sentai/8.123456,7.5,7,7,8.5,9,8,7.5,6.5,7", "invalid"],
    ["nothing graded", "1/sentai/-,-,-,-,-,-,-,-,-,-", "invalid"],
    ["all not applicable", "1/sentai/n,n,n,n,n,n,n,n,n,n", "invalid"],
    ["unknown key", "1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7/x=1", "invalid"],
    ["repeated key", "1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7/e=1/e=2", "invalid"],
    ["bad enjoyment", "1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7/e=99", "invalid"],
    ["bad escape", "1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7/t=%E0%A4%A", "invalid"],
    ["too long", "1/sentai/8,7.5,7,7,8.5,9,8,7.5,6.5,7/t=" + "a".repeat(MAX_PAYLOAD), "invalid"],
  ];
  for (const [name, text, error] of bad) {
    it(`rejects: ${name}`, () => {
      const r = decodeShare(text, lookup);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toBe(error);
    });
  }

  it("does not read a prototype name as a profile", () => {
    expect(decodeShare("1/__proto__/8,7.5,7,7,8.5,9,8,7.5,6.5,7", (id) => ({ sentai: sentaiProfile } as Record<string, typeof sentaiProfile>)[id]).ok).toBe(false);
  });
});
