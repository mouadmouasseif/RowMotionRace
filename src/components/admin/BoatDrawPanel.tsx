"use client";

import { Dices } from "lucide-react";
import { useState } from "react";
import type { DrawMode, Race, RaceBoat, RaceDrawEntry, RaceLane } from "@/types/live-race";
import { confirmRaceDraw, generateRaceDraw, lockDraw } from "@/services/drawService";

export function BoatDrawPanel({ competitionId, race, boats, lanes, userId, role }: { competitionId: string; race: Race | null; boats: RaceBoat[]; lanes: RaceLane[]; userId: string; role: string }) {
  const [mode, setMode] = useState<DrawMode>("FULL");
  const [draft, setDraft] = useState<RaceDrawEntry[]>([]);
  const activeLanes = lanes.filter((lane) => lane.enabled);
  const locked = race?.drawStatus === "LOCKED";

  function draw() {
    setDraft(generateRaceDraw({ boats, availableLanes: activeLanes, mode }));
  }

  return (
    <section className="race-card rounded-lg p-4">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Draw / Tirage au sort</h2>{locked && <span className="rounded-md bg-white/[0.08] px-2 py-1 text-[10px]">Tirage validé</span>}</div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
        {(["BOATS", "LANES", "FULL"] as DrawMode[]).map((item) => <label key={item} className="rounded-md border border-white/10 p-3"><input type="radio" checked={mode === item} onChange={() => setMode(item)} className="mr-2" />{item === "BOATS" ? "Numéros bateaux seulement" : item === "LANES" ? "Couloirs seulement" : "Bateaux + couloirs"}</label>)}
      </div>
      <button type="button" disabled={boats.length === 0 || activeLanes.length === 0} onClick={draw} className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-race-warning px-4 text-xs font-black text-black disabled:opacity-40"><Dices className="size-4" />Tirage des bateaux</button>
      {draft.length > 0 && <div className="mt-4 rounded-lg border border-white/[0.07] p-3">
        <h3 className="text-sm font-semibold">Résultat du tirage</h3>
        <ol className="mt-3 space-y-2 text-xs">{draft.map((item) => {
          const boat = boats.find((candidate) => candidate.id === item.boatId);
          return <li key={item.boatId} className="grid grid-cols-[80px_1fr] gap-2"><span>Position {item.drawPosition}</span><span>Lane {item.lane ?? "EMPTY"} → Boat {String(item.boatNumber ?? boat?.boatNumber ?? "").padStart(2, "0")} • {boat?.athleteName || "Athlete not available"}</span></li>;
        })}</ol>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={draw} className="h-10 rounded-md border border-white/10 px-3 text-xs font-bold">Refaire le tirage</button><button type="button" disabled={!race?.id || locked} onClick={() => race?.id && confirmRaceDraw(competitionId, race.id, mode, draft, userId, role)} className="h-10 rounded-md bg-race-success px-3 text-xs font-bold text-white disabled:opacity-40">Confirmer le tirage</button><button type="button" disabled={!race?.id || locked || race?.drawStatus !== "CONFIRMED"} onClick={() => race?.id && lockDraw(competitionId, race.id, userId, role)} className="h-10 rounded-md bg-race-primary px-3 text-xs font-bold text-white disabled:opacity-40">LOCK DRAW</button></div>
      </div>}
    </section>
  );
}
