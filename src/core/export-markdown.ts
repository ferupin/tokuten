import { formatGrade, gradeBand } from "./grades";
import type { Evaluation, EvaluationResult, Profile } from "./types";

/** Translation function. Receives a dotted key and optional values. */
export type Translate = (key: string, values?: Record<string, string | number>) => string;

/**
 * Renders an evaluation as Markdown following the Kijun output format:
 *
 * 1. Season identification and introduction
 * 2. Category evaluations with grades and reasoning
 * 3. Summary table
 * 4. Weighted calculation
 * 5. Official score
 * 6. Personal enjoyment, kept separate
 * 7. Conclusion
 */
export function exportMarkdown(
  profile: Profile,
  evaluation: Evaluation,
  result: EvaluationResult,
  t: Translate,
): string {
  const p = `profiles.${profile.id}`;
  const lines: string[] = [];
  const catName = (id: string) => t(`${p}.categories.${id}.name`);
  const na = t("export.notApplicable");
  const pending = t("export.notGraded");
  const out = result.categories;

  // 1. Identification
  lines.push(`# ${evaluation.title.trim() || t("export.untitled")}`);
  lines.push("");
  lines.push(`*${t(`${p}.name`)}*`);
  if (evaluation.introduction.trim()) {
    lines.push("");
    lines.push(evaluation.introduction.trim());
  }

  if (evaluation.mode === "quick") {
    lines.push("");
    lines.push(`> ${t("export.quickNote")}`);
  }

  // 2. Category evaluations
  lines.push("");
  lines.push(`## ${t("export.categoryEvaluations")}`);
  for (const c of out) {
    const entry = evaluation.categories[c.id];
    lines.push("");
    lines.push(`### ${catName(c.id)}`);
    lines.push("");
    if (c.status === "not-applicable") {
      lines.push(`**${t("export.grade")}:** ${na}`);
    } else if (c.grade === null) {
      lines.push(`**${t("export.grade")}:** ${pending}`);
    } else {
      lines.push(`**${t("export.grade")}:** ${formatGrade(c.grade)} / 10`);
    }

    if (c.status !== "not-applicable" && evaluation.mode !== "quick") {
      const rows = Object.entries(entry.subcriteria).filter(([, s]) => s.applicable && s.value !== null);
      if (rows.length > 0) {
        lines.push("");
        lines.push(`| ${t("export.subcriterion")} | ${t("export.grade")} |`);
        lines.push("|:---|---:|");
        for (const [id, s] of rows) {
          const name = t(`${p}.categories.${c.id}.subcriteria.${id}`).replace(/\|/g, "\\|");
          lines.push(`| ${name} | ${formatGrade(s.value as number)} |`);
        }
      }
    }
    if (entry.notes.trim()) {
      lines.push("");
      lines.push(entry.notes.trim());
    }
  }

  // 3. Summary table
  lines.push("");
  lines.push(`## ${t("export.summary")}`);
  lines.push("");
  lines.push(`| ${t("export.category")} | ${t("export.grade")} | ${t("export.weight")} |`);
  lines.push("|---|---:|---:|");
  for (const c of out) {
    const grade =
      c.status === "not-applicable" ? na : c.grade === null ? pending : formatGrade(c.grade);
    const weight =
      c.status === "not-applicable" ? "0%" : `${formatGrade(c.effectiveWeight, c.effectiveWeight % 1 === 0 ? 0 : 2)}%`;
    lines.push(`| ${catName(c.id)} | ${grade} | ${weight} |`);
  }

  // 4. Calculation
  lines.push("");
  lines.push(`## ${t("export.calculation")}`);
  lines.push("");
  const parts: string[] = [];
  for (const c of out) {
    if (c.status !== "graded" || c.grade === null || c.contribution === null) continue;
    const w = formatGrade(c.effectiveWeight, c.effectiveWeight % 1 === 0 ? 0 : 2);
    parts.push(`- ${catName(c.id)}: ${formatGrade(c.grade)} × ${w}% = ${formatGrade(c.contribution, 2)}`);
  }
  lines.push(...parts);
  if (result.redistributed) {
    lines.push("");
    lines.push(`> ${t("export.redistributed", { count: result.applicableCount })}`);
  }
  if (!result.complete) {
    lines.push("");
    lines.push(`> ${t("export.partial", { graded: result.gradedCount, total: result.applicableCount })}`);
  }

  // 5. Official score
  lines.push("");
  lines.push(`## ${t("export.officialScore")}`);
  lines.push("");
  if (result.score === null) {
    lines.push(pending);
  } else {
    lines.push(`**${formatGrade(result.score, 2)} / 10** (${t(`grades.${gradeBand(result.score)}`)})`);
  }

  // 6. Personal enjoyment
  lines.push("");
  lines.push(`## ${t("export.personalEnjoyment")}`);
  lines.push("");
  if (evaluation.enjoyment === null) {
    lines.push(pending);
  } else {
    lines.push(`**${formatGrade(evaluation.enjoyment)} / 10**`);
  }
  lines.push("");
  lines.push(`*${t("export.separateNote")}*`);

  // 7. Conclusion
  lines.push("");
  lines.push(`## ${t("export.conclusion")}`);
  if (evaluation.conclusion.trim()) {
    lines.push("");
    lines.push(evaluation.conclusion.trim());
  }

  // 8. Consistency checklist, only when the author ticked something
  if (evaluation.checked.length > 0) {
    lines.push("");
    lines.push(`## ${t("export.checklist")}`);
    lines.push("");
    lines.push(`*${t("export.checklistCount", { done: evaluation.checked.length, total: profile.checklist.length })}*`);
    lines.push("");
    for (const id of profile.checklist) {
      lines.push(`- [${evaluation.checked.includes(id) ? "x" : " "}] ${t(`${p}.checklist.${id}`)}`);
    }
  }

  return lines.join("\n") + "\n";
}
