# 0011. One registry for languages

## Status

Accepted, version 0.8.0.

## Context

Until 0.7.2 a language lived in four places. The dictionary file was one. The list of languages, the label and the lookup table in `src/i18n/index.tsx` were the others, and the dictionary tests imported each dictionary by hand. Every changelog text also had to exist in every language, so the whole history of the app had to be translated before a language could compile.

Spanish was the third language, and the project wants more, such as Japanese, French and German. Each of them would have repeated that work. The cost was highest for the people most likely to help: someone who wants to translate the interface should not also have to translate every past release.

## Decision

A single registry, `src/i18n/languages.ts`, lists every language. Each entry has a `label` written in that language and its `messages`. The `Locale` type, the list used by the language menu, the check on the saved preference and the dictionary tests all derive from it.

- **One file and one line.** A language is a dictionary file typed as `Messages`, plus one line in the registry. TypeScript reports every missing key.
- **Tests follow the registry.** The dictionary tests run for each registered language: same keys as English, same placeholders, no empty text, no em dashes, complete profile text. A new language is checked without editing a test. A further test fails when a dictionary is mostly a copy of English.
- **Labels in their own language.** A person who cannot read the current interface can still find their language in the menu.
- **The changelog falls back to English.** A changelog text requires English and accepts any other language. When a translation is missing, the English text is shown. English, Portuguese and Spanish are kept complete, and a test enforces that list. Other languages can be partial and still be usable.
- **English stays the starting language.** Only a language chosen on purpose is remembered, as before.

## Consequences

- Adding a language is a small, reviewable pull request. The changelog translation can follow later, in pieces.
- A partial changelog is visible to readers as English text among translated text. That is deliberate, since a missing sentence is better than a missing language.
- The list of fully maintained languages in the changelog test is a manual choice. When a language becomes complete, add it there.
- Spanish was written by the maintainer without a native review. Corrections are welcome.

## Alternatives considered

- **Detect the language from the browser.** Rejected before, because the interface should always start predictably in English.
- **Load dictionaries on demand.** With three languages the saving is small and the loading state adds complexity. It becomes worth revisiting with many languages.
- **A translation service or format such as gettext.** The typed dictionaries give compile time checks with no extra tooling, which suits a project with no server.
