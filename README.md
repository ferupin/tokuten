# Tokuten 特点

Tokuten is a personal tool for scoring tokusatsu seasons in a consistent way. It is built on **Kijun 基準**, a method with ten weighted categories, subcriteria, and a clear separation between the official score and personal enjoyment.

The first profile covers Super Sentai. The structure is ready for others, such as Kamen Rider, without changes to the calculation code.

Everything runs in the browser. There is no database, no account and no server logic. Nothing is saved unless you export it.

## What it does

- Grades ten categories in two modes: Detailed (詳細), through subcriteria, or Quick (簡易), with one grade per category. Switching keeps your grades.
- Lets you mark a subcriterion or a whole category as not applicable. The weight of a removed category is shared among the others in proportion to their own weights.
- Shows the official score as partial until every applicable category has a grade.
- Keeps personal enjoyment in a separate card that never touches the official score.
- Exports the evaluation as Markdown, following the output format of the method, and as JSON so it can be imported again.
- Works in English and Brazilian Portuguese, with light and dark themes.

## Getting started

You need Node.js 20 or newer.

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

## Deploying to Vercel

The project exports a static site, so Vercel needs no special setup. Import the repository and keep the defaults. Next.js is detected automatically.

## How the code is organized

```
src/
  core/        Pure TypeScript. Scoring, grade bands, validation, Markdown export.
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
- [Changelog and versioning](docs/CHANGELOG.md), also shown in the app at `/changelog`
- [Design system](docs/design-system.md)
- [Semiotics](docs/semiotics.md), the meaning of the name, colors and symbols, also shown in the app at `/meaning`
- [Decision records](docs/adr)

## Conventions

- Code, comments and documentation are written in English.
- Interface text is neutral and slightly formal, direct about the concept and free of slang, so it translates well.
- The scoring engine must keep its test coverage. Any change to weights requires a new profile version.

## Contributing

Tokuten is open source and help is welcome. Found a bug or have an idea? Open an [issue](https://github.com/ferupin/tokuten/issues/new/choose). The [contributing guide](CONTRIBUTING.md) explains how to set up the project, the conventions it follows and how to send a pull request.

## License

Released under the [MIT License](LICENSE).
