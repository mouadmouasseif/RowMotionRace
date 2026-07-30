"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Flag, Play, RotateCcw } from "lucide-react";
import { AthleteAvatar, IntegrityNote, LiveBadge } from "@/components/race/preview-components";
import { previewAthletes } from "@/constants/interface-preview";

type StartState = "IDLE" | "READY" | "ATTENTION" | "GO" | "RUNNING" | "FALSE_START";

const stateLabels: Record<StartState, string> = { IDLE: "COURSE À PRÉPARER", READY: "PRÊT", ATTENTION: "ATTENTION", GO: "GO", RUNNING: "COURSE EN COURS", FALSE_START: "FAUX DÉPART" };

export function StartSequenceDemo() {
  const [state, setState] = useState<StartState>("IDLE");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (state !== "RUNNING" || startRef.current === null) return;
    let frame = 0;
    const tick = () => {
      setElapsed(performance.now() - (startRef.current ?? performance.now()));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state]);

  function triggerGo() {
    if (state !== "ATTENTION") return;
    startRef.current = performance.now();
    setElapsed(0);
    setState("GO");
    window.setTimeout(() => setState((current) => current === "GO" ? "RUNNING" : current), 650);
    if (navigator.vibrate) navigator.vibrate(160);
  }

  function reset() {
    startRef.current = null;
    setElapsed(0);
    setState("IDLE");
  }

  return (
    <div className="space-y-4">
      <section className="race-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"><div><p className="text-sm font-semibold">U19 Homme 1x — Qualif. 2</p><p className="text-[10px] text-race-muted">Série 2 · Manche 1/5</p></div>{state === "RUNNING" ? <LiveBadge /> : <span className="text-[10px] text-race-muted">10:45 · 2 000 m</span>}</div>
        <div className="race-grid p-4 text-center sm:p-6">
          <p className="text-[10px] uppercase tracking-[.18em] text-race-muted">Séquence de départ</p>
          <div className={`signal-pulse mx-auto mt-4 grid min-h-28 max-w-md place-items-center rounded-2xl border px-4 ${signalTone(state)}`}>
            <div><p className="text-3xl font-black tracking-[.04em] sm:text-5xl">{stateLabels[state]}</p>{state === "RUNNING" && <p className="mt-2 font-mono text-2xl tabular-nums text-race-primary">{formatTime(elapsed)}</p>}</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <SignalButton label="PRÊT" icon={Flag} color="blue" disabled={state !== "IDLE"} onClick={() => setState("READY")} />
            <SignalButton label="ATTENTION" icon={AlertTriangle} color="yellow" disabled={state !== "READY"} onClick={() => setState("ATTENTION")} />
            <SignalButton label="GO" icon={Play} color="green" disabled={state !== "ATTENTION"} onClick={triggerGo} />
          </div>
        </div>
      </section>
      <section className="race-card rounded-2xl p-4">
        <div className="flex items-center justify-between"><p className="text-xs font-medium text-race-muted">Participants verrouillés</p><span className="rounded-md bg-race-success/10 px-2 py-1 text-[9px] font-bold text-race-success">4 COULOIRS</span></div>
        <div className="mt-3 divide-y divide-white/[0.06]">{previewAthletes.map((athlete) => <div key={athlete.id} className="flex items-center gap-3 py-3"><AthleteAvatar lane={athlete.lane} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">Couloir {athlete.lane} · {athlete.name}</p><p className="truncate text-[10px] text-race-muted">{athlete.club}</p></div><span className="text-race-muted">•••</span></div>)}</div>
      </section>
      <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setState("FALSE_START")} disabled={state === "IDLE"} className="h-11 rounded-xl bg-race-warning/90 text-xs font-bold text-black disabled:opacity-40">FAUX DÉPART</button><button type="button" onClick={reset} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-race-surface text-xs font-bold"><RotateCcw className="size-4" /> RÉINITIALISER</button></div>
      <IntegrityNote />
    </div>
  );
}

function SignalButton({ label, icon: Icon, color, disabled, onClick }: { label: string; icon: typeof Flag; color: "blue" | "yellow" | "green"; disabled: boolean; onClick: () => void }) {
  const tones = { blue: "bg-race-primary text-white", yellow: "bg-race-warning text-black", green: "bg-race-success text-white" };
  return <button type="button" disabled={disabled} onClick={onClick} className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl text-xs font-bold shadow-lg transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-25 sm:min-h-20 ${tones[color]}`}><Icon className="size-5" />{label}</button>;
}

function signalTone(state: StartState) {
  if (state === "ATTENTION" || state === "FALSE_START") return "border-race-warning/40 bg-race-warning/10 text-race-warning";
  if (state === "GO" || state === "RUNNING") return "border-race-success/40 bg-race-success/10 text-race-success";
  return "border-race-primary/35 bg-race-primary/10 text-race-primary";
}

export function formatTime(ms: number) {
  const safe = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const millis = safe % 1000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}
