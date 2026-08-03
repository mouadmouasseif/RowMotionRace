import { Suspense } from "react";
import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function RaceControlPage({ params, searchParams }: { params: Promise<{ competitionId: string }>; searchParams: Promise<{ raceId?: string }> }) {
  const { competitionId } = await params;
  const { raceId } = await searchParams;
  return (
    <Suspense fallback={<main className="text-race-muted">Chargement Race Control</main>}>
      <RaceControlExperience competitionId={decodeURIComponent(competitionId)} raceId={raceId} mode="control" />
    </Suspense>
  );
}
