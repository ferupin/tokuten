# Roadmap

What is planned for Tokuten, in the order it is likely to happen. Nothing here is a promise and nothing has a date. The history of what shipped is in [CHANGELOG.md](CHANGELOG.md).

Each item has a rough size: small is a few hours, medium is a few days, large is a project of its own. Items marked **help welcome** are good places to join in. Open an issue first, so the idea and the approach are agreed before the work starts.

## Next

- **Community review of the Kamen Rider profile.** It shipped in 1.3.0 as provisional. People who know the series can open a profile review, and each accepted change is recorded in [ADR 0014](adr/0014-kamen-rider-profile.md). Size: ongoing. Help welcome.

## Version 1.0

Reached on 2026-11-15. It is a promise that the method, the file format and the core of the interface are stable. In short, a file saved today opens in every 1.x release with the same grades and the same score, and a calculation or a profile only changes in a new, announced version. The full terms are in [file-format.md](file-format.md), and a test enforces them.

What made it possible, for the record:

1. The grade anchors written, so the meaning of a grade stops changing (0.12.0).
2. A JSON format that old files keep opening with (0.11.0).
3. Sharing delivered, as an image (0.9.1), a link (0.10.0) and a post to the main networks (0.14.0).
4. English, Portuguese and Spanish complete, and kept complete by tests (0.8.0).

## Profiles

- **Kamen Rider** shipped in 1.3.0. See [ADR 0014](adr/0014-kamen-rider-profile.md).
- **Other franchises** follow the same path: a profile is plain data, so the scoring code does not change. The categories, weights and subcriteria need a discussion first. Size: medium. Help welcome.
- **Beyond tokusatsu.** Tokuten is the permanent name and brand, whatever the profiles cover. In time the method could serve anime first, then series and films, with each community getting a profile of its own. This is a direction and not a plan. The shape of a more neutral profile will be decided once a third profile exists to compare against.

## Languages

Open to the community, now that a language is one file and one line ([ADR 0011](adr/0011-language-registry.md)): Japanese, French, German and others. Neutral, slightly formal wording is the goal. Size: medium per language. Help welcome.

## Interface

- **Compare seasons.** Two or more seasons side by side, from imported JSON files. Size: large.

## Not planned

- Accounts, a database or any server logic. The app stays a static site, and a draft or a JSON file is how work is kept.
- Scores from other people or rankings. The tool is for forming your own judgment in a consistent way.
