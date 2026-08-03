import { Suspense } from "react";
import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function FinishControlPage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId, raceId } = await searchParams;
  return (
    <Suspense fallback={<main className="text-race-muted">Chargement Finish</main>}>
      <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="finish" />
    </Suspense>
  );
}
