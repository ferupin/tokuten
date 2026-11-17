# 0013. A sensitivity view that describes the method

## Status

Accepted, version 1.2.0.

## Context

The result shows the score and the points each category contributed. That says how much each category weighs now. It does not say how much the score would still move because of each one. People asked where a grade matters most.

The risk is in how it reads. A list of "what moves the score most" can be taken as advice to grade where it pays. The tool exists to form a consistent judgment, not to tune a number.

## Decision

A closed section under the result, opened only by whoever wants it. Each graded category shows how much the shown score moves for one point of grade, as a bar and a number, with the heaviest first.

- **It is the weight made visible.** The score is a weighted average of the graded categories, so one more point in a category moves it by that category's share of the graded weight. The figure is exact and needs no simulation. It does not depend on the grades, only on which categories count, and a test checks it against the real change of the score.
- **It follows the score that is shown.** While some categories are still ungraded, the figures are relative to the graded ones, and the section says so. Ungraded categories are listed as such and have no figure, because grading them would change everyone else's share.
- **Not applicable categories are left out.** Their weight is shared by the others, so the figures of the others rise. The section says so when it happens.
- **The room to rise is shown.** For each category, how much it could still add if it went to 10. It is a plain consequence of the weight. The section states, in its own text, that it describes the method and does not suggest a grade.
- **Closed by default.** The result page already holds a lot, and this is a second reading for those who ask for it. It is a native `details` element, so it works from the keyboard and with screen readers without extra code.
- **A top three share appears with four or more graded categories.** With fewer, the share says nothing.
- **It never reaches the score, the exports or the share card.** It is a view, and the file format is not touched.

## Consequences

- One pure function in `src/core/sensitivity.ts`, with tests, and one component. No change to scoring or to the file format.
- New wording in every language, which each dictionary keeps in its own voice.
- Another profile gets the view for free, since it reads the weights from the profile.

## Alternatives considered

- **A column in the breakdown table.** Rejected: the table is already dense, and the figure would be read as a result.
- **A scenario simulator, where grades can be changed to see the score.** Rejected: it invites tuning, and it is a different tool.
- **A page of its own.** Rejected: it hides the view from the result it explains.
