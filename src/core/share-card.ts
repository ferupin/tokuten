import type { Translate } from "./export-markdown";
import { formatGrade, gradeBand } from "./grades";
import type { EvaluationResult, Profile } from "./types";

/**
 * The data a shared card is allowed to show.
 *
 * Nothing else reaches the drawing code. The introduction, the notes of each
 * category and the conclusion are not parameters of the builder, so no layout
 * can print them by mistake. Personal enjoyment is opt in.
 */
export interface CardRow {
  id: string;
  /** Short category name, for example "Story". */
  name: string;
  /** Pillar kanji, decoration only. The name carries the meaning. */
  kanji: string;
  tone: "red" | "blue" | "yellow" | "green" | "pink";
  /** Null when not graded or not applicable. */
  grade: number | null;
  gradeText: string;
}

export interface CardData {
  profileName: string;
  title: string;
  titleIsPlaceholder: boolean;
  score: number;
  scoreText: string;
  band: string;
  hint: string;
  complete: boolean;
  /** Caption that sits next to the seal, in words. */
  caption: string;
  rows: CardRow[];
  enjoyment: { label: string; valueText: string; note: string } | null;
  footer: string;
  /** Text version of the card, for screen readers. */
  description: string;
}

export interface CardInput {
  title: string;
  /** Personal enjoyment, used only when includeEnjoyment is true. */
  enjoyment: number | null;
  includeEnjoyment: boolean;
}

export const DASH = "–";

/** Whether there is anything worth sharing. */
export const canShare = (result: EvaluationResult): boolean => result.score !== null;

/** Builds the card data, or null when nothing is graded yet. */
export function buildCardData(
  profile: Profile,
  result: EvaluationResult,
  input: CardInput,
  t: Translate,
): CardData | null {
  if (result.score === null) return null;
  const p = `profiles.${profile.id}`;
  const clean = input.title.trim();
  const title = clean || t("result.untitled");
  const band = t(`grades.${gradeBand(result.score)}`);
  const complete = result.complete;

  const rows: CardRow[] = result.categories.map((c) => {
    const cat = profile.categories.find((x) => x.id === c.id)!;
    const pillar = profile.pillars.find((x) => x.id === cat.pillarId)!;
    const grade = c.status === "graded" ? c.grade : null;
    return {
      id: c.id,
      name: t(`${p}.categories.${c.id}.short`),
      kanji: pillar.kanji,
      tone: pillar.tone,
      grade,
      gradeText: grade === null ? DASH : formatGrade(grade),
    };
  });

  const enjoyment =
    input.includeEnjoyment && input.enjoyment !== null
      ? { label: t("share.cardEnjoyment"), valueText: formatGrade(input.enjoyment), note: t("share.cardSeparate") }
      : null;

  const caption = complete
    ? t("share.cardComplete")
    : t("share.cardPartial", { graded: result.gradedCount, total: result.applicableCount });
  const scoreText = formatGrade(result.score, 1);

  const list = rows.map((r) => `${r.name} ${r.grade === null ? t("share.altNotGraded") : r.gradeText}`).join(", ");
  const description = [
    t("share.altCard", { title, profile: t(`${p}.name`), score: scoreText, band, status: caption }),
    t("share.altGrades", { list }),
    enjoyment ? t("share.altEnjoyment", { value: enjoyment.valueText }) : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    profileName: t(`${p}.name`),
    title,
    titleIsPlaceholder: !clean,
    score: result.score,
    scoreText,
    band,
    hint: t(`gradeHints.${gradeBand(result.score)}`),
    complete,
    caption,
    rows,
    enjoyment,
    footer: t("share.cardFooter", { count: profile.categories.length }),
    description,
  };
}
