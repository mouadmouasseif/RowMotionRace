"use client";

import type { RaceEntry, RaceFinish } from "@/types/live-race";
import { FinishControl } from "@/components/live/FinishControl";
import { useRaceChronometer } from "@/hooks/useRaceChronometer";
import type { Race } from "@/types/live-race";

export function FinishJudgeMobile({ competitionId, race, entries, finishes, userId }: { competitionId: string; race: Race | null; entries: RaceEntry[]; finishes: RaceFinish[]; userId: string }) {
  const chrono = useRaceChronometer(race);
  return <div className="mx-auto max-w-sm space-y-4"><section className="race-card rounded-lg p-4 text-center"><p className="font-mono text-4xl text-race-primary">{chrono.formatted}</p></section><FinishControl competitionId={competitionId} raceId={race?.id} entries={entries} finishes={finishes} userId={userId} /></div>;
}
