import { round } from "./grades";
import { computeResult, createEvaluation } from "./scoring";
import type { Evaluation, EvaluationResult, Profile } from "./types";

/**
 * The share link payload.
 *
 * It travels in the part of the address after `#`, which a browser never sends
 * to a server. It is short, plain text a person can read:
 *
 *   1/sentai/8,7.5,7,-,n,9,8,7.5,6.5,7/e=8.5/t=Kaizoku%20Sentai
 *
 * Segments, separated by `/`:
 *   1. the format version
 *   2. the profile id
 *   3. one grade per category, in profile order. `n` means not applicable and
 *      `-` means not graded yet
 *   4. optional `e=` personal enjoyment, only when the sender chose to include it
 *   5. optional `t=` season title, percent encoded
 *
 * The link holds grades and never the score, so the receiving side calculates
 * the score with the same engine and the two cannot disagree. The introduction,
 * the notes and the conclusion are not part of it.
 */
export const SHARE_VERSION = 1;
export const MAX_TITLE = 120;
/** Longest fragment accepted when reading a link. Real links are far shorter. */
export const MAX_PAYLOAD = 1200;

const GRADE = /^\d{1,2}(\.\d{1,4})?$/;

export interface ShareInput {
  title: string;
  enjoyment: number | null;
  includeEnjoyment: boolean;
}

const num = (value: number) => String(round(value, 4));

/** Encodes a result as a link fragment, without the leading `#`. */
export function encodeShare(profile: Profile, result: EvaluationResult, input: ShareInput): string {
  const grades = result.categories
    .map((c) => (c.status === "not-applicable" ? "n" : c.grade === null ? "-" : num(c.grade)))
    .join(",");
  const parts = [String(SHARE_VERSION), profile.id, grades];
  if (input.includeEnjoyment && input.enjoyment !== null) parts.push(`e=${num(input.enjoyment)}`);
  const title = input.title.trim().slice(0, MAX_TITLE);
  if (title) parts.push(`t=${encodeURIComponent(title)}`);
  return parts.join("/");
}

export type ShareError = "invalid" | "version" | "profile";

export type DecodedShare =
  | { ok: true; profile: Profile; title: string; enjoyment: number | null; evaluation: Evaluation; result: EvaluationResult }
  | { ok: false; error: ShareError };

const fail = (error: ShareError): DecodedShare => ({ ok: false, error });

/**
 * Reads a link fragment. Anything that does not fit is rejected, so a damaged
 * or hand written link can never produce a half valid card.
 */
export function decodeShare(fragment: string, lookup: (id: string) => Profile | undefined): DecodedShare {
  const text = fragment.startsWith("#") ? fragment.slice(1) : fragment;
  if (!text || text.length > MAX_PAYLOAD) return fail("invalid");

  const parts = text.split("/");
  if (parts.length < 3 || parts.length > 5) return fail("invalid");
  const [version, profileId, gradeText, ...extras] = parts;

  if (!/^\d+$/.test(version)) return fail("invalid");
  if (Number(version) > SHARE_VERSION) return fail("version");
  if (Number(version) !== SHARE_VERSION) return fail("invalid");

  const profile = lookup(profileId);
  // The id must match, so a name such as __proto__ never resolves to something that is not a profile.
  if (!profile || profile.id !== profileId || !Array.isArray(profile.categories)) return fail("profile");

  const tokens = gradeText.split(",");
  if (tokens.length !== profile.categories.length) return fail("invalid");

  const evaluation = createEvaluation(profile);
  evaluation.mode = "quick";
  const { min, max } = profile.scale;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const entry = evaluation.categories[profile.categories[i].id];
    if (token === "n") {
      entry.applicable = false;
    } else if (token === "-") {
      continue;
    } else {
      if (!GRADE.test(token)) return fail("invalid");
      const value = Number(token);
      if (value < min || value > max) return fail("invalid");
      entry.override = value;
    }
  }

  let enjoyment: number | null = null;
  let title = "";
  const seen = new Set<string>();
  for (const extra of extras) {
    const eq = extra.indexOf("=");
    if (eq < 1) return fail("invalid");
    const key = extra.slice(0, eq);
    const value = extra.slice(eq + 1);
    if (seen.has(key)) return fail("invalid");
    seen.add(key);
    if (key === "e") {
      if (!GRADE.test(value)) return fail("invalid");
      const n = Number(value);
      if (n < min || n > max) return fail("invalid");
      enjoyment = n;
    } else if (key === "t") {
      try {
        title = decodeURIComponent(value).slice(0, MAX_TITLE);
      } catch {
        return fail("invalid");
      }
    } else {
      return fail("invalid");
    }
  }

  evaluation.title = title;
  evaluation.enjoyment = enjoyment;
  const result = computeResult(profile, evaluation);
  if (result.score === null) return fail("invalid");
  return { ok: true, profile, title, enjoyment, evaluation, result };
}
