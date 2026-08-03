"use client";

import Link from "next/link";
import { BarChart3, ClipboardList, Plus, QrCode, Radio, Share2, Shuffle, Trophy, UserPlus } from "lucide-react";
import { useFederationMetrics } from "@/hooks/useFederationMetrics";

const actionLinks = [
  ["Add Competition", "/competitions/new", Plus],
  ["Registrations", "/competitions", ClipboardList],
  ["Draw", "/competitions", Shuffle],
  ["Start Live", "/competitions", Radio],
  ["Share Live", "/live", Share2],
  ["Add Judge", "/federation?section=judges", UserPlus],
  ["Results", "/resultats", BarChart3]
] as const;

export function FederationDashboard() {
  const { metrics, liveRace, loading, error } = useFederationMetrics();
  const items = [
    ["Competitions actives", metrics.activeCompetitions],
    ["Competitions a venir", metrics.upcomingCompetitions],
    ["Courses aujourd'hui", metrics.racesToday],
    ["Courses Live", metrics.liveRaces],
    ["Athletes inscrits", metrics.registeredAthletes],
    ["Clubs participants", metrics.participatingClubs],
    ["Juges actifs", metrics.activeJudges],
    ["Bateaux engages", metrics.assignedBoats],
    ["Resultats en attente", metrics.pendingResults],
    ["Penalites ouvertes", metrics.openPenalties]
  ] as const;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-race-primary">ROWMOTION-RACE</p>
          <h2 className="mt-2 text-2xl font-semibold">Federation Control Center</h2>
          <p className="mt-2 text-sm text-race-muted">{loading ? "Loading Firebase data" : error ? error : "Connected to federation operations"}</p>
        </div>
        <Link href="/competitions/new" className="inline-flex h-11 items-center gap-2 rounded-md bg-race-primary px-4 text-xs font-bold text-white"><Plus className="size-4" />ADD COMPETITION</Link>
      </header>
      <section className="grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {items.map(([label, value]) => <div key={label} className="rounded-lg border border-white/[0.07] bg-race-surface p-3"><p className="text-[10px] uppercase text-race-muted">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p></div>)}
      </section>
      <section className="race-card rounded-lg p-4">
        <h3 className="text-sm font-semibold">Actions rapides</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-7">
          {actionLinks.map(([label, href, Icon]) => <Link key={label} href={href} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.03] text-center text-xs text-race-muted hover:border-race-primary/40 hover:text-white"><Icon className="size-5 text-race-primary" />{label}</Link>)}
        </div>
      </section>
      <section className="race-card rounded-lg p-4">
        <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-semibold"><Radio className="size-4 text-race-danger" />LIVE NOW</h3>{liveRace && <Link href={`/competitions/${liveRace.competition.id}/live?raceId=${liveRace.race.id}`} className="rounded-md bg-race-success px-3 py-2 text-xs font-bold text-white">OPEN LIVE</Link>}</div>
        {liveRace ? <div className="mt-4 grid gap-3 text-sm sm:grid-cols-5"><LiveInfo label="Race" value={liveRace.race.name} /><LiveInfo label="Category" value={`${liveRace.race.categoryName ?? liveRace.race.category ?? "Not available"} ${liveRace.race.gender ?? ""}`} /><LiveInfo label="Distance" value={`${liveRace.race.distanceMeters ?? liveRace.race.distance ?? "Not available"}m`} /><LiveInfo label="Status" value={liveRace.race.status} /><LiveInfo label="Boats" value={String(liveRace.race.numberOfBoats ?? "Waiting")} /></div> : <p className="mt-4 text-sm text-race-muted">No race live now</p>}
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/competitions" className="race-card rounded-lg p-4"><Trophy className="size-5 text-race-warning" /><h3 className="mt-3 font-semibold">Today Competitions</h3><p className="mt-2 text-sm text-race-muted">Open real competition dashboards and timelines.</p></Link>
        <Link href="/competitions" className="race-card rounded-lg p-4"><Shuffle className="size-5 text-race-primary" /><h3 className="mt-3 font-semibold">Pending Draws</h3><p className="mt-2 text-sm text-race-muted">Generate heats, boat numbers, lanes and start lists.</p></Link>
        <Link href="/live" className="race-card rounded-lg p-4"><QrCode className="size-5 text-race-success" /><h3 className="mt-3 font-semibold">Public Live</h3><p className="mt-2 text-sm text-race-muted">Share race links and QR codes for spectators.</p></Link>
      </section>
    </div>
  );
}

function LiveInfo({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-white/[0.07] bg-white/[0.03] p-3"><p className="text-[10px] uppercase text-race-muted">{label}</p><p className="mt-1 font-semibold">{value || "Not available"}</p></div>;
}
