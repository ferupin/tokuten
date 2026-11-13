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
    // Files exported before modes existed have no mode, and were detailed.
    mode: z.enum(["detailed", "quick"]).default("detailed"),
    title: z.string(),
    introduction: z.string(),
    conclusion: z.string(),
    enjoyment: grade(profile).nullable(),
    // Files saved before the checklist existed have none.
    checked: z
      .array(z.string())
      .default([])
      .transform((ids) => profile.checklist.filter((id) => ids.includes(id))),
    categories: z.object(categoryShape),
  });
}

/** Envelope written to disk when exporting JSON. */
export interface ExportEnvelope {
  app: "tokuten";
  schema: typeof FILE_SCHEMA;
  exportedAt: string;
  evaluation: Evaluation;
}

export function toEnvelope(evaluation: Evaluation, exportedAt: Date = new Date()): ExportEnvelope {
  return { app: "tokuten", schema: FILE_SCHEMA, exportedAt: exportedAt.toISOString(), evaluation };
}

export type ParseResult =
  | { ok: true; evaluation: Evaluation }
  | { ok: false; error: "invalidJson" | "notTokuten" | "newerSchema" | "invalidShape" };

/** Version of the file envelope this build writes and the newest it can read. */
export const FILE_SCHEMA = 1;

/** Parses the text of an exported JSON file for a known profile. */
export function parseEnvelope(text: string, profile: Profile): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "invalidJson" };
  }
  const envelope = z.object({ app: z.literal("tokuten"), schema: z.unknown().optional(), evaluation: z.unknown() }).safeParse(raw);
  if (!envelope.success) return { ok: false, error: "notTokuten" };
  // A file from a newer format is refused with its own message, never half read.
  const version = envelope.data.schema;
  if (typeof version === "number" && version > FILE_SCHEMA) return { ok: false, error: "newerSchema" };

  const parsed = evaluationSchema(profile).safeParse(envelope.data.evaluation);
  if (!parsed.success) return { ok: false, error: "invalidShape" };
  return { ok: true, evaluation: parsed.data as Evaluation };
}
