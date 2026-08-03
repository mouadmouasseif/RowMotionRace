"use client";

import { Radio } from "lucide-react";
import type { Race } from "@/types/live-race";
import { displayValue, formatDistance, raceDistanceMeters, statusTone } from "./live-format";

export function LiveRaceHeader({ race, competitionId, entriesCount }: { race: Race | null; competitionId: string; entriesCount: number }) {
  const isLive = race?.status === "RACING" || race?.status === "FINISHING";

  return (
    <header className="border-b border-white/[0.07] bg-race-surface/95 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold sm:text-2xl">{displayValue(race?.competitionName ?? competitionId)}</h1>
            {isLive && <span className="inline-flex items-center gap-1 rounded-md bg-race-danger px-2 py-1 text-[10px] font-black text-white"><Radio className="size-3" /> LIVE</span>}
            <span className={`rounded-md border px-2 py-1 text-[10px] font-bold ${statusTone(race?.status)}`}>{displayValue(race?.status ?? "PREPARATION")}</span>
          </div>
          <p className="mt-2 text-sm text-race-muted">
            {displayValue(race?.name)} • {displayValue(race?.categoryName ?? race?.category)} {displayValue(race?.gender)} • {displayValue(race?.boatClass)}
          </p>
          <p className="mt-1 text-sm text-race-muted">
            {formatDistance(raceDistanceMeters(race))} • {displayValue(race?.courseType)} • {displayValue(race?.numberOfBoats)} Boats • {displayValue(race?.numberOfLanes)} Lanes
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 lg:min-w-[520px]">
          <Info label="Date" value={race?.competitionDate} />
          <Info label="Lieu" value={race?.location} />
          <Info label="Type" value={race?.competitionType} />
          <Info label="Engagés" value={race?.numberOfBoats ?? (entriesCount || "Waiting")} />
        </dl>
      </div>
    </header>
  );
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2"><dt className="text-[10px] uppercase text-race-muted">{label}</dt><dd className="mt-1 truncate font-medium">{displayValue(value)}</dd></div>;
}
