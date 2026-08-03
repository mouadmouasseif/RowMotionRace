"use client";

import type { RacePenalty } from "@/types/live-race";
import { cancelPenalty } from "@/services/penaltyService";
import { formatMs } from "@/components/live/live-format";

export function PenaltyEditor({ competitionId, penalties, userId, role }: { competitionId: string; penalties: RacePenalty[]; userId: string; role: string }) {
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Penalty Editor</h2>
      <div className="mt-4 space-y-3">
        {penalties.length === 0 ? <p className="text-xs text-race-muted">Penalties: Waiting</p> : penalties.map((penalty, index) => (
          <article key={penalty.id} className="rounded-lg border border-white/[0.07] p-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">Penalty #{String(index + 1).padStart(3, "0")}</p>
              <span className="text-race-muted">{penalty.status}</span>
            </div>
            <p className="mt-2 text-race-muted">Lane {penalty.lane} • {penalty.type.replaceAll("_", " ")} • {formatMs(penalty.penaltyMs)}</p>
            <p className="mt-1">{penalty.reason || "Reason not available"}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="h-9 rounded-md border border-white/10 px-3 text-[10px] font-bold">Modifier</button>
              <button type="button" disabled={penalty.status === "CANCELLED"} onClick={() => cancelPenalty(competitionId, penalty.id, userId, role)} className="h-9 rounded-md bg-race-danger px-3 text-[10px] font-bold text-white disabled:opacity-40">Annuler</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
