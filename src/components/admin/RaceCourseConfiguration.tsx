"use client";

import { useState } from "react";
import type { CourseType, Race } from "@/types/live-race";
import { calculateLapDistance, distanceToMeters, saveRaceCourseConfiguration, saveCheckpoints } from "@/services/courseSetupService";
import { NumberStepper } from "./NumberStepper";

const distances = [250, 500, 750, 1000, 1500, 2000, 3000, 5000, 6000];
const courseTypes: CourseType[] = ["STRAIGHT", "OUT_AND_BACK", "LOOP", "MULTI_LAP", "SPRINT", "HEAD_RACE", "CUSTOM"];

export function RaceCourseConfiguration({ competitionId, race, userId, role }: { competitionId: string; race: Race | null; userId: string; role: string }) {
  const [distanceValue, setDistanceValue] = useState(race?.distanceMeters ?? race?.distance ?? 2000);
  const [unit, setUnit] = useState<"m" | "km">("m");
  const [courseType, setCourseType] = useState<CourseType>(race?.courseType ?? "STRAIGHT");
  const [lapCount, setLapCount] = useState(race?.lapCount ?? 1);
  const distanceMeters = distanceToMeters(distanceValue, unit);
  const lapDistance = calculateLapDistance(distanceMeters, lapCount);

  async function save() {
    if (!race?.id) return;
    await saveRaceCourseConfiguration(competitionId, race.id, { distanceMeters, courseType, lapCount, startLabel: "Start Line", finishLabel: "Finish Line" }, userId, role);
    await saveCheckpoints(competitionId, race.id, [
      { id: "start", name: "START", distanceMeters: 0, type: "START" },
      { id: "finish", name: "FINISH", distanceMeters, type: "FINISH" }
    ], userId, role);
  }

  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Distance / Course</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs"><span className="text-race-muted">Distance</span><div className="mt-2 flex rounded-md border border-white/10"><input type="number" value={distanceValue} onChange={(event) => setDistanceValue(Number(event.target.value))} className="min-h-11 min-w-0 flex-1 bg-race-background px-3" /><select value={unit} onChange={(event) => setUnit(event.target.value as "m" | "km")} className="bg-race-background px-2"><option value="m">m</option><option value="km">km</option></select></div></label>
        <label className="text-xs"><span className="text-race-muted">Type</span><select value={courseType} onChange={(event) => setCourseType(event.target.value as CourseType)} className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3">{courseTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
        <NumberStepper label="Nombre de tours" value={lapCount} min={1} onChange={setLapCount} />
        <div className="text-xs text-race-muted"><p>Préconfigurations</p><div className="mt-2 flex flex-wrap gap-2">{distances.map((distance) => <button key={distance} type="button" onClick={() => { setDistanceValue(distance); setUnit("m"); }} className="rounded-md border border-white/10 px-2 py-1">{distance} m</button>)}</div></div>
      </div>
      {courseType === "MULTI_LAP" && <p className="mt-3 text-xs text-race-muted">Distance par tour : {lapDistance.toFixed(0)} m</p>}
      <button type="button" disabled={!race?.id} onClick={save} className="mt-4 h-11 rounded-md bg-race-primary px-4 text-xs font-bold text-white disabled:opacity-40">Enregistrer</button>
    </section>
  );
}
