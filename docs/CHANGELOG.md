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
