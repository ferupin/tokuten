# Changelog

This file is the written copy of the history shown in the app at `/changelog`. The source of the in-app version is `src/changelog/entries.ts`. Keep both in step.

## How versions work

Versions follow `major.minor.patch`.

- **Patch**: fixes, wording and visual polish that do not alter any result.
- **Minor**: new features, new screens, new profiles.
- **Major**: changes that alter how an existing evaluation is calculated or that break the JSON format.

The Sentai profile has its own version number. It goes up whenever a weight, category or subcriterion changes, because that changes what a score means. The JSON export stores the profile version.

## Releasing

1. Add the entry to `src/changelog/entries.ts`, newest first, in English, Portuguese and Spanish.
2. Update `version` in `package.json`. A test fails if the two disagree.
3. Add the same entry here.
4. Run `npm test` and `npm run build`.

## 0.13.0 (2026-11-13)

Calmer export controls and a draft check. Sentai profile v1.

### Interface
- The export area has two groups. Markdown holds the format choice, a Copy button and a download arrow attached to it. File holds Download JSON and Import JSON.
- Copy keeps its word, and the arrow has a tooltip and a label for screen readers. After copying, the icon turns into a check for two seconds. File buttons carry a small icon.
- Start over is a quiet red link at the end of the File group. The confirmation is unchanged.
- The dot in the saved draft notice pulses softly from its center until a choice is made, and pauses while the pointer or focus is on the notice. With reduced motion it stays still.
- A small "Draft saved" check, styled like the toast, hangs under the header for about two seconds after a save, at most once every eight seconds. It does not move the page and is announced politely. It never shows when the draft is off.
- The result card is compact: firmer border and shadow, smaller score, no line about how close the categories are, and a radar right under the reading with larger kanji in the color of their pillar. It is about a quarter shorter and the chart comes into view sooner. Strongest and weakest sit at the bottom of the table column.
- Share this result is a small quiet link in the top corner of the card, so it adds no height.

### Documentation
- The design system and ADR 0009 describe the grouping, the pulse and the check.

## 0.12.1 (2026-11-13)

A steadier result card. Sentai profile v1.

### Interface
- Fixed: with a score of 10.0 the seal overlapped the first column of the breakdown table. Only the wide 10.0 is drawn a little smaller, so the seal stays in its own column. Other scores are unchanged.
- Fixed: the reading text under the score changed height with the grade and moved the radar. The card now keeps the room of the longest text. The text is still always visible.
- Fixed: Restore draft and Discard could carry the reader to another part of the page, because the notice strip leaves and the result card fills in at that moment. The page now keeps what the reader was looking at in place.

### Documentation
- The README is shorter, with a link to the app, a progress checklist and a help checklist. The stack, the code layout and how to add a profile moved to `docs/development.md`.

## 0.12.0 (2026-11-13)

Reference points for grades. Sentai profile v1.

### Method
- Each category has four reference points, for the grades 3, 5, 7 and 9. They describe a typical reading and are not a checklist.
- They judge what a season attempts and how well it succeeds, never its age, budget, popularity or nostalgia, and each stays inside its own category.
- The extremes keep the existing grade band texts.

### Interface
- A collapsed Reference points list in each category: in Detailed mode below the scope and boundary notes, and in Quick mode inside the Guidance and notes panel.

### Quality
- A dictionary test requires all four reference points for every category in every registered language.

### Documentation
- `docs/framework.md` explains the reference points. The roadmap no longer lists them as pending.

### Known limits
- A first version, open to revision. Changing the wording does not change a score, so the profile version stays the same.

## 0.11.0 (2026-11-13)

A stable file format. Sentai profile v1.

### Export and import
- Importing a file with a newer schema than the app understands stops with its own message, "The file comes from a newer version of Tokuten", instead of being half read.
- Files with fields the app does not know still open, so later versions can add optional fields. The file format itself did not change.

### Quality
- Three real files from earlier stages of the format are kept as fixtures. A test checks that each opens, gives the same score and gets the right defaults.
- The file written by the current version is pinned to the newest fixture, so any change to the format fails a test and has to be a decision.

