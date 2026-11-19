import { notFound } from "next/navigation";
import { Evaluator } from "@/features/evaluation/evaluator";
import { defaultProfileId, profileList } from "@/profiles";

/** Every profile except the default one gets its own static page, at /<profile id>/. */
export const dynamicParams = false;

export function generateStaticParams() {
  return profileList.filter((p) => p.id !== defaultProfileId).map((p) => ({ profile: p.id }));
}

const titles: Record<string, string> = { "kamen-rider": "Kamen Rider 仮面ライダー" };

export async function generateMetadata({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  return { title: `${titles[profile] ?? profile} | Tokuten 特点` };
}

export default async function Page({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  if (!profileList.some((p) => p.id === profile && p.id !== defaultProfileId)) notFound();
  return <Evaluator profileId={profile} />;
}
