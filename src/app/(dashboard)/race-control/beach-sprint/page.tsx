import { Suspense } from "react";
import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function BeachSprintPage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId, raceId } = await searchParams;
  return (
    <Suspense fallback={<main className="text-race-muted">Chargement Beach Sprint</main>}>
      <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="beach" />
    </Suspense>
  );
}
