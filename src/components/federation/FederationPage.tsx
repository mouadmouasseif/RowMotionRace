"use client";

import Link from "next/link";
import { BarChart3, Building2, ClipboardList, ShieldCheck, Trophy, Users } from "lucide-react";
import { useFederationMetrics } from "@/hooks/useFederationMetrics";

export function FederationPage() {
  const { metrics } = useFederationMetrics();
  return (
    <div className="space-y-4">
      <header><p className="text-xs font-bold uppercase text-race-primary">Federation</p><h2 className="mt-2 text-2xl font-semibold">Federation Profile</h2></header>
      <section className="race-card rounded-lg p-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <Tile label="Season" value="Not configured" />
          <Tile label="Number of Clubs" value={String(metrics.participatingClubs)} />
          <Tile label="Number of Athletes" value={String(metrics.registeredAthletes)} />
          <Tile label="Number of Officials" value={String(metrics.activeJudges)} />
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <Module href="/competitions" icon={Trophy} title="Competitions" />
        <Module href="/clubs" icon={Building2} title="Clubs" />
        <Module href="/athletes" icon={Users} title="Athletes" />
        <Module href="/federation?section=licences" icon={ClipboardList} title="Licences" />
        <Module href="/federation?section=judges" icon={ShieldCheck} title="Judges" />
        <Module href="/federation?section=reports" icon={BarChart3} title="Statistics / Reports" />
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-white/[0.07] p-3"><p className="text-[10px] text-race-muted">{label}</p><p className="mt-2 text-lg font-semibold">{value}</p></div>;
}

function Module({ href, icon: Icon, title }: { href: string; icon: typeof Trophy; title: string }) {
  return <Link href={href} className="race-card rounded-lg p-4"><Icon className="size-5 text-race-primary" /><h3 className="mt-3 font-semibold">{title}</h3><p className="mt-2 text-xs text-race-muted">Open connected federation module.</p></Link>;
}
