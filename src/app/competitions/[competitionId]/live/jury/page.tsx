import { Suspense } from "react";
import { LiveRaceCenter } from "@/components/live/LiveRaceCenter";

export default async function CompetitionLiveJuryPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-race-background text-race-muted">Loading jury live</main>}>
      <LiveRaceCenter competitionId={decodeURIComponent(competitionId)} />
    </Suspense>
  );
}
