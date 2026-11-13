# File format

This document is the promise about the files Tokuten writes. From version 1.0 it holds for every 1.x release. Until then it is already followed, and a test enforces it.

There are three things that carry an evaluation out of the app.

| What | Where it is defined | Meant for |
| --- | --- | --- |
| The JSON file | `src/core/schema.ts` | Keeping an evaluation and opening it again, here or on another device. |
| The share link | `src/core/share-link.ts` | Showing a result to someone else, read only. |
| The local draft | `src/core/draft.ts` | A safety net inside one browser. Not a file anyone is meant to keep. |

The Markdown exports are for reading and are not part of this promise. Their wording and layout can improve in any release.

## The JSON file

```json
{
  "app": "tokuten",
  "schema": 1,
  "exportedAt": "2026-11-06T20:23:29.445Z",
  "evaluation": {
    "profileId": "sentai",
    "profileVersion": 1,
    "mode": "detailed",
    "title": "Season name",
    "introduction": "",
    "conclusion": "",
    "enjoyment": 8.5,
    "checked": ["noNostalgia"],
    "categories": {
      "theme": {
        "applicable": true,
        "override": null,
        "notes": "",
        "subcriteria": { "originality": { "value": 7, "applicable": true } }
      }
    }
  }
}
```

- `app` is always `"tokuten"`.
- `schema` is the version of this envelope. It is `1` today.
- `evaluation.profileId` names the profile, and `profileVersion` says which version of its weights and categories the grades were given under.
- Grades are numbers on the scale of the profile, or `null` when not graded.
- `mode` is `"detailed"` or `"quick"`. It never affects the score.
- `checked` lists the ids of the consistency checks that were ticked.
- `categories` has one entry per category of the profile, each with every subcriterion of that category.

The file keeps the grades and the text a person wrote. It does not keep the score, which is always calculated again when the file is opened.

## What 1.x promises

1. **Old files keep opening.** A file written by any earlier version opens in a later one, with the same grades and the same score. Fields that did not exist yet get a default: no `mode` means `detailed`, no `checked` means nothing ticked.
2. **New fields are optional.** A field added in a later version has a default, so older files do not need it, and the `schema` number stays at 1.
3. **Unknown fields are ignored.** A file with extra fields still opens. Fields this version does not know are dropped when it writes the file again.
4. **A newer file is refused, not half read.** If `schema` is higher than the version the app understands, the import stops with a message that says so.
5. **A breaking change is a new schema.** Removing or renaming a field, or changing what a value means, raises `schema` to 2 and the major version of the app to 2. Version 2 keeps reading schema 1 files.
6. **The score of a file does not change inside 1.x.** The calculation is not changed in a minor or a patch release. A change in weights or categories is a new profile version, and it is announced in the changelog.

## What can still change

- The wording and layout of the Markdown exports.
- The look of the cards and the images.
- New profiles, each with its own `profileId`.
- New optional fields, as in rule 2.

## How the promise is checked

`src/core/compat.test.ts` reads real files from `src/core/fixtures`, one for each stage the format has been through: before modes, with modes, and with the checklist. The test checks that each opens and gives the same score, and that the file written by the current version equals the newest fixture exactly. If the format changes, that last test fails on purpose. The change then needs a decision: undo it, or follow the rules above and add a fixture for the new shape.

## The share link

```
/results#1/sentai/8,7.5,7,-,n,9,8,7.5,6.5,7/e=8.5/t=Season%20name
```

Separated by `/`: the link format version, the profile id, one grade per category in profile order (`n` is not applicable and `-` is not graded), then optional `e=` for personal enjoyment and `t=` for the title, percent encoded.

The same rules apply in spirit. The version in front is `1`. A link with a higher version shows a message that it comes from a newer version of the app, and anything that does not fit is rejected. Links hold grades and never the score. Links are meant to be short lived, so unlike files they do not carry a promise to open forever, but a version 1 link is read by every 1.x release.

## The local draft

The draft in `localStorage` has its own envelope (`kind: "draft"`, `schema: 1`). It is a safety net and not a file to keep. A draft that cannot be read is ignored and the app starts blank, so the draft is outside this promise. The JSON file is the way to keep work.
