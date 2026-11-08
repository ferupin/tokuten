# Semiotics

This document records what the visible elements of Tokuten mean and why they were chosen. The [design system](design-system.md) says how things are built. This page says why they look the way they do.

The in-app version lives at `/meaning` and follows this document. When a meaning here changes, update the page too.

Two kinds of claims appear below. A **fact** is about language or culture and can be checked. A **design intent** is a choice made for this project and is not a tradition. Intent is marked as such.

## The name

| Term | Reading | Meaning |
|---|---|---|
| 特点 | tokuten | A distinctive point or characteristic |
| 得点 | tokuten | Points scored, a score |
| 特撮 | tokusatsu | Special filming, the genre this tool is made for |
| 基準 | kijun | A standard, a criterion, a benchmark |

**Tokuten** takes its first kanji, 特, from tokusatsu. The second, 点, means point or mark. The word 特点 and the word 得点 are pronounced exactly the same, so the name carries two ideas at once: what makes a work distinctive and how many points it earned.

**Kijun** names the method. It stands for the central rule of the project, which is to apply the same measure to every season. In short, Tokuten is the app and Kijun is the method.

The logo uses the single kanji 点. It is short enough to read inside a small seal.

## The five pillars

The ten categories are grouped under five colors. This echoes the classic five color team of Super Sentai, which goes back to the first series of the franchise.

| Pillar | Kanji | Reading | Color token | Categories |
|---|---|---|---|---|
| Narrative | 赤 | aka | `--red` | Story, Characters, Squad Chemistry |
| Concept | 青 | ao | `--blue` | Theme and Concept |
| Visual | 黄 | ki | `--yellow` | Suits, Mecha |
| Craft | 緑 | midori | `--green` | Action, Production |
| Rhythm and Sound | 桃 | momo | `--pink` | Music, Pacing |

The kanji and readings are facts. The pairing of each color with a pillar is **design intent**:

- **Red** is the leader and the heart of the team. It holds what a story is built on, which is the plot, the characters and the bond between them.
- **Blue** is cool and thoughtful. It holds the idea behind the season.
- **Yellow** is light and attention. It holds what the eye meets first.
- **Green** is growth and work done by hand. It holds the making of the season.
- **Pink** comes from the peach (桃) and stands for movement and warmth. It holds what carries a viewer through the season.

Pillars are only a visual grouping. They never change a weight or a score. Color is never the only carrier of meaning: each pillar also has a kanji and a text label.

The pillar red (`--red`) and the accent vermilion (`--accent`) are different tokens on purpose. The first marks a group of categories. The second marks the identity of the app and its interactive states.

## The seal

A hanko (判子) is a personal seal pressed in red ink in place of a signature. Tokuten uses one as its logo and as the stamp on the result, because a score is a formal judgment.

The seal shows two states:

| Mark | Reading | Meaning | When it shows |
|---|---|---|---|
| 仮 | kari | Provisional | At least one applicable category is still ungraded |
| 決 | ketsu | Decided | Every applicable category has a grade |

The seal color is vermilion, 朱 (shu), the color of seal ink. While the score is provisional the seal is drawn in a muted line color. When it is decided it takes the vermilion and plays a short stamp animation, which is skipped when reduced motion is on.

## Numerals

Categories are numbered 壱 弐 参 四 五 六 七 八 九 十.

The first three are formal numerals (大字, daiji). Contracts and receipts use them because the plain forms 一 二 三 are easy to alter by adding a stroke. From four onward the everyday forms are used, because they are easier to recognize at a glance. The full formal set would be 壱 弐 参 肆 伍 陸 漆 捌 玖 拾.

Mixing the two is common in practice. The mixed set was kept for legibility. This is a design choice and can be revisited.

## Color and light

Both themes are named after a material, and neither uses pure white or pure black, which tire the eyes over a long session.

| Name | Kanji | Reading | Role |
|---|---|---|---|
| Washi | 和紙 | washi | The light theme. Japanese paper, warm and slightly yellow |
| Shikkoku | 漆黒 | shikkoku | The dark theme. The deep black of lacquer, tinted brown |
| Sumi | 墨 | sumi | Ink. The text color in the light theme |
| Shu | 朱 | shu | Vermilion. The accent, taken from seal ink |

In the dark theme the text becomes ivory and the vermilion is lifted slightly, so both keep AA contrast. Exact values are in the [design system](design-system.md).

## Type

Four typefaces, each with one job.

| Role | Typeface | Reason |
|---|---|---|
| Titles and the big score | Dela Gothic One | Heavy and bold, like the title card of a series |
| Kanji and headings | Shippori Mincho | A Japanese serif that recalls print and calligraphy |
| Reading text | Zen Kaku Gothic New | Clean and legible in Latin letters and in kana |
| Numbers and small labels | JetBrains Mono | Fixed width digits, so numbers do not shift when they change |

## Grade bands

The eleven grade labels from Abysmal to Masterpiece have no color of their own. Color is reserved for pillars so that a grade is never read as a verdict by hue alone. The reading note under the score carries the nuance instead, and it treats 6 and 7 as solid results. See [the Kijun method](framework.md).

## Language

Interface text is neutral and slightly formal, direct about the concept and free of slang, so it translates well. Kanji that are part of the identity are not translated: the logo, the pillars, the numerals and the seal marks.

## Keeping this document true

- Add a new kanji, color or symbol here before it ships.
- State whether the meaning is a fact or a design intent.
- Prefer a real word over a decorative one. If a kanji cannot be explained, it should not be used.
- Update the `/meaning` page and the changelog in the same change.
