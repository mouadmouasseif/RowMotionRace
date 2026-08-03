"use client";

import { AlertTriangle, Flag, Play, RotateCcw, Square, UserCheck } from "lucide-react";
import type { Race, RaceEntry } from "@/types/live-race";
import { cancelStart, markAttention, restartRace, startRaceClock } from "@/services/chronoService";
import { setRaceStatus } from "@/services/raceService";
import { formatDistance, raceDistanceMeters } from "./live-format";

export function LiveStartControl({ competitionId, race, races, entries, onRaceChange, userId }: { competitionId: string; race: Race | null; races: Race[]; entries: RaceEntry[]; onRaceChange: (raceId: string) => void; userId: string }) {
  const raceId = race?.id;
  const canUse = Boolean(raceId);

  return (
    <section className="race-card rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Start Control</h2>
        <select value={race?.id ?? ""} onChange={(event) => onRaceChange(event.target.value)} className="min-w-0 rounded-md border border-white/10 bg-race-background px-2 py-2 text-xs">
          <option value="">Race: Not configured</option>
          {races.map((nextRace) => <option key={nextRace.id} value={nextRace.id}>Race {nextRace.raceNumber} - {nextRace.name}</option>)}
        </select>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Action icon={Flag} label="Ready" disabled={!canUse} onClick={() => raceId && setRaceStatus(competitionId, raceId, "READY", userId)} />
        <Action icon={AlertTriangle} label="Attention" disabled={!canUse || race?.status !== "READY"} onClick={() => raceId && markAttention(competitionId, raceId, userId)} />
        <Action icon={Play} label="GO" strong disabled={!canUse || race?.status !== "START_SEQUENCE"} onClick={() => raceId && startRaceClock(competitionId, raceId, userId)} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Action icon={Square} label="Faux départ" disabled={!canUse} onClick={() => raceId && cancelStart(competitionId, raceId, userId)} />
        <Action icon={RotateCcw} label="Redémarrer" disabled={!canUse} onClick={() => raceId && restartRace(competitionId, raceId, userId)} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-white/[0.07] p-3 text-xs">
        <Info label="Distance" value={formatDistance(raceDistanceMeters(race))} />
        <Info label="Boats" value={String(race?.numberOfBoats ?? "Waiting")} />
        <Info label="Ready athletes" value={`${entries.filter((entry) => entry.status === "PRESENT" || entry.status === "READY").length} / ${race?.numberOfBoats ?? entries.length}`} />
      </div>
      <div className="mt-4 divide-y divide-white/[0.06] rounded-lg border border-white/[0.07]">
        {entries.length === 0 ? <p className="p-3 text-xs text-race-muted">Athlètes au départ: Not configured</p> : entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 p-3 text-xs">
            <span className="grid size-8 place-items-center rounded-md bg-race-primary/15 font-bold text-race-primary">{entry.lane}</span>
            <div className="min-w-0 flex-1"><p className="truncate font-medium">Lane {entry.lane} - Boat {entry.boatNumber || "Not available"}</p><p className="truncate text-race-muted">{entry.athleteName || "Athlete not available"} • {entry.clubName || "Club not available"}</p></div>
            <span className="inline-flex items-center gap-1 text-race-muted"><UserCheck className="size-3" /> {entry.status || "Waiting"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-race-muted">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}

function Action({ icon: Icon, label, disabled, strong, onClick }: { icon: typeof Flag; label: string; disabled?: boolean; strong?: boolean; onClick: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-35 ${strong ? "bg-race-success text-white" : "border border-white/10 bg-white/[0.04]"}`}><Icon className="size-4" />{label}</button>;
}