### Documentation
- New `docs/file-format.md` with the promise for 1.x, the format of the JSON file, the share link and the draft.

## 0.10.0 (2026-11-13)

Share a result as a link. Sentai profile v1.

### Interface
- The Results page has a Share as a link section with the link and a Copy link button. The personal enjoyment switch applies to the link too and is off by default.
- Opening a link shows the shared card at `/results`, read only, in the language of the person who opens it, with the same layouts, theme choice, download, copy and description.
- Open in the evaluator turns a shared result into a Quick mode evaluation with the grades from the link. A confirmation asks first when the evaluator already has work. Show my own result goes back to your own card.
- A damaged, cut short, newer or unknown profile link shows a clear message.

### Export and import
- The link is readable text, for example `/results#1/sentai/8,7.5,7,-,n,9,8,7.5,6.5,7/t=Season`: format version, profile, one grade per category (`n` not applicable, `-` not graded), optional `e=` enjoyment and `t=` title.
- It holds grades and never the score, so the receiving side calculates the score with the same engine. The introduction, the notes and the conclusion are not in it.
- Everything after `#` stays in the browser and is never sent to a server.

### Design
- A generic preview image (1200 by 630) so a link to Tokuten shows a card in chats and social networks. It cannot show the result itself.

### Quality
- Tests for the link: format, round trip, not applicable and not graded categories, special characters in titles, long titles, enjoyment only when asked, and rejection of invalid input.

### Documentation
- ADR 0010 records the link as built. The roadmap no longer lists sharing as pending.

### Known limits
- Anyone with the link can read it, and a link cannot be taken back once sent.
- Grades are kept to four decimals, so a score can differ in a far decimal place from the sender's own.
- The preview in chats is always the generic image.

## 0.9.1 (2026-11-13)

A portrait card for phones. Sentai profile v1.

### Interface
- New Poster layout (1080 by 1350): season name, a very large score with its grade band, the seal with its caption and a radar with every axis named and graded. It follows the light or dark choice of the card, and the enjoyment line is centered when switched on.
- The layout picker shows three previews, and the choice is remembered.

### Documentation
- ADR 0010 and the roadmap list only the share link as left to do.

## 0.9.0 (2026-11-13)

Share a result as an image. Sentai profile v1.

### Interface
- A Share this result button under the result opens the new Results page at `/results`. It appears only when at least one category is graded.
- Two card layouts, each shown as a live preview: Seal (landscape, 1200 by 630, with a radar) and Ledger (square, 1080 by 1080, one bar per category). The choice is remembered.
- The card can be light or dark, whatever the theme of the app.
- Download the PNG, copy it, or use the share sheet where the browser supports sharing files.
- Every axis and bar is named in plain words, the seal has a caption and a footer says what Kijun is and the scale used.
- A text description of the card, with a copy button, for use as alternative text.

### Method
- Every category has a short name in the three languages, used on the cards.

### Export and import
- The introduction, the notes and the conclusion are never part of a card. Personal enjoyment is included only when switched on, on a separate line, and is off at every visit.
- The card is drawn in the browser. Nothing is uploaded.

### Quality
- Tests for privacy, short names in every language and the match between the canvas colors and the theme tokens.

### Documentation
- ADR 0010 records what was built. The roadmap lists layout C and the link.

### Known limits
- A card cannot be opened back into the app. The share link is planned.
- The page reads the evaluation in memory. After a reload, restore the draft first.

## 0.8.0 (2026-11-13)

Spanish and easier languages. Sentai profile v1.

### Interface
- Spanish is available in the language menu. Every screen, the grade bands, the category guidance and both Markdown exports are translated.
- Each language is named in its own language. English is still the starting language, and a language chosen on purpose is still remembered.
- The changelog falls back to English for any text that is not translated yet.

### Quality
- One registry, `src/i18n/languages.ts`, lists every language. The menu, the saved preference and the tests read from it, so a new language needs a dictionary file and one line.
- The dictionary tests run for every registered language: same keys, same placeholders, no empty text, no em dashes, complete profile text, and not a copy of English.
- A test keeps English, Portuguese and Spanish complete in the changelog. Other languages may be partial.

