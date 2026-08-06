"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CircleAlert, Search, Trophy, UserRound } from "lucide-react";
import { subscribeExistingAthletes } from "@/integrations/rowmotion-ai/rowmotion-athletes.adapter";
import { subscribeExistingClubs } from "@/integrations/rowmotion-ai/rowmotion-clubs.adapter";
import type { RowMotionAthlete, RowMotionClub } from "@/types/rowmotion-ai";

export function ExistingDataExplorer({ initialTab = "athletes" }: { initialTab?: "athletes" | "clubs" }) {
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState<RowMotionAthlete[]>([]);
  const [clubs, setClubs] = useState<RowMotionClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const done = { athletes: false, clubs: false };
    const markDone = (key: keyof typeof done) => {
      done[key] = true;
      if (done.athletes && done.clubs) setLoading(false);
    };
    const unsubscribeAthletes = subscribeExistingAthletes((items) => {
      setAthletes(items);
      markDone("athletes");
    }, (err) => {
      setError(err.message);
      markDone("athletes");
    }, 1000);
    const unsubscribeClubs = subscribeExistingClubs((items) => {
      setClubs(items);
      markDone("clubs");
    }, (err) => {
      setError(err.message);
      markDone("clubs");
    }, 500);
    return () => {
      unsubscribeAthletes();
      unsubscribeClubs();
    };
  }, []);

  const clubMap = useMemo(() => new Map(clubs.map((club) => [club.id, club])), [clubs]);
  const needle = search.toLocaleLowerCase("fr");
  const visibleAthletes = athletes
    .filter((athlete) => [athlete.displayName, athlete.licenseNumber, athlete.clubName, clubMap.get(athlete.clubId ?? "")?.name, athlete.score, athlete.ranking].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a.displayName.localeCompare(b.displayName, "fr"));
  const visibleClubs = clubs.filter((club) => [club.name, club.shortName, club.city].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle));

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-race-surface">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <button onClick={() => setTab("athletes")} className={`rounded-xl px-4 py-2 text-sm ${tab === "athletes" ? "bg-race-primary text-white" : "bg-white/5 text-race-muted"}`}><UserRound className="mr-2 inline size-4" />Athletes {athletes.length}</button>
          <button onClick={() => setTab("clubs")} className={`rounded-xl px-4 py-2 text-sm ${tab === "clubs" ? "bg-race-primary text-white" : "bg-white/5 text-race-muted"}`}><Building2 className="mr-2 inline size-4" />Clubs {clubs.length}</button>
        </div>
        <label className="relative">
          <Search className="absolute left-3 top-3 size-4 text-race-muted" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher athlete, club, score..." className="h-10 w-full rounded-xl border border-white/10 bg-race-background pl-10 pr-4 text-sm outline-none focus:border-race-primary sm:w-80" />
        </label>
      </div>
      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 text-race-muted">Synchronisation RowMotion AI...</div>
      ) : error ? (
        <div className="m-5 rounded-2xl border border-race-warning/20 bg-race-warning/5 p-5 text-sm text-race-muted"><CircleAlert className="mb-3 size-5 text-race-warning" />Diagnostic / System: {error}</div>
      ) : tab === "athletes" ? (
        <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleAthletes.length ? visibleAthletes.map((athlete) => {
            const club = clubMap.get(athlete.clubId ?? "");
            return (
              <article key={athlete.id} className="rounded-2xl border border-white/10 bg-race-background/60 p-4">
                <div className="flex gap-3">
                  <AthletePhoto athlete={athlete} />
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{athlete.displayName}</h3>
                    <p className="mt-1 text-xs text-race-muted">{athlete.licenseNumber ? `Licence ${athlete.licenseNumber}` : "Licence non renseignee"}</p>
                    <p className="mt-2 text-xs text-race-primary">{athlete.clubName ?? club?.name ?? "Club non relie"}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Metric label="Score" value={athlete.score == null ? "-" : String(athlete.score)} />
                  <Metric label="Rang" value={athlete.ranking == null ? "-" : `#${athlete.ranking}`} />
                  <Metric label="Niveau" value={athlete.performanceLabel ?? "-"} />
                </div>
              </article>
            );
          }) : <Empty label="Aucun athlete RowMotion AI disponible." />}
        </div>
      ) : (
        <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleClubs.length ? visibleClubs.map((club) => <article key={club.id} className="rounded-2xl border border-white/10 bg-race-background/60 p-4"><h3 className="font-medium">{club.name}</h3><p className="mt-1 text-xs text-race-muted">{[club.shortName, club.city].filter(Boolean).join(" - ") || "Informations a valider"}</p></article>) : <Empty label="Aucun club RowMotion AI disponible." />}
        </div>
      )}
      <div className="border-t border-white/10 px-5 py-3 text-xs text-race-muted">Synchronisation temps reel - lecture seule - aucune duplication - identifiants Firestore conserves</div>
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
  return <div className="col-span-full grid min-h-48 place-items-center text-sm text-race-muted">{label}</div>;
}
