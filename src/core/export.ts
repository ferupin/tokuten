import { exportMarkdown, type Translate } from "./export-markdown";
import { exportObsidian, type ObsidianOptions } from "./export-obsidian";
import type { Evaluation, EvaluationResult, Profile } from "./types";

/**
 * - standard: plain Markdown that renders anywhere, such as a forum or GitHub.
 * - obsidian: adds properties, callouts and a Mermaid chart for Obsidian.
 */
export type ExportFormat = "standard" | "obsidian";

export const EXPORT_FORMATS: readonly ExportFormat[] = ["standard", "obsidian"];

export function exportAs(
  format: ExportFormat,
  profile: Profile,
  evaluation: Evaluation,
  result: EvaluationResult,
  t: Translate,
  options: ObsidianOptions = {},
): string {
  return format === "obsidian"
    ? exportObsidian(profile, evaluation, result, t, options)
    : exportMarkdown(profile, evaluation, result, t);
}
