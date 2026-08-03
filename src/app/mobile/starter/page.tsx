import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function MobileStarterPage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId, raceId } = await searchParams;
  return <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="mobile-starter" />;
}
