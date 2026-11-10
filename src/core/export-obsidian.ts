import type { Translate } from "./export-markdown";
import { formatGrade, gradeBand } from "./grades";
import type { Evaluation, EvaluationResult, Profile } from "./types";

export interface ObsidianOptions {
  /** Export date as YYYY-MM-DD. Omitted from the properties when not given. */
  date?: string;
}

/** Ten cell text gauge, for example "███████░░░" for a 7. */
export function gauge(value: number, max = 10): string {
  const filled = Math.max(0, Math.min(10, Math.round((value / max) * 10)));
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

/** Quoted YAML string. JSON strings are valid YAML double quoted scalars. */
const yamlString = (value: string) => JSON.stringify(value);

/** Escapes pipes so text stays inside one table cell. */
const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

/** Prefixes every line so the text sits inside a callout. */
function inCallout(lines: string[]): string[] {
  return lines.map((l) => (l === "" ? ">" : `> ${l}`));
}

const pct = (w: number) => `${formatGrade(w, w % 1 === 0 ? 0 : 2)}%`;

/**
 * Renders an evaluation as Obsidian flavored Markdown.
 *
 * Same content and same order as the standard export, with Obsidian features
 * on top: properties (YAML frontmatter), callouts, collapsible categories,
 * tables, a text gauge, a Mermaid chart, highlights and a hidden comment.
 * The personal enjoyment score stays outside the official calculation.
 */
export function exportObsidian(
  profile: Profile,
  evaluation: Evaluation,
  result: EvaluationResult,
  t: Translate,
  options: ObsidianOptions = {},
): string {
  const p = `profiles.${profile.id}`;
  const catName = (id: string) => t(`${p}.categories.${id}.name`);
  const na = t("export.notApplicable");
  const pending = t("export.notGraded");
  const title = evaluation.title.trim() || t("export.untitled");
  const out = result.categories;
  const pillarKanji = (pillarId: string) => profile.pillars.find((x) => x.id === pillarId)?.kanji ?? "";
  const pillarOf = (catId: string) => profile.categories.find((c) => c.id === catId)?.pillarId ?? "";
  const lines: string[] = [];

  // Properties
  const status = result.score === null ? "empty" : result.complete ? "complete" : "partial";
  lines.push("---");
  lines.push(`title: ${yamlString(title)}`);
  lines.push(`profile: ${profile.id}`);
  lines.push(`profile_version: ${evaluation.profileVersion}`);
  lines.push(`mode: ${evaluation.mode}`);
  lines.push(`status: ${status}`);
  if (result.score !== null) {
    lines.push(`score: ${formatGrade(result.score, 2)}`);
    lines.push(`band: ${yamlString(t(`grades.${gradeBand(result.score)}`))}`);
  }
  if (evaluation.enjoyment !== null) lines.push(`enjoyment: ${formatGrade(evaluation.enjoyment)}`);
  if (options.date) lines.push(`exported: ${options.date}`);
  lines.push("tags:");
  lines.push("  - tokuten");
  lines.push(`  - tokuten/${profile.id}`);
  lines.push("cssclasses:");
  lines.push("  - tokuten");
  lines.push("---");
  lines.push("");
  lines.push(`%% ${t("export.generatedBy")} %%`);
  lines.push("");

  // 1. Identification
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`*${t(`${p}.name`)}*`);
  if (evaluation.introduction.trim()) {
    lines.push("");
    lines.push(evaluation.introduction.trim());
  }

  // Overview callout with both scores, kept visibly apart
  lines.push("");
  const overview: string[] = [];
  if (result.score === null) {
    overview.push(pending);
  } else {
    overview.push(`==${formatGrade(result.score, 2)} / 10== (${t(`grades.${gradeBand(result.score)}`)})`);
    overview.push(`\`${gauge(result.score)}\``);
  }
  overview.push("");
  if (evaluation.enjoyment === null) {
    overview.push(`${t("export.personalEnjoyment")}: ${pending}`);
  } else {
    overview.push(`${t("export.personalEnjoyment")}: **${formatGrade(evaluation.enjoyment)} / 10**`);
  }
  overview.push(`*${t("export.separateNote")}*`);
  lines.push(`> [!abstract] ${t("export.officialScore")}`);
  lines.push(...inCallout(overview));

  if (evaluation.mode === "quick") {
    lines.push("");
    lines.push(`> [!info] ${t("export.quickTitle")}`);
    lines.push(...inCallout([t("export.quickNote")]));
  }
  if (result.redistributed) {
    lines.push("");
    lines.push(`> [!info] ${t("export.redistributedTitle")}`);
    lines.push(...inCallout([t("export.redistributed", { count: result.applicableCount })]));
  }
  if (!result.complete) {
    lines.push("");
    lines.push(`> [!warning] ${t("export.partialTitle")}`);
    lines.push(...inCallout([t("export.partial", { graded: result.gradedCount, total: result.applicableCount })]));
  }

  // 2. Category evaluations, one collapsible callout each
  lines.push("");
  lines.push(`## ${t("export.categoryEvaluations")}`);
  for (const c of out) {
    const entry = evaluation.categories[c.id];
    const mark = pillarKanji(pillarOf(c.id));
    const head = `${mark ? `${mark} ` : ""}${catName(c.id)}`;
    const body: string[] = [];
    let type = "note";
    let fold = "+";
    let value: string;

    if (c.status === "not-applicable") {
      value = na;
      fold = "-";
    } else if (c.grade === null) {
      value = pending;
      type = "question";
    } else {
      value = `${formatGrade(c.grade)} / 10`;
      body.push(`\`${gauge(c.grade)}\` ${t("export.weight")}: ${pct(c.effectiveWeight)}`);
    }

    if (c.status !== "not-applicable" && evaluation.mode !== "quick") {
      const rows = Object.entries(entry.subcriteria).filter(([, s]) => s.applicable && s.value !== null);
      if (rows.length > 0) {
        body.push("");
        for (const [id, s] of rows) {
          body.push(`- ${t(`${p}.categories.${c.id}.subcriteria.${id}`)}: ${formatGrade(s.value as number)}`);
        }
      }
    }
    if (entry.notes.trim()) {
      if (body.length > 0) body.push("");
      body.push(...entry.notes.trim().split(/\r?\n/));
    }

    lines.push("");
    lines.push(`> [!${type}]${fold} ${head} · ${value}`);
    if (body.length > 0) lines.push(...inCallout(body));
  }

  // 3. Summary table
  lines.push("");
  lines.push(`## ${t("export.summary")}`);
  lines.push("");
  lines.push(`| ${t("export.category")} | ${t("export.grade")} | ${t("export.weight")} |  |`);
  lines.push("|:---|---:|---:|:---|");
  for (const c of out) {
    const grade = c.status === "not-applicable" ? na : c.grade === null ? pending : formatGrade(c.grade);
    const weight = c.status === "not-applicable" ? "0%" : pct(c.effectiveWeight);
    const bar = c.grade === null ? "" : `\`${gauge(c.grade)}\``;
    lines.push(`| ${cell(catName(c.id))} | ${grade} | ${weight} | ${bar} |`);
  }

  // 4. Calculation
  const graded = out.filter((c) => c.status === "graded" && c.grade !== null && c.contribution !== null);
  lines.push("");
  lines.push(`## ${t("export.calculation")}`);
  lines.push("");
  lines.push(`| ${t("export.category")} | ${t("export.grade")} | ${t("export.weight")} | ${t("export.contribution")} |`);
  lines.push("|:---|---:|---:|---:|");
  for (const c of graded) {
    lines.push(
      `| ${cell(catName(c.id))} | ${formatGrade(c.grade as number)} | ${pct(c.effectiveWeight)} | ${formatGrade(c.contribution as number, 2)} |`,
    );
  }

  const shares = graded.filter((c) => (c.contribution as number) > 0);
  if (shares.length > 0) {
    lines.push("");
    lines.push("```mermaid");
    lines.push(`pie showData title ${t("export.composition")}`);
    for (const c of shares) {
      lines.push(`  "${catName(c.id).replace(/"/g, "'")}" : ${formatGrade(c.contribution as number, 2)}`);
    }
    lines.push("```");
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
  lines.push(evaluation.enjoyment === null ? pending : `**${formatGrade(evaluation.enjoyment)} / 10**`);
  lines.push("");
  lines.push(`*${t("export.separateNote")}*`);

  // 7. Conclusion
  lines.push("");
  lines.push(`## ${t("export.conclusion")}`);
  if (evaluation.conclusion.trim()) {
    lines.push("");
    lines.push(evaluation.conclusion.trim());
  }

  return lines.join("\n") + "\n";
}
