"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings } from "lucide-react";
import { useAuth } from "@/features/authentication/auth-provider";
import { useLiveRace } from "@/hooks/useLiveRace";
import { useRaceEntries } from "@/hooks/useRaceEntries";
import { useLiveResults } from "@/hooks/useLiveResults";
import { useLiveCameras } from "@/hooks/useLiveCameras";
import { useRacePenalties } from "@/hooks/useRacePenalties";
import { useRaceSplits } from "@/hooks/useRaceSplits";
import { useRaceCheckpoints } from "@/hooks/useRaceCheckpoints";
import { useRaceContext } from "@/hooks/useRaceContext";
import { subscribeLiveEvents } from "@/services/liveEventService";
import type { JudgeRole, LiveEvent, Race } from "@/types/live-race";
import { LiveRaceHeader } from "./LiveRaceHeader";
import { LiveStartControl } from "./LiveStartControl";
import { LiveChronometer } from "./LiveChronometer";
import { LiveCameraGrid } from "./LiveCameraGrid";
import { FinishLineCamera } from "./FinishLineCamera";
import { LiveRaceEntries } from "./LiveRaceEntries";
import { LiveResults } from "./LiveResults";
import { LiveEventTimeline } from "./LiveEventTimeline";
import { LiveCourseProgress } from "./LiveCourseProgress";
import { JuryPanel } from "@/components/jury/JuryPanel";
import { FirebaseResetPanel } from "@/components/admin/FirebaseResetPanel";
import { StartJudgeMobile } from "@/components/mobile/StartJudgeMobile";
import { FinishJudgeMobile } from "@/components/mobile/FinishJudgeMobile";
import { CourseJudgeMobile } from "@/components/mobile/CourseJudgeMobile";
import { useEffect } from "react";

const roleOptions: JudgeRole[] = ["START_JUDGE", "FINISH_JUDGE", "COURSE_JUDGE", "CHIEF_JUDGE", "TIMEKEEPER", "ADMIN"];

export function LiveRaceCenter({ competitionId }: { competitionId: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const { user, profile } = useAuth();
  const selectedRaceId = params.get("raceId") ?? undefined;
  const selectedRole = (params.get("role") as JudgeRole | null) ?? "CHIEF_JUDGE";
  const userId = user?.uid ?? "anonymous";
  const authRole = (profile?.role?.toUpperCase() || selectedRole || "ADMIN") as string;
  const { race, races, loading, error } = useLiveRace(competitionId, selectedRaceId);
  const { entries } = useRaceEntries(competitionId, selectedRaceId);
  const { finishes, penaltyMsByEntry } = useLiveResults(competitionId, selectedRaceId);
  const penalties = useRacePenalties(competitionId, selectedRaceId);
  const splits = useRaceSplits(competitionId, selectedRaceId);
  const checkpoints = useRaceCheckpoints(competitionId, selectedRaceId);
  const { cameras } = useLiveCameras(competitionId);
  const { setContext } = useRaceContext();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [mobileMode, setMobileMode] = useState(false);
  const competitionName = race?.competitionName ?? competitionId;

  useEffect(() => {
    if (!selectedRaceId) {
      setEvents([]);
      return;
    }
    return subscribeLiveEvents(competitionId, selectedRaceId, setEvents);
  }, [competitionId, selectedRaceId]);

  function selectRace(nextRaceId: string) {
    const nextRace = races.find((item) => item.id === nextRaceId);
    if (nextRace) saveContext(nextRace, selectedRole);
    router.replace(`/competitions/${competitionId}/live?raceId=${nextRaceId}&role=${selectedRole}`);
  }

  function selectRole(nextRole: JudgeRole) {
    if (race) saveContext(race, nextRole);
    const racePart = selectedRaceId ? `raceId=${selectedRaceId}&` : "";
    router.replace(`/competitions/${competitionId}/live?${racePart}role=${nextRole}`);
  }

  function saveContext(nextRace: Race, nextRole: JudgeRole) {
    setContext({
      competitionId,
      raceId: nextRace.id,
      category: nextRace.categoryName ?? nextRace.category ?? "",
      gender: nextRace.gender ?? "",
      boatClass: nextRace.boatClass,
      raceType: nextRace.raceType ?? "",
      distance: nextRace.distanceMeters ?? nextRace.distance ?? 0,
      distanceMeters: nextRace.distanceMeters,
      role: nextRole
    });
  }

  return (
    <main className="min-h-screen bg-race-background text-race-text">
      <LiveRaceHeader race={race} competitionId={competitionId} entriesCount={entries.length} />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-white/[0.07] bg-race-surface p-3">
          <select value={selectedRaceId ?? ""} onChange={(event) => selectRace(event.target.value)} className="min-h-10 rounded-md border border-white/10 bg-race-background px-3 text-xs">
            <option value="">Sélectionnez votre course</option>
            {races.map((item) => <option key={item.id} value={item.id}>Race {item.raceNumber} • {item.categoryName ?? item.category} • {item.gender} • {item.boatClass} • {item.raceType}</option>)}
          </select>
          <select value={selectedRole} onChange={(event) => selectRole(event.target.value as JudgeRole)} className="min-h-10 rounded-md border border-white/10 bg-race-background px-3 text-xs">
            {roleOptions.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
          </select>
          <button type="button" onClick={() => setMobileMode((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-xs font-bold"><Settings className="size-4" />{mobileMode ? "Live Center" : "Mobile Judge"}</button>
          {loading && <span className="text-xs text-race-muted">Loading</span>}
          {error && <span className="text-xs text-race-danger">{error}</span>}
        </div>

        {!selectedRaceId ? (
          <section className="race-card rounded-lg p-5">
            <h2 className="text-base font-semibold">Welcome to RowMotion-Race</h2>
            <p className="mt-2 text-sm text-race-muted">Sélectionnez votre compétition, rôle, catégorie, type de bateau, type de course et race pour entrer dans le Live.</p>
          </section>
        ) : mobileMode ? (
          selectedRole === "START_JUDGE"
            ? <StartJudgeMobile competitionId={competitionId} race={race} races={races} entries={entries} onRaceChange={selectRace} userId={userId} />
            : selectedRole === "FINISH_JUDGE"
              ? <FinishJudgeMobile competitionId={competitionId} race={race} entries={entries} finishes={finishes} userId={userId} />
              : <CourseJudgeMobile competitionId={competitionId} raceId={race?.id} entries={entries} userId={userId} role={authRole} />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
              <LiveCameraGrid cameras={cameras} />
              <LiveStartControl competitionId={competitionId} race={race} races={races} entries={entries} onRaceChange={selectRace} userId={userId} />
            </div>
            <div className="grid gap-4 lg:grid-cols-[.85fr_1.15fr]">
              <LiveChronometer race={race} />
              <JuryPanel competitionId={competitionId} race={race} entries={entries} penalties={penalties} userId={userId} role={authRole} />
            </div>
            <LiveRaceEntries entries={entries} />
            <LiveCourseProgress race={race} entries={entries} checkpoints={checkpoints} splits={splits} />
            <FinishLineCamera competitionId={competitionId} raceId={race?.id} cameras={cameras} entries={entries} finishes={finishes} userId={userId} />
            <LiveResults race={race} entries={entries} finishes={finishes} penaltyMsByEntry={penaltyMsByEntry} />
            <LiveEventTimeline events={events} />
            {(authRole === "ADMIN" || authRole === "SUPER_ADMIN") && <FirebaseResetPanel competitionId={competitionId} competitionName={competitionName} raceId={race?.id} userId={userId} role={authRole} />}
          </div>
        )}
      </div>
    </main>
  );
}
