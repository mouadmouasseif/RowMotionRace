"use client";

import { Clock } from "lucide-react";
import type { Race } from "@/types/live-race";
import { useRaceChronometer } from "@/hooks/useRaceChronometer";

export function LiveChronometer({ race }: { race: Race | null }) {
  const chrono = useRaceChronometer(race);

  return (
    <section className="race-card rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold"><Clock className="size-4 text-race-primary" /> Chrono officiel</h2>
        <span className="text-[10px] text-race-muted">{chrono.hasOfficialStart ? "Firebase timestamp" : "Waiting"}</span>
      </div>
      <p className="mt-4 font-mono text-5xl font-semibold tabular-nums text-race-primary sm:text-6xl">{chrono.hasOfficialStart ? chrono.formatted : "00:00.000"}</p>
      <p className="mt-3 text-xs text-race-muted">Le temps est recalculé depuis le timestamp de départ partagé, pas depuis un intervalle local officiel.</p>
    </section>
  );
}
