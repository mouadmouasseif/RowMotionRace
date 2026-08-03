"use client";

import type { RaceCamera, RaceEntry, RaceFinish } from "@/types/live-race";
import { FinishControl } from "./FinishControl";

export function FinishLineCamera({ competitionId, raceId, cameras, entries, finishes, userId }: { competitionId: string; raceId?: string; cameras: RaceCamera[]; entries: RaceEntry[]; finishes: RaceFinish[]; userId: string }) {
  const camera = cameras.find((item) => item.type === "FINISH" && item.enabled);
  return (
    <section className="race-card rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Finish Line Camera</h2>
        <span className="text-[10px] text-race-muted">{camera?.status ?? "Offline"}</span>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid min-h-64 place-items-center rounded-lg bg-black/45">
          {camera?.streamUrl ? <video src={camera.streamUrl} className="h-full max-h-80 w-full rounded-lg object-cover" muted playsInline controls /> : <p className="text-sm text-race-muted">Finish stream not configured</p>}
        </div>
        <FinishControl competitionId={competitionId} raceId={raceId} entries={entries} finishes={finishes} userId={userId} />
      </div>
    </section>
  );
}
