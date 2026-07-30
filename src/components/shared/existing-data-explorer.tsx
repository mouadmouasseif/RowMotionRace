"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CircleAlert, LoaderCircle, Search, UserRound } from "lucide-react";
import { getExistingAthletes } from "@/integrations/rowmotion-ai/rowmotion-athletes.adapter";
import { getExistingClubs } from "@/integrations/rowmotion-ai/rowmotion-clubs.adapter";
import type { RowMotionAthlete, RowMotionClub } from "@/types/rowmotion-ai";

export function ExistingDataExplorer({ initialTab = "athletes" }: { initialTab?: "athletes" | "clubs" }) {
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState<RowMotionAthlete[]>([]);
  const [clubs, setClubs] = useState<RowMotionClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; Promise.allSettled([getExistingAthletes(), getExistingClubs()]).then(([a, c]) => { if (!active) return; if (a.status === "fulfilled") setAthletes(a.value); if (c.status === "fulfilled") setClubs(c.value); if (a.status === "rejected" || c.status === "rejected") setError("Connexion réussie au projet Firebase, mais les collections sont absentes ou refusées par les règles Firestore."); setLoading(false); }); return () => { active = false; }; }, []);
  const clubMap = useMemo(() => new Map(clubs.map((club) => [club.id, club])), [clubs]);
  const needle = search.toLocaleLowerCase("fr");
  const visibleAthletes = athletes.filter((a) => [a.displayName, a.licenseNumber, clubMap.get(a.clubId ?? "")?.name].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle));
  const visibleClubs = clubs.filter((c) => [c.name, c.shortName, c.city].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(needle));
  return <section className="overflow-hidden rounded-3xl border border-white/10 bg-race-surface">
    <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:justify-between"><div className="flex gap-2"><button onClick={() => setTab("athletes")} className={`rounded-xl px-4 py-2 text-sm ${tab === "athletes" ? "bg-race-primary text-white" : "bg-white/5 text-race-muted"}`}><UserRound className="mr-2 inline size-4" />Athlètes {athletes.length}</button><button onClick={() => setTab("clubs")} className={`rounded-xl px-4 py-2 text-sm ${tab === "clubs" ? "bg-race-primary text-white" : "bg-white/5 text-race-muted"}`}><Building2 className="mr-2 inline size-4" />Clubs {clubs.length}</button></div><label className="relative"><Search className="absolute left-3 top-3 size-4 text-race-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="h-10 w-full rounded-xl border border-white/10 bg-race-background pl-10 pr-4 text-sm outline-none focus:border-race-primary sm:w-72" /></label></div>
    {loading ? <div className="flex min-h-64 items-center justify-center gap-3 text-race-muted"><LoaderCircle className="size-5 animate-spin" />Lecture de RowMotion AI…</div> : error ? <div className="m-5 rounded-2xl border border-race-warning/20 bg-race-warning/5 p-5 text-sm text-race-muted"><CircleAlert className="mb-3 size-5 text-race-warning" />{error}</div> : tab === "athletes" ? <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">{visibleAthletes.length ? visibleAthletes.map((a) => <article key={a.id} className="rounded-2xl border border-white/10 bg-race-background/60 p-4"><h3 className="font-medium">{a.displayName}</h3><p className="mt-1 text-xs text-race-muted">{a.licenseNumber ? `Licence ${a.licenseNumber}` : "Licence non renseignée"}</p><p className="mt-2 text-xs text-race-primary">{clubMap.get(a.clubId ?? "")?.name ?? "Club non relié"}</p></article>) : <Empty label="Aucun athlète RowMotion AI disponible." />}</div> : <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">{visibleClubs.length ? visibleClubs.map((c) => <article key={c.id} className="rounded-2xl border border-white/10 bg-race-background/60 p-4"><h3 className="font-medium">{c.name}</h3><p className="mt-1 text-xs text-race-muted">{[c.shortName, c.city].filter(Boolean).join(" · ") || "Informations à valider"}</p></article>) : <Empty label="Aucun club RowMotion AI disponible." />}</div>}
    <div className="border-t border-white/10 px-5 py-3 text-xs text-race-muted">Lecture seule · aucune duplication · identifiants Firestore conservés</div>
  </section>;
}

function Empty({ label }: { label: string }) { return <div className="col-span-full grid min-h-48 place-items-center text-sm text-race-muted">{label}</div>; }
