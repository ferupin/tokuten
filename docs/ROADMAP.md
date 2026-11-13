# Roadmap

What is planned for Tokuten, in the order it is likely to happen. Nothing here is a promise and nothing has a date. The history of what shipped is in [CHANGELOG.md](CHANGELOG.md).

Each item has a rough size: small is a few hours, medium is a few days, large is a project of its own. Items marked **help welcome** are good places to join in. Open an issue first, so the idea and the approach are agreed before the work starts.

## Next

## Toward 1.0

The 1.0 mark is a promise that the method, the file format and the core of the interface are stable. It needs:

1. The grade anchors written, so the meaning of a grade stops changing.
2. A JSON format that old files keep opening with.
3. Sharing delivered. Done in 0.9.1 (image) and 0.10.0 (link).
4. English, Portuguese and Spanish complete. Done in 0.8.0, and kept complete by tests.

## Method

- **Grade anchors per category.** Short texts that say what a 3, a 5 and an 8 look like in each category. They change how scores are read, so they are written together with the method. Size: medium. Help welcome, as a discussion.
- **Sensitivity view.** How much each category moves the final score, to show where a grade matters most. Size: medium.

## Profiles

- **Kamen Rider.** A profile is plain data, so the scoring code does not change. The categories, weights and subcriteria need a discussion first. Size: medium. Help welcome.
- Other franchises follow the same path.

## Languages

Open to the community, now that a language is one file and one line ([ADR 0011](adr/0011-language-registry.md)): Japanese, French, German and others. Neutral, slightly formal wording is the goal. Size: medium per language. Help welcome.

## Interface

- **Compare seasons.** Two or more seasons side by side, from imported JSON files. Size: large.
- **Keyboard shortcuts.** Grade and mark not applicable without the mouse. Size: small to medium. Help welcome.
- **Accessibility pass.** A check with screen readers and with keyboard only, across every page. Size: small. Help welcome.

## Not planned

- Accounts, a database or any server logic. The app stays a static site, and a draft or a JSON file is how work is kept.
- Scores from other people or rankings. The tool is for forming your own judgment in a consistent way.
