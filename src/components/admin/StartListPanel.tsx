"use client";

import Link from "next/link";
import type { Race, RaceBoat, RaceLane } from "@/types/live-race";

export function StartListPanel({ competitionId, race, boats, lanes }: { competitionId: string; race: Race | null; boats: RaceBoat[]; lanes: RaceLane[] }) {
  const boatsByLane = new Map(boats.filter((boat) => boat.lane).map((boat) => [boat.lane, boat]));
  const missing = getMissingSetup(race, boats, lanes);
  return (
    <section className="race-card rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">START LIST</h2>
        <div className="flex gap-2"><button className="rounded-md border border-white/10 px-3 py-2 text-[10px] font-bold">Export PDF</button><button className="rounded-md border border-white/10 px-3 py-2 text-[10px] font-bold">Print</button><button className="rounded-md border border-white/10 px-3 py-2 text-[10px] font-bold">Share</button></div>
      </div>
      <div className="mt-4 rounded-lg border border-white/[0.07] p-4 text-xs">
        <p className="font-bold">ROWMOTION-RACE</p>
        <p className="mt-3">Race {race?.raceNumber ?? "Not available"} • {race?.categoryName ?? race?.category ?? "Not available"} • {race?.boatClass ?? "Not available"} • {race?.distanceMeters ?? race?.distance ?? "Not available"} m</p>
        <div className="mt-4 grid gap-2">{lanes.length === 0 ? <p className="text-race-muted">Start list waiting</p> : lanes.map((lane) => {
          const boat = boatsByLane.get(lane.number);
          return <div key={lane.id} className="grid grid-cols-[70px_90px_1fr_1fr] gap-2 rounded-md bg-white/[0.03] px-3 py-2"><span>Lane {lane.number}</span><span>{boat ? `Boat ${String(boat.boatNumber).padStart(2, "0")}` : "EMPTY"}</span><span>{boat?.athleteName || "Not available"}</span><span>{boat?.clubName || "Not available"}</span></div>;
        })}</div>
      </div>
      {missing.length > 0 ? <div className="mt-4 rounded-lg border border-race-warning/30 bg-race-warning/10 p-3 text-xs"><p className="font-semibold">Impossible d&apos;ouvrir la course</p><p className="mt-2 text-race-muted">Configuration manquante : {missing.join(", ")}</p></div> : <Link href={`/competitions/${competitionId}/live?raceId=${race?.id}`} className="mt-4 inline-flex h-11 items-center rounded-md bg-race-success px-4 text-xs font-bold text-white">OPEN LIVE</Link>}
    </section>
  );
}

export function getMissingSetup(race: Race | null, boats: RaceBoat[], lanes: RaceLane[]) {
  const missing: string[] = [];
  if (!race?.categoryName && !race?.category) missing.push("Category");
  if (!race?.raceType) missing.push("Race Type");
  if (!race?.distanceMeters && !race?.distance) missing.push("Distance");
  if (!race?.numberOfBoats || boats.length < race.numberOfBoats) missing.push("Boats");
  if (!race?.numberOfLanes || lanes.length < race.numberOfLanes) missing.push("Lanes");
  if (race?.drawStatus !== "CONFIRMED" && race?.drawStatus !== "LOCKED") missing.push("Lane Draw");
  return missing;
}
