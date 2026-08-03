import { Suspense } from "react";
import { CompetitionHub } from "@/components/competitions/CompetitionHub";

export default async function CompetitionDashboardPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  return (
    <Suspense fallback={<main className="text-race-muted">Loading competition</main>}>
      <CompetitionHub competitionId={decodeURIComponent(competitionId)} />
    </Suspense>
  );
}