### Documentation
- ADR 0011 records the language registry. The README and the contributing guide explain how to add a language in three steps.

### Known limits
- The Spanish text was written without a native review. Corrections are welcome.

## 0.7.2 (2026-11-13)

Easier changelog and a named result. Sentai profile v1.

### Interface
- Each release in the changelog is collapsible. The title, date and summary stay in view, and only the newest release starts open. Expand all and Collapse all are at the top.
- A link such as `/changelog#v0.5.0` opens that release and scrolls to it.
- The result card shows the name of the season, under the profile name and above the official score. Long names are held to three lines, and a muted Untitled season shows until a name is typed.

### Design
- The score side of the card is a component of its own, with no change to how it looks. It is the groundwork for sharing a result as an image or a page later.

### Quality
- Checked in the browser: open and closed states, the keyboard, links with a version in the address, both languages and a 360 px screen.

## 0.7.1 (2026-11-13)

Calmer draft controls. Sentai profile v1.

### Interface
- Fixed: going to Meaning or Version and coming back offered to restore a draft that was already restored. The notice now appears only when nothing is in progress, that is, after a reload or a new visit.
- The draft notice is a slim strip under the header. It follows the scroll, does not cover the page and stays until you restore or discard. On narrow screens it shortens to two lines.
- Keeping a draft is a switch, with a quiet Delete draft link beside the status.
- The Markdown format is a single segmented control and works with the arrow keys.

### Quality
- Checked in the browser: a reload still offers the draft, while moving between pages, the back button and returning from the changelog do not.

### Documentation
- ADR 0009 and the design system describe the new rule and the two controls.

## 0.7.0 (2026-11-12)

Consistency checklist. Sentai profile v1.

### Method
- A new card after the conclusion lists the ten consistency checks of the method. It starts collapsed and shows how many are ticked.
- Ticking never changes the score, in either mode, and never blocks the export.

### Export and import
- When at least one check is ticked, both Markdown formats end with a consistency checklist as a task list. It is left out when nothing is ticked.
- In the Obsidian format the list sits in a collapsible to-do callout, and a `checklist_done` property records the count.
- The JSON file gets a new optional `checked` list of ids. Files from earlier versions still import, with nothing ticked, and unknown ids are dropped. The file schema version stays 1 because nothing breaks.

### Interface
- The checks are part of the local draft.

### Quality
- Tests for the score being untouched, profile order, the JSON round trip, old files, unknown ids and both exports. A dictionary test checks every check has text in both languages.

## 0.6.0 (2026-11-12)

Subcriteria as tables. Sentai profile v1.

### Export and import
- Standard format: the graded subcriteria of each category are a two column table with the grade aligned to the right. Only core table syntax is used, so it renders in forums, on GitHub and in any Markdown viewer.
- Obsidian format: the table sits inside the collapsible callout of the category and adds a third column with the ten cell gauge.
- The reasoning stays as plain text on purpose. A table cell holds one line, and the reasoning is the longest and most important text of the evaluation.
- Ungraded and not applicable subcriteria are left out. Quick evaluations still have no subcriteria table.

### Quality
- A new test renders both formats with the real English and Portuguese dictionaries and fails on any missing text. The rendered tables were also checked with a Markdown parser.

## 0.5.1 (2026-11-11)

Named palette and hex codes. Sentai profile v1.

### Design
- Added the two missing names: Kinari (生成り) for the card surface of the light theme and Kurocha (黒茶) for the dark one. The dark text color is now Zōge (象牙) instead of the English word Ivory, so every color is named the same way.
- Each color is described on the Meaning page, including Shu, which is a little lighter on the dark theme.

### Interface
- Hover over a color, or focus it with the keyboard, to see its hex code. Select it to copy. A tap on a touch screen shows it too.
- The five pillar colors are listed under each theme with the same behavior.
- The code is read from the computed color, so it always matches what is on screen.

