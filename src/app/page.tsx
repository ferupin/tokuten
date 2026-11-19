import { Evaluator } from "@/features/evaluation/evaluator";
import { defaultProfileId } from "@/profiles";

export default function Page() {
  return <Evaluator profileId={defaultProfileId} />;
}
