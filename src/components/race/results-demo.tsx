"use client";

import { useState } from "react";
import { CheckCircle2, Medal, ShieldCheck } from "lucide-react";
import { AthleteAvatar, IntegrityNote } from "@/components/race/preview-components";
import { previewAthletes } from "@/constants/interface-preview";

export function ResultsDemo() {
  const [validated, setValidated] = useState(false);
  return (
    <div className="space-y-4">
      <section className="race-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"><div><h2 className="text-sm font-semibold">Résultats {validated ? "validés" : "provisoires"}</h2><p className="text-[10px] text-race-muted">U19 Homme 1x · Série 2/5</p></div>{validated ? <span className="inline-flex items-center gap-1 rounded-md bg-race-success/15 px-2 py-1 text-[9px] font-bold text-race-success"><CheckCircle2 className="size-3" /> VALIDÉS</span> : <span className="rounded-md bg-race-warning/15 px-2 py-1 text-[9px] font-bold text-race-warning">PROVISOIRES</span>}</div>
        <div className="divide-y divide-white/[0.06]">{previewAthletes.map((athlete, index) => <div key={athlete.id} className="grid grid-cols-[28px_40px_1fr_auto] items-center gap-2 p-3 sm:gap-3 sm:p-4"><span className={`text-center text-xl font-black ${index === 0 ? "text-race-warning" : index === 1 ? "text-sky-300" : index === 2 ? "text-orange-400" : "text-race-muted"}`}>{index + 1}</span><AthleteAvatar lane={athlete.lane} /><div className="min-w-0"><p className="truncate text-sm font-medium">{athlete.name}</p><p className="truncate text-[10px] text-race-muted">{athlete.club}</p></div><p className="font-mono text-xs font-bold tabular-nums text-race-success sm:text-sm">{athlete.time}</p></div>)}</div>
      </section>
      <section className="race-card rounded-2xl p-4"><h3 className="text-sm font-semibold">Informations</h3><dl className="mt-3 space-y-2 text-xs">{[["Catégorie", "U19 Homme"], ["Épreuve", "1x (Skiff)"], ["Distance", "2 000 m"], ["Série", "2"], ["Manche", "1/5"], ["Date / Heure", "15/05/2026 · 10:45"]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-white/[0.05] pb-2"><dt className="text-race-muted">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl></section>
      <button type="button" onClick={() => setValidated(true)} disabled={validated} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-race-success text-sm font-bold text-white disabled:opacity-60">{validated ? <ShieldCheck className="size-5" /> : <Medal className="size-5" />}{validated ? "RÉSULTATS VALIDÉS" : "VALIDER LES RÉSULTATS"}</button>
      <IntegrityNote />
    </div>
  );
}
