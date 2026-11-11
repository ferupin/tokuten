# 0009. Local draft

## Status

Accepted, version 0.5.0. Refines ADR 0001.

## Context

ADR 0001 kept all state in memory. An evaluation can take a long time, and a refresh, a closed tab, a crash or a power cut loses all of it. Losing hours of work is the quickest way to make someone stop using a tool. The rule behind ADR 0001 was never about the browser. It was about servers, accounts and privacy.

## Decision

Keep a draft of the evaluation in `localStorage`, on this device only.

- **On by default**, with a visible line that says where the work is kept and a switch to turn it off. People who never read the settings are the ones who need the protection most.
- **Saved after every change** with a short delay, and at once when the page is hidden or closed.
- **Offered back, never forced.** A stored draft appears as a prompt to restore or discard. Nothing is written while that choice is pending, so a fresh page cannot overwrite it.
- **Blank is not saved.** Opening the app and leaving leaves nothing behind.
- **Turning it off deletes the copy**, and Start over deletes the draft.
- **With the draft off**, leaving a page that holds work asks for confirmation.
- **Preferences are kept apart** from the draft: draft on or off, grading mode and export format. They survive Start over.
- The draft is validated with the same schema as the JSON import. Anything broken, foreign or out of range is ignored.
- All storage calls live in one module and are wrapped, so blocked or full storage degrades to the old behavior.

The pure rules (envelope, validation, what counts as blank, preferences) are in `src/core/draft.ts` and tested without a browser.

## Consequences

- The footer no longer says nothing is stored. It says nothing is sent and that a draft stays on the device.
- A draft belongs to one browser. It does not sync, and clearing site data removes it. JSON export remains the way to keep an evaluation for good.
- Changing the profile in a way that breaks the schema makes older drafts unreadable, so they are ignored. The profile version policy already covers that case.
