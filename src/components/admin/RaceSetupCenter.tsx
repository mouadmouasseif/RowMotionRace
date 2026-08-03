"use client";

import Link from "next/link";
import { useAuth } from "@/features/authentication/auth-provider";
import { useLiveRace } from "@/hooks/useLiveRace";
import { useRaceEntries } from "@/hooks/useRaceEntries";
import { useRaceBoats } from "@/hooks/useRaceBoats";
import { useRaceLanes } from "@/hooks/useRaceLanes";
import { useLiveCameras } from "@/hooks/useLiveCameras";
import { useRaceCheckpoints } from "@/hooks/useRaceCheckpoints";
import { RaceCourseConfiguration } from "./RaceCourseConfiguration";
import { BoatAssignmentPanel } from "./BoatAssignmentPanel";
import { LaneConfigurationPanel } from "./LaneConfigurationPanel";
import { BoatDrawPanel } from "./BoatDrawPanel";
import { StartListPanel, getMissingSetup } from "./StartListPanel";

export function RaceSetupCenter({ competitionId, raceId }: { competitionId: string; raceId: string }) {
  const { user, profile } = useAuth();
  const userId = user?.uid ?? "anonymous";
  const role = profile?.role?.toUpperCase() ?? "ADMIN";
  const { race, loading, error } = useLiveRace(competitionId, raceId);
  const { entries } = useRaceEntries(competitionId, raceId);
  const boats = useRaceBoats(competitionId, raceId);
  const lanes = useRaceLanes(competitionId, raceId);
  const { cameras } = useLiveCameras(competitionId);
  const checkpoints = useRaceCheckpoints(competitionId, raceId);
  const missing = getMissingSetup(race, boats, lanes);

  return (
    <main className="min-h-screen bg-race-background px-4 py-5 text-race-text sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-3 border-b border-white/[0.07] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-race-primary">RACE SETUP</p>
            <h1 className="mt-2 text-2xl font-semibold">{race?.name ?? "Race not configured"}</h1>
            <p className="mt-2 text-sm text-race-muted">Race {race?.raceNumber ?? "Not available"} • {race?.categoryName ?? race?.category ?? "Category not configured"} • {race?.boatClass ?? "Boat not configured"}</p>
          </div>
          <Link href={`/competitions/${competitionId}/live?raceId=${raceId}`} className={`inline-flex h-11 items-center rounded-md px-4 text-xs font-bold ${missing.length ? "border border-white/10 text-race-muted" : "bg-race-success text-white"}`}>OPEN LIVE</Link>
        </header>
        {loading && <p className="mt-4 text-sm text-race-muted">Loading</p>}
        {error && <p className="mt-4 text-sm text-race-danger">{error}</p>}
        <section className="my-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SetupTile label="Distance" value={race?.distanceMeters ? `${race.distanceMeters} m` : "Not configured"} ok={Boolean(race?.distanceMeters)} />
          <SetupTile label="Boats" value={`${boats.length}/${race?.numberOfBoats ?? 0}`} ok={Boolean(race?.numberOfBoats && boats.length >= race.numberOfBoats)} />
          <SetupTile label="Lanes" value={`${lanes.filter((lane) => lane.enabled).length}/${race?.numberOfLanes ?? 0} active`} ok={Boolean(race?.numberOfLanes && lanes.length >= race.numberOfLanes)} />
          <SetupTile label="Draw" value={race?.drawStatus ?? "NOT_STARTED"} ok={race?.drawStatus === "CONFIRMED" || race?.drawStatus === "LOCKED"} />
          <SetupTile label="Athletes" value={`${entries.length}/${race?.numberOfBoats ?? 0}`} ok={entries.length > 0 && entries.length >= (race?.numberOfBoats ?? 0)} />
          <SetupTile label="Judges" value="Not available" ok={false} />
          <SetupTile label="Cameras" value={String(cameras.length)} ok={cameras.length > 0} />
          <SetupTile label="Checkpoints" value={String(checkpoints.length)} ok={checkpoints.length >= 2} />
        </section>
        <div className="grid gap-4">
          <RaceCourseConfiguration competitionId={competitionId} race={race} userId={userId} role={role} />
          <BoatAssignmentPanel competitionId={competitionId} race={race} boats={boats} entries={entries} userId={userId} role={role} />
          <LaneConfigurationPanel competitionId={competitionId} race={race} lanes={lanes} userId={userId} role={role} />
          <BoatDrawPanel competitionId={competitionId} race={race} boats={boats} lanes={lanes} userId={userId} role={role} />
          <StartListPanel competitionId={competitionId} race={race} boats={boats} lanes={lanes} />
        </div>
      </div>
    </main>
  );
}

function SetupTile({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return <div className="rounded-lg border border-white/[0.07] bg-race-surface p-3"><p className="text-[10px] uppercase text-race-muted">{label}</p><p className="mt-2 text-sm font-semibold">{ok ? "✓" : "✕"} {value}</p></div>;
}
