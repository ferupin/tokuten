# 4. Self-hosted fonts

## Status

Accepted.

## Context

The identity relies on Japanese typefaces. Fetching them from a font service at build time makes the build depend on the network.

## Decision

Fonts are installed from `@fontsource` packages and imported in the root layout.

## Consequences

Builds work offline and the fonts are served from the same host as the site. Japanese glyph files are split by unicode range, so only the ones used are downloaded.