### Documentation
- The semiotics page and the design system table list all names.

## 0.5.0 (2026-11-10)

Local draft. Sentai profile v1.

### Interface
- The evaluation is saved in this browser a moment after every change, and when the page is hidden or closed. A blank evaluation is never saved.
- On the next visit a prompt offers to restore the draft or discard it. Nothing is replaced without a choice, and the stored draft is left untouched until then.
- A quiet line under the buttons says where the work is kept, with buttons to delete the draft or turn it off. Turning it off also deletes the stored copy.
- With the draft off, leaving a page that holds work asks for confirmation.
- The grading mode and the Markdown export format are remembered between visits, like the language.

### Method
- Start over also deletes the draft.

### Quality
- A broken, foreign or out of range draft is ignored. The app works normally when the browser blocks storage.
- Tests for the draft rules and for the browser flow.

### Documentation
- ADR 0009. The footer, the README and the notes of earlier decisions were updated.

### Limits
- The draft lives in one browser on one device and does not sync. Clearing the site data removes it. Export JSON to keep an evaluation for good.

## 0.4.0 (2026-11-09)

Obsidian Markdown export. Sentai profile v1.

### Export and import
- The Markdown export has two formats. Standard is unchanged and renders anywhere, such as a forum or GitHub. Obsidian is new.
- Obsidian properties: title, profile, profile_version, mode, status, score, band, enjoyment, exported and tags. Values are quoted where needed, numbers are literal and tags are a list without the hash, as Obsidian requires.
- Each category is a collapsible callout with its grade, a ten cell gauge, the weight, the subcriteria and the reasoning.
- Partial scores, redistributed weights and quick evaluations get their own callouts.
- The calculation is a table with the contribution of each category, followed by a Mermaid pie chart. The official score is highlighted and the personal enjoyment score stays separate.
- A hidden comment records that the file was generated by Tokuten.

### Interface
- Format selector above the export buttons.

### Quality
- Tests for properties, callouts, the chart and the separation of the two scores.

## 0.3.0 (2026-11-08)

Detailed and Quick modes. Sentai profile v1.

### Method
- Two evaluation modes, Detailed (詳細) and Quick (簡易). The weights, the not applicable rules and the calculation are identical in both, and a test checks it.
- Switching modes never discards a grade. In Quick mode a category with subcriteria grades starts from their average. Moving the slider replaces it with a direct grade, and one button returns to the average.
- Starting over keeps the chosen mode.

### Interface
- Mode switch above the categories, with the kanji next to each name.
- Quick rows with one slider per category, the grade band and description, the source of the grade, and buttons for guidance and notes, clearing the grade and marking not applicable.
- Quick evaluation badge in the result.
- Fixed: returning to the main page from Meaning or the changelog left it scrolled slightly down. The cause was the global smooth scrolling, which made the navigation scroll animate and compete with the reset, so it was removed. Back to top still scrolls smoothly, and the back button of the browser restores your position at once.
- Fixed: a grade of exactly 5.0 could not be set on an ungraded slider. This affected every slider since 0.1.0.
- Fixed: after Start over or an import, a category could still show the manual grade view with an empty slider.

### Export and import
- The JSON export stores the mode. Files from earlier versions load as Detailed.
- The Markdown export states a quick evaluation and leaves the subcriteria out.

### Documentation
- Meaning page and `docs/semiotics.md` explain 詳細 and 簡易. New section in `docs/framework.md`. Decision record 7.

### Quality
- New tests for the mode, the JSON compatibility, the Markdown by mode and the store.

### Known limits
- The chosen mode is not remembered between visits.

## 0.2.0 (2026-11-08)

Meaning and community. Sentai profile v1.

### Interface
- New Meaning page at `/meaning`. It teaches the name, the five pillars, the seal, the numerals, the colors of both themes and the typefaces, using the real elements of the app. Facts are tagged as facts and project choices as design intent.
- The footer links to Meaning and Contribute, next to the version and the credit.
- Contribute card at the end of the Meaning page, with links to report a bug, suggest an improvement and read the guide.
- The Meaning page opens at the top and has the back to top button.

