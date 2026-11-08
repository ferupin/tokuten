# 6. A semiotics document with a matching page

## Status

Accepted.

## Context

The identity of Tokuten relies on names, kanji, colors and a seal. The design system document already explains how these are built, but it does not explain what they mean. Mixing both in one file would blur two different questions.

## Decision

Meaning lives in its own document, `docs/semiotics.md`. The design system keeps tokens, fonts and accessibility, and only points to the new document. The app shows a page at `/meaning` that teaches the same content using the real elements of the interface, such as the seal, the pillar colors and both themes.

The document marks every claim as either a fact or a design intent, so a visitor can tell tradition from a project choice.

## Consequences

A new symbol needs an entry in the document and on the page before it ships. A dictionary test checks that every pillar of every profile has a meaning text in each language, so a new profile cannot forget it.
