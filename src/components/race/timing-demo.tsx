"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Wifi } from "lucide-react";
import { AthleteAvatar, IntegrityNote } from "@/components/race/preview-components";
import { previewAthletes } from "@/constants/interface-preview";
import { formatTime } from "./start-sequence-demo";

export function TimingDemo() {
  const [running, setRunning] = useState(false);
  const [displayPaused, setDisplayPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finishes, setFinishes] = useState<Record<string, number>>({});
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running || startRef.current === null) return;
    let frame = 0;
    const tick = () => {
      if (!displayPaused) setElapsed(performance.now() - (startRef.current ?? performance.now()));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [displayPaused, running]);

  function go() {
    if (running) return;
    startRef.current = performance.now();
    setFinishes({});
    setElapsed(0);
    setRunning(true);
  }

  function finish(id: string) {
    if (!running || finishes[id] !== undefined || startRef.current === null) return;
    const raw = Math.round(performance.now() - startRef.current);
    setFinishes((current) => ({ ...current, [id]: raw }));
    if (navigator.vibrate) navigator.vibrate(70);
  }

  const finishedCount = Object.keys(finishes).length;
  const allFinished = finishedCount === previewAthletes.length;
  const ranks = useMemo(() => new Map(Object.entries(finishes).sort((a, b) => a[1] - b[1]).map(([id], index) => [id, index + 1])), [finishes]);

  function reset() {
    startRef.current = null;
    setRunning(false);
    setDisplayPaused(false);
    setElapsed(0);
    setFinishes({});
  }

  return (
    <div className="space-y-4">
      <section className="race-card rounded-2xl p-4 sm:p-5">
        <div className="flex items-start justify-between"><div><span className="rounded-md bg-race-primary/15 px-2 py-1 text-[9px] font-bold text-race-primary">{allFinished ? "COURSE TERMINÉE" : running ? "COURSE EN COURS" : "PRÊTE AU DÉPART"}</span><p className="mt-3 font-mono text-4xl font-semibold tabular-nums text-race-primary sm:text-6xl">{formatTime(elapsed)}</p></div><span className="inline-flex items-center gap-1.5 text-[10px] text-race-success"><Wifi className="size-3.5" /> Synchronisé</span></div>
        {!running ? <button type="button" onClick={go} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-race-success font-bold text-white"><Play className="size-5" /> GO — DÉMARRER LE CHRONO</button> : <p className="mt-4 text-xs text-race-muted">{finishedCount}/{previewAthletes.length} arrivées enregistrées · précision milliseconde</p>}
      </section>
      <section className="race-card overflow-hidden rounded-2xl">
        <div className="border-b border-white/[0.06] px-4 py-3"><h2 className="text-sm font-semibold">Enregistrer les arrivées</h2></div>
        <div className="divide-y divide-white/[0.06]">
          {previewAthletes.map((athlete) => {
            const finishMs = finishes[athlete.id];
            return <div key={athlete.id} className="flex items-center gap-3 p-3 sm:p-4"><AthleteAvatar lane={athlete.lane} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium">{athlete.name}</p>{ranks.get(athlete.id) && <span className="rounded bg-race-warning/15 px-1.5 py-0.5 text-[9px] font-bold text-race-warning">#{ranks.get(athlete.id)}</span>}</div><p className="truncate text-[10px] text-race-muted">{athlete.club}</p>{finishMs !== undefined && <p className="mt-1 font-mono text-xs font-semibold text-race-success">{formatTime(finishMs)}</p>}</div><button type="button" onClick={() => finish(athlete.id)} disabled={!running || finishMs !== undefined} className="h-10 rounded-lg bg-race-danger px-3 text-[10px] font-bold text-white disabled:bg-white/[0.06] disabled:text-race-muted">{finishMs !== undefined ? "ENREGISTRÉ" : "ARRIVÉE"}</button></div>;
          })}
        </div>
      </section>
      <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setDisplayPaused((value) => !value)} disabled={!running || allFinished} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-race-surface text-xs font-bold disabled:opacity-40">{displayPaused ? <Play className="size-4" /> : <Pause className="size-4" />}{displayPaused ? "REPRENDRE AFFICHAGE" : "PAUSE AFFICHAGE"}</button><button type="button" onClick={reset} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-race-surface text-xs font-bold"><RotateCcw className="size-4" /> RÉINITIALISER</button></div>
      <IntegrityNote />
    </div>
  );
}
