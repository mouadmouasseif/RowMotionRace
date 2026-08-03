"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ClipboardList, Flag, Radio, Settings, Share2, Shuffle, Trophy, Users, Waves } from "lucide-react";
import { useCompetition } from "@/hooks/useCompetitions";
import { useCompetitionEvents } from "@/hooks/useCompetitionEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useLiveRace } from "@/hooks/useLiveRace";
import { publicLiveUrl } from "@/services/publicLiveService";
import { RegistrationPanel } from "./RegistrationPanel";
import { EventManagerPanel } from "./EventManagerPanel";
import { DrawCenterPanel } from "./DrawCenterPanel";

const tabs = [
  ["overview", "Vue generale"],
  ["participants", "Participants"],
  ["categories", "Categories"],
  ["tirage", "Tirage"],
  ["programme", "Programme"],
  ["race-control", "Race Control"],
  ["resultats", "Resultats"],
  ["qualifications", "Qualifications"],
  ["classement", "Classement"],
  ["live", "Live Public"],
  ["configuration", "Configuration"]
] as const;

export function CompetitionHub({ competitionId }: { competitionId: string }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";
  const { competition, error } = useCompetition(competitionId);
  const events = useCompetitionEvents(competitionId);
  const registrations = useRegistrations(competitionId);
  const { races } = useLiveRace(competitionId);
  const liveRace = races.find((race) => race.status === "RACING" || race.status === "FINISHING") ?? races[0];
  const publicUrl = publicLiveUrl(competition?.competitionCode || competitionId);

  return (
    <div className="space-y-4">
      <header className="race-card rounded-2xl p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-race-primary">Competition Command Center</p>
            <h1 className="mt-2 text-3xl font-black">{competition?.name ?? "Championnat du Maroc 2026"}</h1>
            <p className="mt-2 text-sm text-race-muted">{competition?.location ?? "Location non configuree"} - {competition?.type ?? "REGATTA"} - {competition?.status ?? "DRAFT"}</p>
            {error && <p className="mt-2 text-xs text-race-warning">Diagnostic / System: {error}</p>}
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <Info label="Current race" value={liveRace ? `#${liveRace.raceNumber}` : "Aucune"} />
            <Info label="Live" value={liveRace?.status === "RACING" ? "ON AIR" : "Pret"} live={liveRace?.status === "RACING"} />
            <Info label="Participants" value={String(registrations.length)} />
            <Info label="Courses" value={String(races.length)} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/competitions/${competitionId}/race-control${liveRace ? `?raceId=${liveRace.id}` : ""}`} className="inline-flex h-11 items-center rounded-xl bg-race-primary px-4 text-sm font-black">OUVRIR RACE CONTROL</Link>
          <Link href={`/race-control/start?competitionId=${competitionId}${liveRace ? `&raceId=${liveRace.id}` : ""}`} className="inline-flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm font-bold">STARTER</Link>
          <Link href={`/race-control/finish?competitionId=${competitionId}${liveRace ? `&raceId=${liveRace.id}` : ""}`} className="inline-flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm font-bold">FINISH</Link>
          <Link href={`/jury?competitionId=${competitionId}${liveRace ? `&raceId=${liveRace.id}` : ""}`} className="inline-flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm font-bold">JURY</Link>
          <button type="button" onClick={() => navigator.clipboard?.writeText(publicUrl)} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-bold"><Share2 className="size-4" />SHARE LIVE</button>
        </div>
      </header>
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-white/[0.07] bg-race-surface p-2">
        {tabs.map(([key, label]) => <Link key={key} href={`/competitions/${competitionId}?tab=${key}`} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${tab === key ? "bg-race-primary text-white" : "text-race-muted hover:bg-white/[0.05]"}`}>{label}</Link>)}
      </nav>
      {tab === "overview" && <Overview competitionId={competitionId} registrations={registrations.length} events={events.length} races={races.length} liveRaceId={liveRace?.id} publicUrl={publicUrl} />}
      {tab === "participants" && <RegistrationPanel competitionId={competitionId} events={events} registrations={registrations} />}
      {tab === "categories" && <EventManagerPanel competitionId={competitionId} events={events} />}
      {tab === "tirage" && <DrawCenterPanel competitionId={competitionId} events={events} registrations={registrations} />}
      {tab === "programme" && <ProgrammePanel races={races} />}
      {tab === "race-control" && <RaceControlPanel competitionId={competitionId} raceId={liveRace?.id} />}
      {tab === "live" && <LiveSharePanel publicUrl={publicUrl} code={competition?.competitionCode || competitionId} competitionId={competitionId} />}
      {["resultats", "qualifications", "classement", "configuration"].includes(tab) && <WorkflowPanel tab={tab} />}
    </div>
  );
}

