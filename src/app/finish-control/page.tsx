import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function FinishControlPage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId = "active", raceId } = await searchParams;
  return <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="mobile-finish" />;
}
