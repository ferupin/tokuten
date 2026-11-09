# 7. Detailed and Quick evaluation modes

## Status

Accepted.

## Context

Grading ten categories through their subcriteria is thorough but slow. Sometimes a quick and still consistent result is enough. A second, separate calculation for quick grades would risk two scores that mean different things.

## Decision

The mode is a field of the evaluation: `detailed` or `quick`. It only changes how a category grade is entered. In Quick mode the slider writes the same manual grade that Detailed mode already supported, so the scoring engine does not change and does not read the mode at all. A test checks that both modes give identical results for identical data.

Switching modes never discards data. The mode is saved in the JSON export, and files exported before modes existed load as detailed. Starting over keeps the chosen mode. The Markdown export records a quick evaluation and leaves the subcriteria out.

The modes are named Detailed (詳細) and Quick (簡易). Each Quick slider shows its grade band and description, so speed does not remove the anchors that keep grading consistent.

## Consequences

One score, one calculation, two ways in. A grade set directly in Quick mode replaces the subcriteria average, and the interface says so. The preferred mode is not remembered between visits, in line with the rule that nothing is stored without being asked.
