import { describe, expect, it } from "vitest";
import { profileList, profiles } from "@/profiles";
import { parseDraft, toDraft } from "./draft";
import { parseEnvelope, toEnvelope } from "./schema";
import { computeResult, createEvaluation } from "./scoring";
import { decodeShare, encodeShare } from "./share-link";
import { getProfile } from "@/profiles";

const lookup = (id: string) => (Object.hasOwn(profiles, id) ? profiles[id] : undefined);
const rider = getProfile("kamen-rider");
const sentai = getProfile("sentai");
const grades = [8, 7.5, 7, 7, 8.5, 9, 8, 7.5, 6.5, 7];

function graded(profile: typeof rider) {
  const ev = createEvaluation(profile);
  ev.title = "Kamen Rider Build";
  profile.categories.forEach((c, i) => (ev.categories[c.id].override = grades[i]));
  return ev;
}

describe("several profiles side by side", () => {
  it("scores the same grades the same way in every profile, since the weights match", () => {
    const scores = profileList.map((p) => computeResult(p, graded(p)).score);
    expect(scores[0]).toBeCloseTo(scores[1]!, 10);
  });

  it("round trips a Kamen Rider result through a share link, with a hyphen in the id", () => {
    const ev = graded(rider);
    const result = computeResult(rider, ev);
    const link = encodeShare(rider, result, { title: ev.title, enjoyment: null, includeEnjoyment: false });
    expect(link.startsWith("1/kamen-rider/")).toBe(true);
    const back = decodeShare(link, lookup);
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(back.profile.id).toBe("kamen-rider");
      expect(back.result.score).toBeCloseTo(result.score!, 10);
    }
  });

  it("round trips a Kamen Rider file and keeps a file of one profile out of the other", () => {
    const text = JSON.stringify(toEnvelope(graded(rider)));
    expect(parseEnvelope(text, rider).ok).toBe(true);
    expect(parseEnvelope(text, sentai).ok).toBe(false);
  });

  it("keeps a draft of one profile out of the other", () => {
    const text = JSON.stringify(toDraft(graded(rider)));
    expect(parseDraft(text, rider).ok).toBe(true);
    expect(parseDraft(text, sentai).ok).toBe(false);
  });
});
