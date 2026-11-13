# Tokuten 特点

Tokuten is a personal tool for scoring tokusatsu seasons in a consistent way. It is built on **Kijun 基準**, a method with ten weighted categories, subcriteria, and a clear separation between the official score and personal enjoyment.

The app is in version 0.x. The method and the file format are settling, and the plan to reach 1.0 is in the [roadmap](docs/ROADMAP.md).

The first profile covers Super Sentai. The structure is ready for others, such as Kamen Rider, without changes to the calculation code.

Everything runs in the browser. There is no database, no account and no server logic. Your work is kept as a draft in your own browser so a refresh does not lose it, and it never leaves your device. You can turn the draft off, and export JSON to keep an evaluation for good.

## What it does

- Grades ten categories in two modes: Detailed (詳細), through subcriteria, or Quick (簡易), with one grade per category. Switching keeps your grades.
- Lets you mark a subcriterion or a whole category as not applicable. The weight of a removed category is shared among the others in proportion to their own weights.
- Shows the official score as partial until every applicable category has a grade.
- Keeps personal enjoyment in a separate card that never touches the official score.
- Offers the ten consistency checks of the method as a last look before you finish. They are a reminder and never change the score.
- Keeps a draft in your own browser, offered back after a reload. It can be turned off.
- Exports the evaluation as Markdown in two formats: Standard, for any renderer such as a forum or GitHub, and Obsidian, with properties, collapsible callouts, tables and a chart. JSON export can be imported again.
- Works in English and Brazilian Portuguese, with light and dark themes.

## Getting started

You need Node.js 20.9 or newer. It is developed on Node.js 22.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create the static site in `out/` |
| `npm test` | Run the unit tests for the scoring engine |
| `npm run typecheck` | Check types without building |

## Tech stack

| Area | Tool | Version |
|---|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, static export) | 16.4.5 |
| UI | [React](https://react.dev) | 19.3.1 |
| Language | [TypeScript](https://www.typescriptlang.org) | 7.0.2 |
| Styling | [Tailwind CSS](https://tailwindcss.com) with design tokens as CSS variables | 4.3.4 |
| State | [Zustand](https://zustand.docs.pmnd.rs), in memory only | 5.1.0 |
| Validation | [Zod](https://zod.dev), for JSON import and the draft | 4.6.7 |
| Themes | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 |
| Tests | [Vitest](https://vitest.dev) | 5.1.0 |
| Fonts | [Fontsource](https://fontsource.org), self-hosted: Dela Gothic One, Shippori Mincho, Zen Kaku Gothic New, JetBrains Mono | 5.3.x |

Versions are the ones installed at release 0.7.2. The exact ones for any release are in `package-lock.json`. There is no backend and no database, and the only network request the app makes is loading its own files. The reasons for the main choices are in the [decision records](docs/adr).

## Deploying to Vercel

The project exports a static site, so Vercel needs no special setup. Import the repository and keep the defaults. Next.js is detected automatically.

## How the code is organized

```
src/
  core/        Pure TypeScript. Scoring, grade bands, validation, Markdown exports.
  profiles/    One file per franchise. Weights and categories live here as data.
  i18n/        Dictionaries and the small translation provider.
  features/    Evaluation form and result views.
  components/  Shared interface pieces and theme controls.
docs/          Method, design system and decision records.
```

The most important rule is that `core/` knows nothing about React or about any language. A profile only holds ids and numbers. Every visible text comes from the dictionaries in `i18n/`.

## Adding a new profile

1. Create `src/profiles/rider.ts` with its pillars, categories, weights and subcriteria. The weights must add up to 100.
2. Register it in `src/profiles/index.ts`.
3. Add a `profiles.rider` block to every dictionary in `src/i18n/`. TypeScript will report any language that is missing keys.
4. Add a test that checks the weights, like the one for Sentai.

## Documentation

- [The Kijun method](docs/framework.md)
- [Roadmap](docs/ROADMAP.md), what is planned and where help is welcome
- [Changelog and versioning](docs/CHANGELOG.md), also shown in the app at `/changelog`
- [Design system](docs/design-system.md)
- [Semiotics](docs/semiotics.md), the meaning of the name, colors and symbols, also shown in the app at `/meaning`
- [Decision records](docs/adr)

## Conventions

- Code, comments and documentation are written in English.
- Interface text is neutral and slightly formal, direct about the concept and free of slang, so it translates well.
- The scoring engine must keep its test coverage. Any change to weights requires a new profile version.

## How you can help

Tokuten is open source and the community is welcome in it. The [contributing guide](CONTRIBUTING.md) explains the setup, the conventions and how to send a pull request. These are the places where help counts most.

**Translations.** The app is written in English, with Brazilian Portuguese complete. Spanish will be added by the maintainer, which gives the project three languages. Other languages are open, for example Japanese, French and German. A translation covers the interface dictionary in `src/i18n` and the changelog texts. Neutral, slightly formal wording works best, because it keeps the meaning clear in every language. The identity kanji stay as they are. The steps are in the [contributing guide](CONTRIBUTING.md#adding-a-language).

**A profile for another franchise.** Kamen Rider is the next one planned. A profile is plain data, so it does not touch the scoring code. The categories and weights deserve a discussion first, so open an issue before writing it.

**The method.** Wording of the categories, subcriteria and consistency checks, and the grade anchors that say what a 3, a 5 or an 8 means in each category. Changes here alter what a score means, so they start with a conversation.

**Accessibility, design and testing.** Screen reader checks, keyboard use, contrast, small screens and browsers that are not Chrome. A report of what felt wrong is already useful.

**Bugs and ideas.** Open an [issue](https://github.com/ferupin/tokuten/issues/new/choose). A screenshot, the version in the footer and the JSON export make a bug much easier to trace.

The open evolutions, with an idea of the size of each, are listed in the [roadmap](docs/ROADMAP.md).

## License

Released under the [MIT License](LICENSE).
