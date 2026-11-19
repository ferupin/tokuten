"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useStore } from "zustand";
import { defaultProfileId, getProfile } from "@/profiles";
import { createEvaluationStore, type EvaluationState, type EvaluationStore } from "./store";

/**
 * One in-memory store per profile, created the first time it is needed and kept for
 * the life of the page. Switching profiles by navigating inside the app therefore
 * brings the grades back as they were left, with no reload and no reading from disk.
 */
const stores = new Map<string, EvaluationStore>();

export function storeFor(profileId: string): EvaluationStore {
  let store = stores.get(profileId);
  if (!store) {
    store = createEvaluationStore(getProfile(profileId));
    stores.set(profileId, store);
  }
  return store;
}

/** The profile worked on last, so pages that are not tied to a profile know which one to show. */
let lastProfile = defaultProfileId;
export const lastProfileId = () => lastProfile;

const StoreContext = createContext<EvaluationStore | null>(null);

export function ProfileProvider({ profileId, children }: { profileId: string; children: ReactNode }) {
  lastProfile = profileId;
  return <StoreContext.Provider value={storeFor(profileId)}>{children}</StoreContext.Provider>;
}

/** The store of the profile this part of the page belongs to. Event handlers read it with getState(). */
export function useEvaluationStoreApi(): EvaluationStore {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useEvaluationStoreApi needs a ProfileProvider above it");
  return store;
}

export function useEvaluationStore<T>(selector: (state: EvaluationState) => T): T {
  return useStore(useEvaluationStoreApi(), selector);
}
