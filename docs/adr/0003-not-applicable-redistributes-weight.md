# 3. Not applicable categories redistribute weight

## Status

Accepted.

## Context

The original method says that if something cannot be evaluated, the reason should be explained instead of inventing a score. It does not say what happens to that category's weight. Silently treating it as an average grade would distort the result.

## Decision

A category marked as not applicable is removed, and its weight is shared among the remaining categories in proportion to their own weights. The interface shows the effective weights, and the Markdown export states that a redistribution happened.

Categories that apply but are not graded yet are left out and the score is marked as partial. They are never counted as an average grade.

## Consequences

Scores of seasons with different applicable categories are still on the same 0 to 10 scale, but they are not computed from identical weights. The note in the export makes this visible.
