import { NetworkCameraSetup } from "@/components/system/NetworkCameraSetup";

export default async function SystemCamerasPage({ searchParams }: { searchParams: Promise<{ competitionId?: string }> }) {
  const { competitionId = "active" } = await searchParams;
  return <main className="mx-auto max-w-7xl p-5"><NetworkCameraSetup competitionId={competitionId} /></main>;
}
