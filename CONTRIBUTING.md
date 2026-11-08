# Contributing to Tokuten

Thank you for taking an interest. Tokuten is a small open source tool for scoring tokusatsu seasons with the Kijun method, and help from the community is welcome. This guide explains how to report a problem, suggest an idea, or send a change.

## Ways to help

- **Report a bug.** Something looks wrong, a calculation seems off, or a page breaks.
- **Suggest an improvement.** A clearer wording, a missing feature, a better way to present the method.
- **Improve the text.** Fix a typo or an unnatural sentence, in any language the app supports.
- **Add a language or a profile.** Both are designed to be added without touching the scoring engine.
- **Send code or documentation.** Small and focused changes are the easiest to review.

## Reporting a bug

Open an [issue](https://github.com/ferupin/tokuten/issues/new?template=bug_report.yml) and describe three things: what you did, what you expected and what happened instead. The version number in the footer, your browser and a screenshot help a lot.

If the problem involves a score, attach the JSON export of the evaluation. It is a plain text file. Check it first, since it also holds the notes you wrote.

## Suggesting an improvement

Open an [issue](https://github.com/ferupin/tokuten/issues/new?template=feature_request.yml) and explain the problem before the solution. A change to the method itself, such as weights or categories, needs a clear reason, because it changes what a score means.

## Setting up

You need Node.js 20 or newer.

```bash
git clone https://github.com/ferupin/tokuten.git
cd tokuten
npm install
npm run dev
```

Before sending a change, run:

```bash
npm test
npm run typecheck
npm run build
```

## How the project is organized

The README has the folder map. The rule that matters most is that `src/core` is pure TypeScript with no React and no visible text. Profiles are plain data, and every visible string lives in the dictionaries in `src/i18n`.

## Project conventions

- **Language.** Code, comments and documentation are written in English.
- **Tone of the docs.** Natural and direct. Avoid the em dash and other habits of generated text.
- **Tone of the interface.** Neutral and slightly formal, direct about the concept, with no slang or idioms that do not translate.
- **Meaning.** Any new color, kanji or symbol is explained in [docs/semiotics.md](docs/semiotics.md) and on the `/meaning` page before it ships. Say whether the meaning is a fact or a design intent.
- **Tests.** The scoring engine must stay covered. A change to weights or categories needs a new profile version and updated tests.
- **Existing behavior.** Do not rewrite what already works unless the change needs it.

### Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Write the subject in the imperative and keep it short.

```
feat(ui): add back to top button
fix(changelog): reset scroll position when the page opens
docs(readme): remove merge leftovers
chore(release): v0.2.0
```

Common types are `feat`, `fix`, `docs`, `style`, `refactor`, `test` and `chore`.

### Versions and the changelog

Every released change adds an entry to `src/changelog/entries.ts` in every supported language and to `docs/CHANGELOG.md`, and updates the version in `package.json`. A test fails if they disagree. The rules for choosing a version number are at the top of `docs/CHANGELOG.md`.

## Adding a language

1. Create `src/i18n/<code>.ts` that exports an object typed as `Messages`. TypeScript lists every missing key.
2. Register it in `src/i18n/index.tsx`, in `LOCALES`, `localeLabels` and `dictionaries`.
3. Add that language to each text in `src/changelog/entries.ts`. The compiler points to each one.
4. Run the tests. They check that every language has the same keys and the same placeholders.

Keep the kanji that belong to the identity untranslated: the logo, the pillars, the numerals and the seal marks.

## Adding a profile

Follow the steps in the README, under "Adding a new profile". Include the dictionary entries in every language and a test for the weights.

## Sending a pull request

1. Fork the repository and create a branch from `master`.
2. Keep the change focused. One idea per pull request.
3. Run the checks above.
4. Describe what changed and why, and link the issue if there is one.

A maintainer will review it. Feedback is part of the process and nothing personal.

## License

By contributing, you agree that your work is released under the [MIT License](LICENSE).
