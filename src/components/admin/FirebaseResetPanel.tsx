"use client";

import { useState } from "react";
import type { ResetScope } from "@/types/live-race";
import { getResetConfirmationText, requestReset, resetLabels } from "@/services/firebaseResetService";

const scopes = Object.keys(resetLabels) as ResetScope["kind"][];

export function FirebaseResetPanel({ competitionId, competitionName, raceId, userId, role }: { competitionId: string; competitionName: string; raceId?: string; userId: string; role: string }) {
  const [kind, setKind] = useState<ResetScope["kind"]>("CURRENT_RACE");
  const [confirmation, setConfirmation] = useState("");
  const expected = getResetConfirmationText(competitionName);
  const critical = kind === "FULL_COMPETITION" || kind === "COMPETITION_RESULTS" || kind === "CURRENT_RACE";

  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Firebase Data Management</h2>
      <select value={kind} onChange={(event) => setKind(event.target.value as ResetScope["kind"])} className="mt-4 w-full rounded-md border border-white/10 bg-race-background px-3 py-2 text-xs">
        {scopes.map((scope) => <option key={scope} value={scope}>{resetLabels[scope]}</option>)}
      </select>
      {critical && <div className="mt-4 rounded-lg border border-race-warning/30 bg-race-warning/10 p-3 text-xs"><p>Vous êtes sur le point de réinitialiser : {competitionName}</p><p className="mt-2 text-race-muted">Cette action affectera les courses, chronos, résultats, pénalités ou sessions live, mais jamais users, athletes, coaches ou clubs.</p><p className="mt-2 font-mono">Tapez : {expected}</p></div>}
      <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={expected} className="mt-3 w-full rounded-md border border-white/10 bg-race-background px-3 py-2 text-xs" />
      <button type="button" disabled={confirmation !== expected || (kind === "FULL_COMPETITION" && role !== "SUPER_ADMIN")} onClick={() => requestReset({ kind, competitionId, raceId }, userId, role, confirmation, competitionName)} className="mt-3 h-11 w-full rounded-md bg-race-danger text-xs font-bold text-white disabled:opacity-40">Confirmer le reset</button>
    </section>
  );
}
