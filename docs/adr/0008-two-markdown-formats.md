# 0008. Two Markdown formats

## Status

Accepted, version 0.4.0.

## Context

The evaluation is exported as Markdown to be pasted into forums, GitHub or a notes vault. Obsidian understands more than plain Markdown: properties in YAML frontmatter, callouts, collapsible blocks, highlights, comments and Mermaid charts. A forum or GitHub shows most of that as loose text, with the frontmatter printed above the title.

## Decision

Keep two formats, chosen in the interface.

- **Standard** is the existing output and does not change.
- **Obsidian** carries the same data in the same order, and adds what Obsidian can render.

Both live in `src/core`, are pure functions of the evaluation and the result, and share the translation function. `exportAs` picks one by name.

Rules followed in the Obsidian format:

- Property names are lowercase with underscores, values are quoted when text, numbers are literal, tags are a list without the hash.
- Callouts use built in types only. Categories use `note`, or `question` when still ungraded, so no color suggests a verdict on a grade. Collapsible with `+` so the reasoning is open by default, and `-` for categories that do not apply.
- Table cells escape the pipe character. Subcriteria are a table (version 0.6.0). In the Obsidian format it sits inside the callout, after a blank callout line so it renders, and has a gauge column.
- The reasoning is never put in a table. A cell holds one line, and the reasoning is long prose.
- The Mermaid chart is only added when at least one category has a contribution.
- The personal enjoyment score sits on its own line under the official score, labeled as separate, and is never part of the calculation.

## Consequences

- Two functions to keep in step when the output format of the method changes. Tests check the shared structure.
- Frontmatter keys are English in both languages, so a vault can query them the same way whatever the interface language is.
