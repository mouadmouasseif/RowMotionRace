import { Suspense } from "react";
import { RaceSetupCenter } from "@/components/admin/RaceSetupCenter";

export default async function RaceSetupPage({ params }: { params: Promise<{ competitionId: string; raceId: string }> }) {
  const { competitionId, raceId } = await params;
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-race-background text-race-muted">Loading race setup</main>}>
      <RaceSetupCenter competitionId={decodeURIComponent(competitionId)} raceId={decodeURIComponent(raceId)} />
    </Suspense>
  );
}
