# Development

How to run Tokuten, what it is built with and how the code is organized. For the overview, see the [README](../README.md).

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

Versions are the ones installed when this table was last updated. The exact ones for any release are in `package-lock.json`. There is no backend and no database, and the only network request the app makes is loading its own files. The reasons for the main choices are in the [decision records](docs/adr).

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
3. Add a `profiles.rider` block to every dictionary in `src/i18n/` (the registry is `src/i18n/languages.ts`). TypeScript will report any language that is missing keys.
4. Add a test that checks the weights, like the one for Sentai.


## Conventions

- Code, comments and documentation are written in English.
- Interface text is neutral and slightly formal, direct about the concept and free of slang, so it translates well.
- The scoring engine must keep its test coverage. Any change to weights requires a new profile version.
- The file format follows [file-format.md](file-format.md), and a test enforces it.
- Commit messages follow Conventional Commits.

## Documentation

- [The Kijun method](framework.md)
- [Roadmap](ROADMAP.md)
- [Changelog and versioning](CHANGELOG.md), also shown in the app at `/changelog`
- [File format](file-format.md)
- [Design system](design-system.md)
- [Semiotics](semiotics.md), also shown in the app at `/meaning`
- [Decision records](adr)
