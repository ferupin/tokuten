import type { Profile } from "@/core/types";
import { sentaiProfile } from "./sentai";

/**
 * Registry of available profiles. A future Kamen Rider profile is added here
 * together with its own entry in the i18n dictionaries.
 */
export const profiles: Record<string, Profile> = {
  [sentaiProfile.id]: sentaiProfile,
};

export const defaultProfileId = sentaiProfile.id;

export function getProfile(id: string): Profile {
  const profile = profiles[id];
  if (!profile) throw new Error(`Unknown profile: ${id}`);
  return profile;
}
