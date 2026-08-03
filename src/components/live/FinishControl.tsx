"use client";

import type { RaceEntry, RaceFinish } from "@/types/live-race";
import { registerFinish } from "@/services/finishService";
import { formatMs } from "./live-format";

export function FinishControl({ competitionId, raceId, entries, finishes, userId }: { competitionId: string; raceId?: string; entries: RaceEntry[]; finishes: RaceFinish[]; userId: string }) {
  const finished = new Map(finishes.map((finish) => [finish.id, finish]));
  return (
    <div className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.07]">
      {entries.length === 0 ? <p className="p-3 text-xs text-race-muted">Lanes: Not configured</p> : entries.map((entry) => {
        const finish = finished.get(entry.id);
        return (
          <div key={entry.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 p-3 text-xs">
            <span className="font-mono text-race-primary">Lane {entry.lane}</span>
            <div className="min-w-0"><p className="truncate font-medium">Boat {entry.boatNumber || "Not available"} • {entry.athleteName || "Athlete not available"}</p><p className="text-race-muted">{finish ? `#${finish.rank} • ${formatMs(finish.finishTimeMs)}` : "Waiting"}</p></div>
            <button type="button" disabled={!raceId || Boolean(finish)} onClick={() => raceId && registerFinish(competitionId, raceId, entry.id, userId)} className="h-10 rounded-md bg-race-danger px-3 text-[10px] font-black text-white disabled:bg-white/[0.06] disabled:text-race-muted">FINISH</button>
          </div>
        );
      })}
    </div>
  );
}
