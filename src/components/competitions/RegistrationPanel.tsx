"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trophy, UserPlus } from "lucide-react";
import { useAuth } from "@/features/authentication/auth-provider";
import { createRegistration, updateRegistrationStatus } from "@/services/federationService";
import { subscribeExistingAthletes } from "@/integrations/rowmotion-ai/rowmotion-athletes.adapter";
import { subscribeExistingClubs } from "@/integrations/rowmotion-ai/rowmotion-clubs.adapter";
import type { RowMotionAthlete, RowMotionClub } from "@/types/rowmotion-ai";
import type { CompetitionEvent, CompetitionRegistration } from "@/types/federation";

export function RegistrationPanel({ competitionId, events, registrations }: { competitionId: string; events: CompetitionEvent[]; registrations: CompetitionRegistration[] }) {
  const { user, profile } = useAuth();
  const [athletes, setAthletes] = useState<RowMotionAthlete[]>([]);
  const [clubs, setClubs] = useState<RowMotionClub[]>([]);
  const [search, setSearch] = useState("");
  const [athleteId, setAthleteId] = useState("");
  const [eventIds, setEventIds] = useState<string[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAthletes = subscribeExistingAthletes(setAthletes, (error) => setSyncError(error.message), 1000);
    const unsubscribeClubs = subscribeExistingClubs(setClubs, (error) => setSyncError(error.message), 500);
    return () => {
      unsubscribeAthletes();
      unsubscribeClubs();
    };
  }, []);

  const clubMap = useMemo(() => new Map(clubs.map((club) => [club.id, club])), [clubs]);
  const registrationByAthlete = useMemo(() => new Map(registrations.map((registration) => [registration.athleteId, registration])), [registrations]);
  const needle = search.toLocaleLowerCase("fr");
  const filtered = athletes
    .filter((athlete) => {
      const clubName = athlete.clubName ?? clubMap.get(athlete.clubId ?? "")?.name;
      return [athlete.displayName, athlete.licenseNumber, clubName, athlete.score, athlete.ranking].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle);
    })
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.displayName.localeCompare(b.displayName, "fr"))
    .slice(0, 80);
  const selected = athletes.find((athlete) => athlete.id === athleteId);

  async function submit(target = selected) {
    if (!target || eventIds.length === 0) return;
    const club = clubMap.get(target.clubId ?? "");
    await createRegistration(
      competitionId,
      {
        athleteId: target.id,
        athleteName: target.displayName,
        athletePhotoURL: target.photoURL,
        athleteScore: target.score,
        athleteRanking: target.ranking,
        athletePerformanceLabel: target.performanceLabel,
        clubId: target.clubId ?? "",
        clubName: target.clubName ?? club?.name,
        events: eventIds,
        status: "SUBMITTED"
      },
      user?.uid ?? "anonymous",
      profile?.role ?? "ADMIN"
    );
    setAthleteId("");
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="race-card rounded-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-race-primary">Synchronisation RowMotion AI</p>
            <h3 className="mt-2 text-xl font-black">Athletes disponibles automatiquement</h3>
            <p className="mt-1 text-sm text-race-muted">{athletes.length} athletes lus en direct. Race ne duplique aucune fiche athlete.</p>
          </div>
          <label className="relative">
            <Search className="absolute left-3 top-3 size-4 text-race-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher athlete, club, score..." className="h-11 w-full rounded-xl border border-white/10 bg-race-background pl-10 pr-4 text-sm outline-none focus:border-race-primary md:w-80" />
          </label>
        </div>
        {syncError && <div className="mt-4 rounded-xl border border-race-warning/25 bg-race-warning/10 p-3 text-sm text-race-warning">Diagnostic / System: {syncError}</div>}
        <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.length === 0 ? <Empty label="Aucun athlete RowMotion AI disponible." /> : filtered.map((athlete) => {
            const club = clubMap.get(athlete.clubId ?? "");
            const registration = registrationByAthlete.get(athlete.id);
            const active = athlete.id === athleteId;
            return (
              <article key={athlete.id} className={`rounded-2xl border p-4 transition ${active ? "border-race-primary bg-race-primary/10" : "border-white/10 bg-race-background/55"}`}>
                <button type="button" onClick={() => setAthleteId(athlete.id)} className="flex w-full gap-3 text-left">
                  <AthletePhoto athlete={athlete} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{athlete.displayName}</span>
                    <span className="mt-1 block text-xs text-race-muted">{athlete.licenseNumber ? `Licence ${athlete.licenseNumber}` : "Licence non renseignee"}</span>
                    <span className="mt-2 block text-xs text-race-primary">{athlete.clubName ?? club?.name ?? "Club non relie"}</span>
                  </span>
                </button>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Metric label="Score" value={athlete.score == null ? "-" : String(athlete.score)} />
                  <Metric label="Rang" value={athlete.ranking == null ? "-" : `#${athlete.ranking}`} />
                  <Metric label="Niveau" value={athlete.performanceLabel ?? "-"} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${registration ? "bg-race-success/15 text-race-success" : "bg-white/5 text-race-muted"}`}>{registration ? registration.status : "Non inscrit"}</span>
                  <button type="button" onClick={() => submit(athlete)} disabled={eventIds.length === 0 || Boolean(registration)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-race-primary px-3 text-xs font-black disabled:opacity-40"><UserPlus className="size-4" />INSCRIRE</button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="race-card rounded-2xl p-4">
        <h3 className="text-sm font-black uppercase tracking-[.16em]">Inscription competition</h3>
        <p className="mt-2 text-sm text-race-muted">Choisissez les epreuves, puis inscrivez un athlete RowMotion AI. Race garde seulement les references et donnees publiques utiles.</p>
        <div className="mt-4 space-y-2">
          {events.length === 0 ? <p className="rounded-xl border border-white/10 p-3 text-xs text-race-muted">Aucune categorie/epreuve configuree.</p> : events.map((event) => (
            <label key={event.id} className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-xs">
              <input type="checkbox" checked={eventIds.includes(event.id)} onChange={(input) => setEventIds((current) => input.target.checked ? [...current, event.id] : current.filter((id) => id !== event.id))} className="mt-1" />
              <span><strong>{event.name}</strong><span className="mt-1 block text-race-muted">{event.boatClass} - {event.distanceMeters}m</span></span>
            </label>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs font-bold uppercase text-race-muted">Athlete selectionne</p>
          {selected ? <div className="mt-3 flex items-center gap-3"><AthletePhoto athlete={selected} /><div><p className="font-bold">{selected.displayName}</p><p className="text-xs text-race-muted">Score {selected.score ?? "-"} - Rang {selected.ranking ?? "-"}</p></div></div> : <p className="mt-3 text-sm text-race-muted">Selectionnez un athlete dans le roster live.</p>}
          <button type="button" disabled={!selected || eventIds.length === 0 || Boolean(selected && registrationByAthlete.get(selected.id))} onClick={() => submit()} className="mt-4 h-11 w-full rounded-xl bg-race-primary text-xs font-black text-white disabled:opacity-40">INSCRIRE A LA COMPETITION</button>
        </div>
        <div className="mt-5">
          <h4 className="text-xs font-black uppercase text-race-muted">Inscriptions existantes</h4>
          <div className="mt-2 divide-y divide-white/[0.06]">
            {registrations.length === 0 ? <p className="py-3 text-xs text-race-muted">Aucune inscription.</p> : registrations.map((registration) => (
              <div key={registration.id} className="grid gap-2 py-3 text-xs">
                <div className="flex items-center justify-between gap-2"><span className="font-bold">{registration.athleteName || registration.athleteId}</span><span className="text-race-muted">{registration.status}</span></div>
                <p className="text-race-muted">{registration.clubName ?? registration.clubId} - Score {registration.athleteScore ?? "-"}</p>
                <div className="flex gap-2">
                  <button onClick={() => updateRegistrationStatus(competitionId, registration.id, "CONFIRMED", user?.uid ?? "anonymous", profile?.role ?? "ADMIN")} className="rounded-md bg-race-success px-2 py-1 text-white">Accepter</button>
                  <button onClick={() => updateRegistrationStatus(competitionId, registration.id, "REJECTED", user?.uid ?? "anonymous", profile?.role ?? "ADMIN")} className="rounded-md bg-race-danger px-2 py-1 text-white">Rejeter</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

function AthletePhoto({ athlete }: { athlete: RowMotionAthlete }) {
  return (
    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-race-elevated">
      {athlete.photoURL ? <span aria-label={`Photo ${athlete.displayName}`} className="size-full bg-cover bg-center" style={{ backgroundImage: `url("${athlete.photoURL}")` }} /> : <Trophy className="size-5 text-race-muted" />}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <span className="rounded-lg border border-white/10 bg-white/[0.035] p-2"><span className="block text-[10px] uppercase text-race-muted">{label}</span><strong className="mt-1 block truncate">{value}</strong></span>;
}

function Empty({ label }: { label: string }) {
  return <div className="col-span-full grid min-h-48 place-items-center rounded-2xl border border-white/10 text-sm text-race-muted">{label}</div>;
}
