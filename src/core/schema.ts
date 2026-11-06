import { z } from "zod";
import type { Evaluation, Profile } from "./types";

const grade = (profile: Profile) => z.number().min(profile.scale.min).max(profile.scale.max);

/** Builds a validator for evaluations of a given profile. Used for JSON import. */
export function evaluationSchema(profile: Profile) {
  const categoryShape = Object.fromEntries(
    profile.categories.map((category) => {
      const subs = Object.fromEntries(
        category.subcriteria.map((id) => [
          id,
          z.object({ value: grade(profile).nullable(), applicable: z.boolean() }),
        ]),
      );
      return [
        category.id,
        z.object({
          applicable: z.boolean(),
          override: grade(profile).nullable(),
          notes: z.string(),
          subcriteria: z.object(subs),
        }),
      ];
    }),
  );

  return z.object({
    profileId: z.literal(profile.id),
    profileVersion: z.number().int().positive(),
    title: z.string(),
    introduction: z.string(),
    conclusion: z.string(),
    enjoyment: grade(profile).nullable(),
    categories: z.object(categoryShape),
  });
}

/** Envelope written to disk when exporting JSON. */
export interface ExportEnvelope {
  app: "tokuten";
  schema: 1;
  exportedAt: string;
  evaluation: Evaluation;
}

export function toEnvelope(evaluation: Evaluation, exportedAt: Date = new Date()): ExportEnvelope {
  return { app: "tokuten", schema: 1, exportedAt: exportedAt.toISOString(), evaluation };
}

export type ParseResult =
  | { ok: true; evaluation: Evaluation }
  | { ok: false; error: string };

/** Parses the text of an exported JSON file for a known profile. */
export function parseEnvelope(text: string, profile: Profile): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "invalidJson" };
  }
  const envelope = z.object({ app: z.literal("tokuten"), evaluation: z.unknown() }).safeParse(raw);
  if (!envelope.success) return { ok: false, error: "notTokuten" };

  const parsed = evaluationSchema(profile).safeParse(envelope.data.evaluation);
  if (!parsed.success) return { ok: false, error: "invalidShape" };
  return { ok: true, evaluation: parsed.data as Evaluation };
}
