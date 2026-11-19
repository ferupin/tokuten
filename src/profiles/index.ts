import type { Profile } from "@/core/types";
import { kamenRiderProfile } from "./kamen-rider";
import { sentaiProfile } from "./sentai";

/**
 * Registry of available profiles. A new profile is added here, together with
 * its own entry in every i18n dictionary.
 */
export const profileList: readonly Profile[] = [sentaiProfile, kamenRiderProfile];

export const profiles: Record<string, Profile> = Object.fromEntries(profileList.map((p) => [p.id, p]));

/** The profile served at the root of the site. It never changes, so old links keep working. */
export const defaultProfileId = sentaiProfile.id;

export function getProfile(id: string): Profile {
  const profile = Object.hasOwn(profiles, id) ? profiles[id] : undefined;
  if (!profile) throw new Error(`Unknown profile: ${id}`);
  return profile;
}

/** Where a profile lives. The default profile is the home page. */
export function profileRoute(id: string): string {
  return id === defaultProfileId ? "/" : `/${id}`;
}
