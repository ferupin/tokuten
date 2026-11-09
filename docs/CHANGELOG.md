# Changelog

This file is the written copy of the history shown in the app at `/changelog`. The source of the in-app version is `src/changelog/entries.ts`. Keep both in step.

## How versions work

Versions follow `major.minor.patch`.

- **Patch**: fixes, wording and visual polish that do not alter any result.
- **Minor**: new features, new screens, new profiles.
- **Major**: changes that alter how an existing evaluation is calculated or that break the JSON format.

The Sentai profile has its own version number. It goes up whenever a weight, category or subcriterion changes, because that changes what a score means. The JSON export stores the profile version.

## Releasing

1. Add the entry to `src/changelog/entries.ts`, newest first, in English and Portuguese.
2. Update `version` in `package.json`. A test fails if the two disagree.
3. Add the same entry here.
4. Run `npm test` and `npm run build`.

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
- Consistency checklist before finishing.
- Optional browser draft, off by default.
- Keyboard shortcuts.
- Compare seasons side by side.
- Kamen Rider profile.
- Sensitivity view for category weights.