### Design
- Theme tokens can be applied to any container, so a page can show both themes side by side. The look of the app did not change.

### Documentation
- New `docs/semiotics.md`. The design system document only points to it.
- MIT license, contributing guide, GitHub issue forms for bugs and suggestions, and a pull request template.
- Decision record 6.

### Quality
- Dictionary tests: same keys and placeholders in every language, no empty text, no em dashes, complete text for every category, subcriterion and pillar.

## 0.1.2 (2026-11-06)

Fixes and polish. Sentai profile v1.

### Interface
- Fixed: the changelog opened at the bottom, because the page kept the scroll position of the footer link. It now starts at the top.
- English is now always the starting language, whatever the language of the browser. A language chosen on purpose is still remembered.
- Back to top button. It appears near the end of long pages, moves smoothly, and jumps instantly when reduced motion is on.

### Design
- Footer text increased from 11 px to 13 px.

### Documentation
- README cleaned of merge leftovers.
- Commit message suggestions follow the Conventional Commits pattern.

## 0.1.1 (2026-11-06)

Site icon. Sentai profile v1.

### Design
- Vector icon (`icon.svg`) in vermilion with the kanji in cream. The kanji outline comes from the Shippori Mincho font and is stored as a path, so no font is needed to display it.
- `favicon.ico` with 16, 32 and 48 px frames. The small sizes drop the inner border and use a larger kanji to stay readable.
- Apple touch icon (180 px) without rounded corners, since iOS applies its own.

## 0.1.0 (2026-11-06)

First usable release. Sentai profile v1.

### Method
- Ten categories with weights that add up to 100%: Theme 8, Suits 8, Mecha 8, Story 14, Characters 14, Squad Chemistry 12, Music 8, Action 10, Production 8, Pacing 10.
- Subcriteria per category. The category grade is the average of the graded ones.
- Subcriteria can be marked as not applicable and are then left out of the average.
- A category grade can be set by hand and then replaces the average.
- A whole category can be not applicable. Its weight is shared among the others in proportion to their own weights.
- Categories without a grade are never counted as an average. The score stays partial until every applicable category is graded.
- Personal enjoyment is stored apart and never read by the scoring code.
- Grade bands from Abysmal (0) to Masterpiece (10). A half rounds up.
- Each category shows what it covers and what belongs to its neighbors.
- A reading note under the score says that 6 and 7 are solid results and that a number does not describe a whole work. A second line appears when category grades are very close or very far apart.

### Interface
- Season title and introduction, ten collapsible category cards, progress bar, expand all.
- Sliders for subcriteria, categories and enjoyment. An ungraded slider shows no fill.
- Result panel with the score, a provisional or decided seal, a radar chart, a calculation table and the strongest and weakest categories.
- Score in the sticky header.
- English and Brazilian Portuguese, remembered by the browser.
- All state lives in memory and is cleared when the tab closes.

### Design
- Light theme Washi and dark theme Shikkoku, following the system until a choice is made.
- Five pillars with ranger colors and the kanji 赤 青 黄 緑 桃, formal numerals for categories.
- Hanko seal as logo and result stamp. Fonts: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New, JetBrains Mono, all self-hosted.
- Reduced motion respected, visible focus, usable from 360 px wide.

### Export and import
- Markdown export in the seven-part format of the method, copy or download.
- JSON export and validated import.
- Confirmation before starting over.

### Quality
- Pure TypeScript scoring engine with unit tests.
- A test keeps the changelog in sync with `package.json`.
- Typed dictionaries, so a missing translation fails the type check.

### Documentation
- README, method description, design system and five decision records.

### Known limits
- No draft survives a refresh. Export JSON to keep your work.
- Category specific grade anchors are not written yet.
- Only the Sentai profile exists.

## Planned

Nothing here is promised or dated.

- Category specific grade anchors.
- Keyboard shortcuts.
- Compare seasons side by side.
- Kamen Rider profile.
- Sensitivity view for category weights.
