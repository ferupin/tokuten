import {
  defaultPreferences,
  parseDraft,
  parsePreferences,
  toDraft,
  type DraftParse,
  type Preferences,
} from "@/core/draft";
import type { Evaluation, Profile } from "@/core/types";

/**
 * The only place that touches localStorage for evaluations. Every call is
 * wrapped, because storage can be blocked, full or missing (private windows,
 * strict settings). When it fails the app simply works as it always did.
 */

const DRAFT_KEY = "tokuten.draft";
const PREFS_KEY = "tokuten.prefs";

export function readPreferences(): Preferences {
  try {
    return parsePreferences(localStorage.getItem(PREFS_KEY));
  } catch {
    return defaultPreferences;
  }
}

export function writePreferences(patch: Partial<Preferences>): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...readPreferences(), ...patch }));
  } catch {
    /* ignore */
  }
}

export function readDraft(profile: Profile): DraftParse {
  try {
    return parseDraft(localStorage.getItem(DRAFT_KEY), profile);
  } catch {
    return { ok: false };
  }
}

/** Returns false when the draft could not be written, for example storage full. */
export function writeDraft(evaluation: Evaluation): boolean {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(toDraft(evaluation)));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
