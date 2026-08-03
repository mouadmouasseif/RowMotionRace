"use client";

import { useState } from "react";
import type { Race, RaceLane } from "@/types/live-race";
import { generateLanes, setLaneEnabled } from "@/services/courseSetupService";
import { NumberStepper } from "./NumberStepper";

export function LaneConfigurationPanel({ competitionId, race, lanes, userId, role }: { competitionId: string; race: Race | null; lanes: RaceLane[]; userId: string; role: string }) {
  const [count, setCount] = useState(race?.numberOfLanes ?? (lanes.length || 6));
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Number of Lanes</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <NumberStepper label="Nombre de couloirs disponibles" value={count} min={0} onChange={setCount} />
        <button type="button" disabled={!race?.id} onClick={() => race?.id && generateLanes(competitionId, race.id, count, userId, role)} className="self-end rounded-md bg-race-primary px-4 py-3 text-xs font-bold text-white disabled:opacity-40">Générer les couloirs</button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {lanes.length === 0 ? <p className="text-xs text-race-muted">Lanes not configured</p> : lanes.map((lane) => (
          <button key={lane.id} type="button" onClick={() => race?.id && setLaneEnabled(competitionId, race.id, lane.id, !lane.enabled, userId, role)} className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs ${lane.enabled ? "border-race-success/30 bg-race-success/10" : "border-white/10 bg-white/[0.03] text-race-muted"}`}>
            <span>Lane {lane.number}</span><span>{lane.enabled ? "Active" : "Disabled"}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
