import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function StartControlPage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId = "active", raceId } = await searchParams;
  return <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="mobile-starter" />;
}
