"use client";

import type { Race, RaceEntry, RacePenalty } from "@/types/live-race";
import { JuryPenaltyPanel } from "./JuryPenaltyPanel";
import { PenaltyEditor } from "./PenaltyEditor";
import { ResultValidation } from "./ResultValidation";

export function JuryPanel({ competitionId, race, entries, penalties, userId, role }: { competitionId: string; race: Race | null; entries: RaceEntry[]; penalties: RacePenalty[]; userId: string; role: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <JuryPenaltyPanel competitionId={competitionId} raceId={race?.id} entries={entries} userId={userId} role={role} />
      <PenaltyEditor competitionId={competitionId} penalties={penalties} userId={userId} role={role} />
      <ResultValidation competitionId={competitionId} race={race} userId={userId} role={role} />
    </div>
  );
}
