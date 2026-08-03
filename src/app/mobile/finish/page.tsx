import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function MobileFinishPage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId, raceId } = await searchParams;
  return <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="mobile-finish" />;
}
