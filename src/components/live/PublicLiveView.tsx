"use client";

import { useEffect, useState } from "react";
import { getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { Radio } from "lucide-react";
import type { Competition } from "@/types/federation";
import type { Race } from "@/types/live-race";
import { competitionsCollection, racesCollection } from "@/services/livePaths";
import { useRaceEntries } from "@/hooks/useRaceEntries";
import { useLiveResults } from "@/hooks/useLiveResults";
import { useRaceChronometer, formatRaceTime } from "@/hooks/useRaceChronometer";

export function PublicLiveView({ code }: { code: string }) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [race, setRace] = useState<Race | null>(null);

  useEffect(() => {
    let unsubscribeRace: (() => void) | undefined;
    const unsubscribeCompetition = onSnapshot(query(competitionsCollection(), where("competitionCode", "==", code), limit(1)), async (snapshot) => {
      const competitionDoc = snapshot.docs[0];
      if (!competitionDoc) {
        setCompetition(null);
        setRace(null);
        return;
      }
      const nextCompetition = { id: competitionDoc.id, ...competitionDoc.data() } as Competition;
      setCompetition(nextCompetition);
      unsubscribeRace?.();
      const liveRaceSnapshot = await getDocs(query(racesCollection(nextCompetition.id), where("status", "in", ["RACING", "FINISHING", "FINISHED", "VALIDATED"]), limit(1)));
      const raceDoc = liveRaceSnapshot.docs[0];
      if (!raceDoc) {
        setRace(null);
        return;
      }
      unsubscribeRace = onSnapshot(raceDoc.ref, (nextRace) => setRace(nextRace.exists() ? ({ id: nextRace.id, ...nextRace.data() } as Race) : null));
    });
    return () => {
      unsubscribeCompetition();
      unsubscribeRace?.();
    };
  }, [code]);

  const { entries } = useRaceEntries(competition?.id ?? "", race?.id);
  const { finishes, penalties } = useLiveResults(competition?.id ?? "", race?.id);
  const chrono = useRaceChronometer(race);
  const ordered = entries.map((entry) => {
    const finish = finishes.find((item) => item.id === entry.id || item.athleteId === entry.athleteId);
    const penalty = penalties.filter((item) => item.entryId === entry.id && item.status !== "CANCELLED").reduce((sum, item) => sum + item.penaltyMs, 0);
    return { entry, finish, penalty };
  }).sort((a, b) => (a.finish?.rank ?? 99) - (b.finish?.rank ?? 99) || a.entry.lane - b.entry.lane);

  return (
    <main className="min-h-screen bg-[#020b18] text-race-text">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-race-primary">RowMotion Race</p>
            <h1 className="mt-2 text-3xl font-black">{competition?.name ?? "Championnat du Maroc 2026"}</h1>
            <p className="mt-1 text-sm text-race-muted">{race ? `${race.categoryName ?? race.category ?? "U19 Homme"} - ${race.boatClass ?? "1x"} - Qualification 2` : "Aucune course diffusee"}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-race-danger/30 bg-race-danger/10 px-4 py-2 text-sm font-black text-race-danger">
            <Radio className="size-4" /> LIVE
          </div>
        </header>
        <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <div className="relative grid min-h-[52vh] place-items-center race-grid">
              <div className="absolute left-4 top-4 rounded-md bg-race-danger px-3 py-2 text-xs font-black">LIVE</div>
              <div className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-4 py-3">
                <p className="text-xs font-bold uppercase text-race-muted">Official timer</p>
                <p className="font-mono text-4xl font-black tabular-nums">{chrono.hasOfficialStart ? chrono.formatted : "00:00.000"}</p>
              </div>
              <div className="text-center">
                <Radio className="mx-auto size-14 text-race-primary" />
                <p className="mt-3 text-sm font-bold">Flux camera public</p>
                <p className="mt-1 text-xs text-race-muted">La camera ON AIR sera diffusee ici lorsque la session live est active.</p>
              </div>
            </div>
          </div>
          <aside className="race-card rounded-2xl p-4">
            <h2 className="text-sm font-black uppercase tracking-[.16em]">Classement en direct</h2>
            <div className="mt-4 space-y-2">
              {ordered.length === 0 ? <p className="text-sm text-race-muted">Aucun participant public disponible.</p> : ordered.map((item, index) => (
                <div key={item.entry.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <strong>{index + 1}</strong>
                  <div><p className="text-sm font-bold">{item.entry.athleteName}</p><p className="text-xs text-race-muted">{item.entry.clubName}{item.penalty ? ` - +${item.penalty / 1000}s` : ""}</p></div>
                  <p className="font-mono text-sm">{item.finish ? formatRaceTime(item.finish.finishTimeMs + item.penalty) : "En course"}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
        <section className="mt-5 race-card rounded-2xl p-5">
          <h2 className="text-sm font-black uppercase tracking-[.16em]">Progression</h2>
          <div className="mt-4 grid grid-cols-5 text-xs text-race-muted"><span>0m</span><span>500m</span><span>1000m</span><span>1500m</span><span className="text-right">2000m</span></div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/5 rounded-full bg-race-primary" /></div>
        </section>
        <section className="mt-5 grid gap-3 md:grid-cols-5">
          {["LIVE", "PROGRAMME", "RESULTATS", "CLASSEMENTS", "CLUBS"].map((item) => <button key={item} type="button" className="h-12 rounded-xl border border-white/10 text-sm font-black text-race-muted">{item}</button>)}
        </section>
      </div>
    </main>
  );
}
