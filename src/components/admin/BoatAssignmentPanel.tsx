"use client";

import { useState } from "react";
import type { Race, RaceBoat, RaceEntry } from "@/types/live-race";
import { generateBoatPlaces, updateBoatAssignment } from "@/services/courseSetupService";
import { NumberStepper } from "./NumberStepper";

export function BoatAssignmentPanel({ competitionId, race, boats, entries, userId, role }: { competitionId: string; race: Race | null; boats: RaceBoat[]; entries: RaceEntry[]; userId: string; role: string }) {
  const [count, setCount] = useState(race?.numberOfBoats ?? (boats.length || 4));
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Race Configuration → Boats</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <NumberStepper label="Nombre de bateaux dans cette course" value={count} min={0} onChange={setCount} />
        <button type="button" disabled={!race?.id} onClick={() => race?.id && generateBoatPlaces(competitionId, race.id, count, userId, role)} className="self-end rounded-md bg-race-primary px-4 py-3 text-xs font-bold text-white disabled:opacity-40">Générer les places</button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {boats.length === 0 ? <p className="text-xs text-race-muted">Boats not configured</p> : boats.map((boat) => (
          <BoatCard key={boat.id} competitionId={competitionId} raceId={race?.id} boat={boat} entries={entries} userId={userId} role={role} />
        ))}
      </div>
    </section>
  );
}

function BoatCard({ competitionId, raceId, boat, entries, userId, role }: { competitionId: string; raceId?: string; boat: RaceBoat; entries: RaceEntry[]; userId: string; role: string }) {
  const [boatNumber, setBoatNumber] = useState(boat.boatNumber);
  const [entryId, setEntryId] = useState(boat.athleteId ?? "");
  const entry = entries.find((item) => item.athleteId === entryId || item.id === entryId);
  return (
    <article className="rounded-lg border border-white/[0.07] p-3 text-xs">
      <p className="font-semibold">Boat {String(boat.boatNumber).padStart(2, "0")}</p>
      <label className="mt-3 block text-race-muted">Boat Number<input type="number" value={boatNumber} onChange={(event) => setBoatNumber(Number(event.target.value))} className="mt-1 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text" /></label>
      <label className="mt-3 block text-race-muted">Athlete / Crew<select value={entryId} onChange={(event) => setEntryId(event.target.value)} className="mt-1 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text"><option value="">Not assigned</option>{entries.map((item) => <option key={item.id} value={item.athleteId || item.id}>{item.athleteName} • {item.clubName}</option>)}</select></label>
      <button type="button" disabled={!raceId} onClick={() => raceId && updateBoatAssignment(competitionId, raceId, boat.id, { boatNumber, athleteId: entry?.athleteId, athleteName: entry?.athleteName, clubId: entry?.clubId, clubName: entry?.clubName }, userId, role)} className="mt-3 h-9 rounded-md bg-race-success px-3 text-[10px] font-bold text-white disabled:opacity-40">Enregistrer</button>
    </article>
  );
}
