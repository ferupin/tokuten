# Tokuten 特点

**Score a tokusatsu season the same way every time.**

Tokuten applies **Kijun 基準**, a method with ten weighted categories, clear criteria and a score that stays apart from personal enjoyment. It runs entirely in your browser: no account, no server, nothing uploaded.

### → [Open the app: tokuten-snowy.vercel.app](https://tokuten-snowy.vercel.app)

## What you get

- **Two ways to grade.** Detailed (詳細) through subcriteria, or Quick (簡易) with one grade per category.
- **A fair official score.** Categories that do not apply share their weight, and a partial score says so.
- **Enjoyment kept apart.** Your personal score never touches the official one.
- **Share it.** Save a card as an image in three layouts, or send a short link. Notes are never included.
- **Take it anywhere.** Export Markdown for any forum or for Obsidian, and JSON to open again later.
- **English, Português, Español**, with light and dark themes.

## Where the project is

- [x] Super Sentai profile, scoring engine and tests
- [x] Detailed and Quick modes, consistency checklist, reference points for grades
- [x] Markdown (Standard and Obsidian) and JSON export, local draft
- [x] Share as image and as link
- [x] English, Portuguese, Spanish
- [x] Stable file format ([promise](docs/file-format.md))
- [ ] 1.0.0
- [ ] Kamen Rider profile
- [ ] Compare seasons side by side
- [ ] Sensitivity view
- [ ] Keyboard shortcuts and an accessibility pass

Details and sizes are in the [roadmap](docs/ROADMAP.md).

## How you can help

Pick one, open an issue to say so, and send a pull request. The [contributing guide](CONTRIBUTING.md) has the setup.

- [ ] **Translate** into Japanese, French, German or another language. One file and one line, see [adding a language](CONTRIBUTING.md#adding-a-language).
- [ ] **Review the Spanish and Portuguese** wording for naturalness.
- [ ] **Propose a profile**, such as Kamen Rider. Open an issue first, because categories and weights deserve a discussion.
- [ ] **Test it** with a screen reader, on a phone, in Safari or Firefox, and tell us what felt wrong.
- [ ] **Report a bug or an idea** through an [issue](https://github.com/ferupin/tokuten/issues/new/choose). The version in the footer and a JSON export help a lot.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # scoring engine and format tests
npm run build    # static site in out/
```

Needs Node.js 20.9 or newer. Built with Next.js, React, TypeScript, Tailwind CSS, Zustand and Zod. The full stack and the code layout are in [development](docs/development.md).

## Read more

[Method](docs/framework.md) · [File format](docs/file-format.md) · [Changelog](docs/CHANGELOG.md) · [Roadmap](docs/ROADMAP.md) · [Design system](docs/design-system.md) · [Meaning of the symbols](docs/semiotics.md) · [Decisions](docs/adr) · [Development](docs/development.md)

Made by [ferupin](https://github.com/ferupin) · [MIT License](LICENSE)
