# 2. Profiles as data, engine as pure functions

## Status

Accepted.

## Context

The first method is for Super Sentai, but Kamen Rider and others are expected. Their categories and weights will differ.

## Decision

A profile is a plain object that lists pillars, categories, weights and subcriteria by id. The scoring engine in `src/core` is made of pure functions that take a profile and an evaluation. All visible text lives in the i18n dictionaries under `profiles.<id>`.

## Consequences

A new franchise needs a new profile file and dictionary entries, and no change to the engine. The engine can be tested without a browser.
