import { sentaiProfile } from "@/profiles/sentai";
import { createEvaluationStore } from "./store";

/**
 * Store for the active profile. Today there is only Sentai. When more
 * profiles exist, this becomes a store created per selected profile.
 */
export const useEvaluationStore = createEvaluationStore(sentaiProfile);
