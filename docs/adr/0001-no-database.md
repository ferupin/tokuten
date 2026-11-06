# 1. No database and no saved state

## Status

Accepted.

## Context

Tokuten is a personal tool for formalizing and calculating a score. There is no need to keep evaluations on a server, and keeping nothing removes accounts, privacy concerns and hosting cost.

## Decision

The app is a static site with no backend. State lives in memory while the page is open. Users keep their work by exporting JSON or Markdown, and can import JSON to continue.

## Consequences

An accidental refresh loses unsaved work. An optional draft kept in the browser is planned as a later feature, off by default.
