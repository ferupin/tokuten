import { z } from "zod";
import { evaluationSchema } from "./schema";
import { createEvaluation } from "./scoring";
import type { Evaluation, EvaluationMode, Profile } from "./types";

/**
 * Pure helpers for the browser draft. Nothing here touches the browser, so
 * the rules can be tested without one. Storage lives in the interface layer.
 */

export interface DraftEnvelope {
  app: "tokuten";
  kind: "draft";
  schema: 1;
  savedAt: string;
  evaluation: Evaluation;
}

export function toDraft(evaluation: Evaluation, savedAt: Date = new Date()): DraftEnvelope {
  return { app: "tokuten", kind: "draft", schema: 1, savedAt: savedAt.toISOString(), evaluation };
}

export type DraftParse = { ok: true; evaluation: Evaluation; savedAt: string } | { ok: false };

/** Reads a stored draft. Anything that does not match the profile is rejected. */
export function parseDraft(text: string | null, profile: Profile): DraftParse {
  if (!text) return { ok: false };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false };
  }
  const head = z
    .object({ app: z.literal("tokuten"), kind: z.literal("draft"), savedAt: z.string(), evaluation: z.unknown() })
    .safeParse(raw);
  if (!head.success) return { ok: false };
  const parsed = evaluationSchema(profile).safeParse(head.data.evaluation);
  if (!parsed.success) return { ok: false };
  return { ok: true, evaluation: parsed.data as Evaluation, savedAt: head.data.savedAt };
}

/**
 * True when nothing has been typed or graded. A blank evaluation is never
 * saved, so opening the app and leaving does not leave a draft behind.
 * The mode alone does not count as work.
 */
export function isBlank(profile: Profile, evaluation: Evaluation): boolean {
  const fresh = createEvaluation(profile);
  return canonical({ ...evaluation, mode: "detailed" }) === canonical({ ...fresh, mode: "detailed" });
}

/** JSON with sorted keys, so two equal objects compare equal whatever their key order. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Preferences kept apart from the draft, so they survive Start over. */
export interface Preferences {
  /** Whether the draft is kept in this browser. On unless turned off. */
  draft: boolean;
  mode: EvaluationMode | null;
  format: "standard" | "obsidian" | null;
}

export const defaultPreferences: Preferences = { draft: true, mode: null, format: null };

const preferencesSchema = z.object({
  draft: z.boolean().catch(true),
  mode: z.enum(["detailed", "quick"]).nullable().catch(null),
  format: z.enum(["standard", "obsidian"]).nullable().catch(null),
});

export function parsePreferences(text: string | null): Preferences {
  if (!text) return defaultPreferences;
  try {
    return preferencesSchema.parse(JSON.parse(text));
  } catch {
    return defaultPreferences;
  }
}
