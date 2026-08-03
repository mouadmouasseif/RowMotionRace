"use client";

import Link from "next/link";
import { Circle, Radio, Trophy, Users, Building2, Waves } from "lucide-react";
import { useMemo } from "react";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useFederationMetrics } from "@/hooks/useFederationMetrics";

export function RaceDashboard() {
  const { competitions, error } = useCompetitions();
  const metrics = useFederationMetrics();
  const liveCompetition = useMemo(() => competitions.find((item) => item.status === "LIVE") ?? competitions[0], [competitions]);
  const today = new Intl.DateTimeFormat("fr-MA", { dateStyle: "full" }).format(new Date());
  const stats = [
    ["Competitions", String(competitions.length).padStart(2, "0"), Trophy],
    ["Athletes", String(metrics.metrics.registeredAthletes).padStart(3, "0"), Users],
    ["Clubs", String(metrics.metrics.participatingClubs).padStart(2, "0"), Building2],
    ["Courses", String(metrics.metrics.racesToday).padStart(3, "0"), Waves],
    ["En direct", String(metrics.metrics.liveRaces || competitions.filter((item) => item.status === "LIVE").length).padStart(2, "0"), Radio]
  ] as const;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.22em] text-race-primary">RowMotion Race</p>
          <h1 className="mt-2 text-3xl font-black">Centre national de course</h1>
          <p className="mt-2 text-sm capitalize text-race-muted">{today}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-race-success/25 bg-race-success/10 px-4 py-2 text-sm font-bold text-race-success">
          <Circle className="size-3 fill-current" /> Systeme operationnel
        </div>
      </header>
      {error && <section className="rounded-2xl border border-race-warning/25 bg-race-warning/10 p-4 text-sm text-race-warning">Diagnostic / System: {error}</section>}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="race-card rounded-2xl p-4">
            <Icon className="size-5 text-race-primary" />
            <p className="mt-4 font-mono text-4xl font-black tabular-nums">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase text-race-muted">{label}</p>
          </div>
        ))}
      </section>
      <section className="race-card overflow-hidden rounded-2xl">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="p-5 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[.18em] text-race-danger">● Competition en direct</p>
            <h2 className="mt-3 text-3xl font-black">{liveCompetition?.name ?? "Aucune competition active"}</h2>
            <p className="mt-2 text-sm text-race-muted">{liveCompetition?.location ?? "Creez une competition pour activer le centre de course"}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <Info label="Course actuelle" value="Course #18" />
              <Info label="Categorie" value="U19 Homme" />
              <Info label="Epreuve" value="1x - Qualification 2" />
              <Info label="Distance" value="2000 m" />
            </div>
            <div className="mt-6 rounded-2xl border border-race-primary/25 bg-race-primary/10 p-5">
              <p className="text-xs font-bold uppercase text-race-muted">Live timer</p>
              <p className="mt-1 font-mono text-5xl font-black tabular-nums">01:42.628</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-race-muted">
              <span>18 courses terminees</span><span>1 course en direct</span><span>7 courses restantes</span>
            </div>
            <Link href={liveCompetition ? `/competitions/${liveCompetition.id}/race-control` : "/competitions/new"} className="mt-6 inline-flex h-12 items-center rounded-xl bg-race-primary px-5 text-sm font-black">
              {liveCompetition ? "OUVRIR RACE CONTROL" : "CREER UNE COMPETITION"}
            </Link>
          </div>
          <div className="race-grid min-h-[320px] border-t border-white/[0.07] bg-[#061426] p-5 lg:border-l lg:border-t-0">
            <div className="grid h-full place-items-center rounded-2xl border border-white/10 bg-black/35">
              <div className="text-center">
                <Radio className="mx-auto size-12 text-race-danger" />
                <p className="mt-3 text-sm font-bold">Broadcast Control</p>
                <p className="mt-1 text-xs text-race-muted">Camera principale, ranking, jury, finish</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <Quick href="/race-control/start" title="Starter" text="Sequence READY - ATTENTION - GO avec timestamp officiel." />
        <Quick href="/race-control/finish" title="Finish & Timing" text="Camera PC, ligne d'arrivee, finish manuel fiable." />
        <Quick href="/jury" title="Jury / Penalites" text="Decisions synchronisees et recalcul resultats." />
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-[10px] font-bold uppercase text-race-muted">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function Quick({ href, title, text }: { href: string; title: string; text: string }) {
  return <Link href={href} className="race-card rounded-2xl p-5 transition hover:border-race-primary/40"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm text-race-muted">{text}</p></Link>;
}
