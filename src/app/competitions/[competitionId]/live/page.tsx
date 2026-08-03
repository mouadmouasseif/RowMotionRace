import { Suspense } from "react";
import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function CompetitionLivePage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-race-background text-race-muted">Chargement live</main>}>
      <RaceControlExperience competitionId={decodeURIComponent(competitionId)} mode="public-admin" />
    </Suspense>
  );
}
