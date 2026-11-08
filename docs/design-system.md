# Design system

This page covers how the interface is built. For what the names, colors and symbols mean, see [Semiotics](semiotics.md).

## Concept

The interface works like a critic's dossier with a tokusatsu soul. The layout is calm and editorial. The personality comes from a few deliberate elements: the hanko seal, the five ranger colors, and Japanese type used where it has a function.

## Themes

Both themes avoid pure white and pure black.

| Token | Light (Washi) | Dark (Shikkoku) |
|---|---|---|
| `--bg` | `#f3ecdc` | `#16130e` |
| `--surface` | `#faf5e9` | `#1e1a14` |
| `--ink` | `#221d16` | `#ece3cf` |
| `--accent` | `#c23a22` | `#ee6a50` |

Light is warm cream paper with sumi ink. Dark is lacquer black with a brown undertone and ivory text. The accent is a vermilion, the color of a seal stamp. By default the theme follows the system setting, and the choice is remembered by the browser.

## Ranger colors

Each pillar uses one color and one kanji. The colors are softened so they stay comfortable on both backgrounds.

| Pillar | Kanji | Token |
|---|---|---|
| Narrative | 赤 | `--red` |
| Concept | 青 | `--blue` |
| Visual | 黄 | `--yellow` |
| Craft | 緑 | `--green` |
| Rhythm and Sound | 桃 | `--pink` |

Color is never the only carrier of meaning. Every colored item also has a text label and a numeral.

## Typography

| Role | Font |
|---|---|
| Titles and the big score | Dela Gothic One |
| Kanji and section headings | Shippori Mincho |
| Interface text | Zen Kaku Gothic New |
| Numbers and small labels | JetBrains Mono, with tabular numerals |

Fonts are self-hosted through `@fontsource`, so the build does not depend on a network request to a font service. Japanese glyphs are split into ranges that the browser loads only when needed.

## Recurring elements

- **Hanko seal.** A square seal used for the logo and for the result. It shows 仮 (provisional) while the score is partial and 決 (decided) once it is complete.
- **Formal numerals.** Categories are numbered 壱 弐 参 四 五 六 七 八 九 十.
- **Radar chart.** Ten axes, one per category, labeled with the same numerals.

## Accessibility

- Text contrast follows WCAG AA in both themes.
- Every control can be used from the keyboard and has a visible focus ring.
- Sliders expose their value and band label to screen readers.
- Motion respects `prefers-reduced-motion`.
- The layout works from 360 px wide with no horizontal scrolling.

## Voice

Interface text is neutral and slightly formal. It states the concept first and avoids slang and idioms. Kanji that form part of the brand are not translated.
