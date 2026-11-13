# Roadmap

What is planned for Tokuten, in the order it is likely to happen. Nothing here is a promise and nothing has a date. The history of what shipped is in [CHANGELOG.md](CHANGELOG.md).

Each item has a rough size: small is a few hours, medium is a few days, large is a project of its own. Items marked **help welcome** are good places to join in. Open an issue first, so the idea and the approach are agreed before the work starts.

## Next

### Share a result
Someone who finishes an evaluation should be able to share the result directly, through the score card. The card already stands alone in the code, which prepares this.

It starts with a decision, not with code, because the app has no server. Two ways are on the table.

- **An image.** The card is drawn in the browser as a PNG, to download, copy or send through the share sheet of a phone. It works anywhere a picture works.
- **A link.** The grades travel in the part of the address after the `#`, which never reaches any server, and a results page draws the card from it. A link preview in a social network would not show the card, since that needs a server.

Nothing private would go out by default. The title, the score, the reading, the radar and the grades are shared. The notes, the introduction and the conclusion are left out, and personal enjoyment is opt in.

Plan: a decision record with a few card layouts to choose from, then the image, then the link. Size: medium for each part.

### Spanish
Added by the maintainer, so the app has English, Portuguese and Spanish. It is also the chance to make a language cheaper to add: one file for the interface, tests that cover every registered language, and a changelog that falls back to English until a text is translated. Size: medium.

## Toward 1.0

The 1.0 mark is a promise that the method, the file format and the core of the interface are stable. It needs:

1. The grade anchors written, so the meaning of a grade stops changing.
2. A JSON format that old files keep opening with.
3. Sharing delivered.
4. English, Portuguese and Spanish complete.

## Method

- **Grade anchors per category.** Short texts that say what a 3, a 5 and an 8 look like in each category. They change how scores are read, so they are written together with the method. Size: medium. Help welcome, as a discussion.
- **Sensitivity view.** How much each category moves the final score, to show where a grade matters most. Size: medium.

## Profiles

- **Kamen Rider.** A profile is plain data, so the scoring code does not change. The categories, weights and subcriteria need a discussion first. Size: medium. Help welcome.
- Other franchises follow the same path.

## Languages

Open to the community, once the one-file setup is in place: Japanese, French, German and others. Neutral, slightly formal wording is the goal. Size: medium per language. Help welcome.

## Interface

- **Compare seasons.** Two or more seasons side by side, from imported JSON files. Size: large.
- **Keyboard shortcuts.** Grade and mark not applicable without the mouse. Size: small to medium. Help welcome.
- **Accessibility pass.** A check with screen readers and with keyboard only, across every page. Size: small. Help welcome.

## Not planned

- Accounts, a database or any server logic. The app stays a static site, and a draft or a JSON file is how work is kept.
- Scores from other people or rankings. The tool is for forming your own judgment in a consistent way.
