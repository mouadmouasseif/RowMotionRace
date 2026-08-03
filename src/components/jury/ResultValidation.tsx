"use client";

import type { Race } from "@/types/live-race";
import { validateResults } from "@/services/juryService";

export function ResultValidation({ competitionId, race, userId, role }: { competitionId: string; race: Race | null; userId: string; role: string }) {
  const canValidate = Boolean(race?.id) && (role === "CHIEF_JUDGE" || role === "ADMIN" || role === "SUPER_ADMIN");
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Result Validation</h2>
      <p className="mt-3 text-xs text-race-muted">Status: {race?.resultsStatus ?? "PROVISIONAL"}</p>
      <button type="button" disabled={!canValidate || race?.resultsStatus === "OFFICIAL"} onClick={() => race?.id && validateResults(competitionId, race.id, userId, role)} className="mt-4 h-11 w-full rounded-md bg-race-success text-xs font-bold text-white disabled:opacity-40">Validate Official Results</button>
    </section>
  );
}
