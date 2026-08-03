import { RaceControlExperience } from "@/components/race-control/RaceControlExperience";

export default async function MobileJudgePage({ searchParams }: { searchParams: Promise<{ competitionId?: string; raceId?: string }> }) {
  const { competitionId, raceId } = await searchParams;
  return <RaceControlExperience competitionId={competitionId} raceId={raceId} mode="mobile-jury" />;
}