function Overview({ competitionId, registrations, events, races, liveRaceId, publicUrl }: { competitionId: string; registrations: number; events: number; races: number; liveRaceId?: string; publicUrl: string }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <section className="race-card rounded-2xl p-5">
        <h2 className="text-lg font-black">Vue generale operationnelle</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4"><Metric icon={Users} label="Athletes" value={registrations} /><Metric icon={CalendarDays} label="Categories" value={events} /><Metric icon={Waves} label="Courses" value={races} /><Metric icon={Radio} label="Live" value={liveRaceId ? 1 : 0} /></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3"><Quick href={`/competitions/${competitionId}?tab=participants`} icon={ClipboardList} label="Inscriptions" /><Quick href={`/competitions/${competitionId}?tab=tirage`} icon={Shuffle} label="Tirage" /><Quick href={`/competitions/${competitionId}/race-control${liveRaceId ? `?raceId=${liveRaceId}` : ""}`} icon={Flag} label="Race Control" /></div>
      </section>
      <section className="race-card rounded-2xl p-5">
        <h2 className="text-lg font-black">Public Live</h2>
        <p className="mt-3 break-all text-sm text-race-muted">{publicUrl}</p>
        <Link href={`/competitions/${competitionId}/live`} className="mt-5 inline-flex h-11 items-center rounded-xl bg-race-success px-4 text-sm font-black text-[#02120a]">OUVRIR SHARE LIVE</Link>
      </section>
    </div>
  );
}

function RaceControlPanel({ competitionId, raceId }: { competitionId: string; raceId?: string }) {
  const links = [
    ["Centre de course", `/competitions/${competitionId}/race-control${raceId ? `?raceId=${raceId}` : ""}`],
    ["Depart tablette", `/race-control/start?competitionId=${competitionId}${raceId ? `&raceId=${raceId}` : ""}`],
    ["Arrivee & timing", `/race-control/finish?competitionId=${competitionId}${raceId ? `&raceId=${raceId}` : ""}`],
    ["Jury mobile", `/mobile/judge?competitionId=${competitionId}${raceId ? `&raceId=${raceId}` : ""}`],
    ["Beach Sprint", `/race-control/beach-sprint?competitionId=${competitionId}${raceId ? `&raceId=${raceId}` : ""}`]
  ];
  return <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{links.map(([label, href]) => <Link key={label} href={href} className="race-card rounded-2xl p-5 font-black transition hover:border-race-primary/40">{label}<p className="mt-2 text-sm font-normal text-race-muted">Interface synchronisee Firebase.</p></Link>)}</section>;
}

function ProgrammePanel({ races }: { races: Array<{ id: string; name: string; raceNumber: number; status: string; categoryName?: string; boatClass?: string }> }) {
  return <section className="race-card rounded-2xl p-5"><h2 className="text-lg font-black">Programme</h2><div className="mt-4 divide-y divide-white/[0.07]">{races.length === 0 ? <p className="py-4 text-sm text-race-muted">Aucune course configuree.</p> : races.map((race) => <div key={race.id} className="grid grid-cols-[80px_1fr_auto] gap-3 py-3 text-sm"><strong>#{race.raceNumber}</strong><span>{race.categoryName ?? race.name} {race.boatClass ?? ""}</span><span className="text-race-muted">{race.status}</span></div>)}</div></section>;
}

function LiveSharePanel({ publicUrl, code, competitionId }: { publicUrl: string; code: string; competitionId: string }) {
  return <section className="race-card rounded-2xl p-5"><h2 className="text-lg font-black">Live Public</h2><div className="mt-4 grid gap-3"><Info label="Public Code" value={code.toUpperCase()} /><Info label="Public Link" value={publicUrl} /></div><div className="mt-5 flex flex-wrap gap-2"><Link href={`/competitions/${competitionId}/live`} className="h-11 rounded-xl bg-race-primary px-4 py-3 text-sm font-black">SHARE LIVE PANEL</Link><Link href={`/live/${code}`} className="h-11 rounded-xl border border-white/10 px-4 py-3 text-sm font-black">OUVRIR LE LIVE</Link></div></section>;
}

function WorkflowPanel({ tab }: { tab: string }) {
  const copy: Record<string, string> = {
    resultats: "Resultats provisoires et officiels connectes au workflow Finish/Jury.",
    qualifications: "Moteur de qualification prepare: top N, meilleurs temps, repechage, override directeur technique.",
    classement: "Classements et medailles consolides apres publication officielle.",
    configuration: "Parametres competition, roles, appareils, regles de penalite et diffusion."
  };
  return <section className="race-card rounded-2xl p-5"><Settings className="size-5 text-race-primary" /><h2 className="mt-3 text-lg font-black">{tab.toUpperCase()}</h2><p className="mt-2 text-sm text-race-muted">{copy[tab]}</p></section>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><Icon className="size-5 text-race-primary" /><p className="mt-3 font-mono text-3xl font-black">{value}</p><p className="text-xs text-race-muted">{label}</p></div>;
}

function Quick({ href, icon: Icon, label }: { href: string; icon: typeof Trophy; label: string }) {
  return <Link href={href} className="flex min-h-20 flex-col justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold hover:text-race-primary"><Icon className="size-5" />{label}</Link>;
}

function Info({ label, value, live = false }: { label: string; value: string; live?: boolean }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-[10px] font-bold uppercase text-race-muted">{label}</p><p className={live ? "mt-1 font-semibold text-race-success" : "mt-1 font-semibold"}>{live ? "● " : ""}{value}</p></div>;
}
