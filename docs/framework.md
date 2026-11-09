# The Kijun method

Kijun 基準 means standard or criterion. It is the evaluation method behind Tokuten. This page describes the Super Sentai profile as it is implemented.

## Philosophy

Each season is judged on its own merits, with the same criteria every time. Nostalgia, popularity and influence do not raise a grade, and age or production limits do not lower one. The goal is to measure what a season sets out to do and how well it does it.

## The scale

Grades go from 0 to 10 and can have decimals, such as 7.5 or 8.2.

| Grade | Label |
|---:|---|
| 10 | Masterpiece |
| 9 | Outstanding |
| 8 | Great |
| 7 | Good |
| 6 | Fine |
| 5 | Average |
| 4 | Mediocre |
| 3 | Poor |
| 2 | Very Poor |
| 1 | Terrible |
| 0 | Abysmal |

The reference points that matter most are 5 (an ordinary, acceptable level), 6 (reasonably good, with some clear strengths) and 7 (clearly above average).

A score belongs to the band of its nearest whole number, and a half rounds up. So 4.5 is Average, 5.49 is Average and 5.5 is Fine.

## Categories and weights

| Category | Pillar | Weight |
|---|---|---:|
| Theme & Concept | Concept 青 | 8% |
| Suits & Visual Design | Visual 黄 | 8% |
| Mecha & Arsenal | Visual 黄 | 8% |
| Story & Lore | Narrative 赤 | 14% |
| Characters & Development | Narrative 赤 | 14% |
| Squad Chemistry & Dynamics | Narrative 赤 | 12% |
| Music & Soundtrack | Rhythm 桃 | 8% |
| Action & Choreography | Craft 緑 | 10% |
| Production & Direction | Craft 緑 | 8% |
| Pacing & Overall Execution | Rhythm 桃 | 10% |
| **Total** | | **100%** |

Pillars are only a visual grouping. They do not affect the calculation.

## How a category grade is produced

1. Each category has its own subcriteria, for example Story & Lore has structure, worldbuilding, continuity, plot development, conflicts and resolution.
2. You grade the subcriteria that apply. A subcriterion marked as not applicable is left out.
3. The category grade is the average of the graded subcriteria.
4. If you prefer, you can set the category grade by hand. A manual grade replaces the average.

Each category also shows a short note about what it covers and what belongs to a neighboring category. This is there to prevent double counting. A great soundtrack, for example, should never raise the Story & Lore grade.

## Two ways to enter grades

The method has two modes. They differ only in how a category grade is entered. The weights, the not applicable rules and the official score are the same.

- **Detailed (詳細).** Grade the subcriteria and let the average become the category grade. This is the full process described above.
- **Quick (簡易).** Set the category grade directly with one slider. Each slider shows the grade band and its description, so a quick grade still has an anchor, and the guidance for the category stays one click away.

Switching modes keeps every grade. If a category already has subcriteria grades, Quick mode starts from their average. Moving the slider replaces that average with a direct grade, and one button returns to the average. The Markdown export states when an evaluation was quick and leaves the subcriteria out.

A quick grade is a faster way to reach the same judgment, not a looser one. The consistency checklist below applies to both modes.

## The official score

```
Score = sum(grade x effective weight) / 100
```

With nothing removed, the effective weight is the weight in the table. Story & Lore at 8.0 contributes 8.0 x 14 / 100 = 1.12 points.

### Categories that do not apply

When something cannot be evaluated for a season, mark the category as not applicable and explain why in the notes. The method does not invent a grade. Instead, the weight of that category is shared among the others in proportion to their own weights.

For example, if Music & Soundtrack (8%) is removed, the remaining weight is 92%. Story & Lore then counts for 14 / 92, which is about 15.2% of the score.

### Partial scores

A category that applies but has no grade yet is left out of the calculation, and the score is marked as partial. It becomes complete once every applicable category has a grade.

## Personal enjoyment

Personal enjoyment is a separate number. It says how much you enjoyed watching the season. It can differ from the official score, and that is expected. It is never used in the calculation, and the official score is never adjusted to match it.

## Reading the number

A score summarizes a season, it does not replace it. In this method a 6 is fine and a 7 is good. Both are solid results, and what usually separates them from higher grades is depth, ambition or consistency, not quality.

The app reflects this with a small note under the score. Its tone changes with the range, and it adds a line when the category grades are very close together or very far apart, because two seasons with the same score can feel very different. The note is only commentary. It never changes the score.

## Consistency checklist

Before finishing an evaluation, check that you did the following:

- No bonus for nostalgia.
- No penalty for age or production limits.
- Judged what the season attempts and how well it succeeds.
- Kept an interesting concept apart from its execution.
- Did not confuse quantity with quality.
- Did not count the same strength or weakness in more than one category.
- Considered the whole season, not only its best or worst episodes.
- Supported each judgment with concrete examples.
- Did not inflate a grade because the season is popular.
- Did not force a low grade just to look objective.

## Output format

The Markdown export follows this order:

1. Season identification and introduction.
2. Each category with its grade and reasoning.
3. A summary table with all grades and weights.
4. The weighted calculation.
5. The official score.
6. The personal enjoyment score, kept separate.
7. The conclusion, covering strongest and weakest aspects.
