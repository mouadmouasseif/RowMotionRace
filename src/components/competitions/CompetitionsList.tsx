"use client";

import Link from "next/link";
import { Plus, Radio, Trophy } from "lucide-react";
import { useCompetitions } from "@/hooks/useCompetitions";

export function CompetitionsList() {
  const { competitions, error } = useCompetitions();
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div><p className="text-xs uppercase tracking-[.16em] text-race-primary">Competition Management</p><h2 className="mt-1 text-xl font-semibold">Competitions</h2></div>
        <Link href="/competitions/new" className="inline-flex h-11 items-center gap-2 rounded-md bg-race-primary px-4 text-xs font-bold text-white"><Plus className="size-4" />Ajouter competition</Link>
      </header>
      {error && <p className="text-sm text-race-danger">{error}</p>}
      <section className="grid gap-3 lg:grid-cols-2">
        {competitions.length === 0 ? <div className="race-card rounded-lg p-5"><Trophy className="size-6 text-race-primary" /><h3 className="mt-3 font-semibold">No competition configured</h3><p className="mt-2 text-sm text-race-muted">Create a competition to open registrations, events, draws and live operations.</p></div> : competitions.map((competition) => (
          <Link key={competition.id} href={`/competitions/${competition.id}`} className="race-card rounded-lg p-4 transition hover:border-race-primary/30">
            <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{competition.name}</h3><p className="mt-1 text-xs text-race-muted">{competition.location || "Location not configured"} • {competition.type}</p></div><span className="rounded-md bg-white/[0.06] px-2 py-1 text-[10px]">{competition.status}</span></div>
            <div className="mt-4 flex items-center justify-between text-xs text-race-muted"><span>{competition.competitionCode || "Code not configured"}</span>{competition.publicLiveEnabled && <span className="inline-flex items-center gap-1 text-race-success"><Radio className="size-3" />Public live</span>}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
