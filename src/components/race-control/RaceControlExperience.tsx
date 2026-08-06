"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  Check,
  Copy,
  Flag,
  Gauge,
  Maximize2,
  MonitorDot,
  Play,
  Radio,
  ShieldAlert,
  Square,
  Timer,
  Users,
  Video,
  Volume2
} from "lucide-react";
import type { Race, RaceEntry, RaceFinish, RacePenalty, PenaltyType } from "@/types/live-race";
import { useAuth } from "@/features/authentication/auth-provider";
import { useCompetition } from "@/hooks/useCompetitions";
import { useLiveRace } from "@/hooks/useLiveRace";
import { useRaceEntries } from "@/hooks/useRaceEntries";
import { useLiveResults } from "@/hooks/useLiveResults";
import { useLiveCameras } from "@/hooks/useLiveCameras";
import { useRaceChronometer, formatRaceTime } from "@/hooks/useRaceChronometer";
import { LiveRanking } from "@/live/LiveRanking";
import { applyPenalty } from "@/services/penaltyService";
import { cancelStart, markAttention, restartRace, startRaceClock } from "@/services/chronoService";
import { confirmFinish, registerFinish, undoFinish } from "@/services/finishService";
import { publicLiveUrl, qrCodeUrl } from "@/services/publicLiveService";
import { queueOfflineTimingEvent } from "@/timing/OfflineEventQueue";
import { createTimingEvent } from "@/timing/TimingEvents";
import { subscribeExistingAthletes } from "@/integrations/rowmotion-ai/rowmotion-athletes.adapter";
import { subscribeExistingClubs } from "@/integrations/rowmotion-ai/rowmotion-clubs.adapter";
import type { RowMotionAthlete, RowMotionClub } from "@/types/rowmotion-ai";
import { cn } from "@/lib/utils";

type Mode = "control" | "starter" | "finish" | "jury" | "mobile-starter" | "mobile-finish" | "mobile-jury" | "public-admin" | "beach";

const fallbackEntries: RaceEntry[] = [
  { id: "demo-lane-1", athleteId: "demo-a1", athleteName: "Yassine El Amrani", clubId: "cn-rabat", clubName: "CN Rabat", category: "U19 Homme", gender: "H", boatId: "boat-14", boatNumber: "14", lane: 1, status: "READY" },
  { id: "demo-lane-2", athleteId: "demo-a2", athleteName: "Omar Benali", clubId: "ca-fes", clubName: "CA Fes", category: "U19 Homme", gender: "H", boatId: "boat-27", boatNumber: "27", lane: 2, status: "READY" },
  { id: "demo-lane-3", athleteId: "demo-a3", athleteName: "Ilyass Ait Hamou", clubId: "ca-casa", clubName: "CA Casablanca", category: "U19 Homme", gender: "H", boatId: "boat-11", boatNumber: "11", lane: 3, status: "READY" },
  { id: "demo-lane-4", athleteId: "demo-a4", athleteName: "Amine Zahraoui", clubId: "ca-tanger", clubName: "CA Tanger", category: "U19 Homme", gender: "H", boatId: "boat-09", boatNumber: "09", lane: 4, status: "READY" }
];

export function RaceControlExperience({ competitionId, raceId, mode = "control" }: { competitionId?: string; raceId?: string; mode?: Mode }) {
  const resolvedCompetitionId = competitionId ?? "active";
  const { profile, user } = useAuth();
  const { competition, error: competitionError } = useCompetition(resolvedCompetitionId);
  const live = useLiveRace(resolvedCompetitionId, raceId);
  const race = live.race ?? live.races.find((item) => ["RACING", "FINISHING", "READY", "START_SEQUENCE"].includes(item.status)) ?? live.races[0] ?? null;
  const { entries, error: entriesError } = useRaceEntries(resolvedCompetitionId, race?.id);
  const results = useLiveResults(resolvedCompetitionId, race?.id);
  const cameras = useLiveCameras(resolvedCompetitionId);
  const chrono = useRaceChronometer(race);
  const [rowMotionAthletes, setRowMotionAthletes] = useState<RowMotionAthlete[]>([]);
  const [rowMotionClubs, setRowMotionClubs] = useState<RowMotionClub[]>([]);
  const userId = user?.uid ?? profile?.id ?? "local-official";
  const role = profile?.role ?? "SUPER_ADMIN";
  useEffect(() => {
    const unsubscribeAthletes = subscribeExistingAthletes(setRowMotionAthletes, undefined, 1000);
    const unsubscribeClubs = subscribeExistingClubs(setRowMotionClubs, undefined, 500);
    return () => {
      unsubscribeAthletes();
      unsubscribeClubs();
    };
  }, []);
  const athleteMap = useMemo(() => new Map(rowMotionAthletes.map((athlete) => [athlete.id, athlete])), [rowMotionAthletes]);
  const clubMap = useMemo(() => new Map(rowMotionClubs.map((club) => [club.id, club])), [rowMotionClubs]);
  const operationalEntries = useMemo(() => {
    const sourceEntries = entries.length > 0 ? entries : fallbackEntries;
    return sourceEntries.map((entry) => {
      const athlete = athleteMap.get(entry.athleteId);
      const club = clubMap.get(athlete?.clubId ?? entry.clubId);
      return {
        ...entry,
        athleteName: athlete?.displayName ?? entry.athleteName,
        athletePhotoURL: athlete?.photoURL ?? entry.athletePhotoURL,
        athleteScore: athlete?.score ?? entry.athleteScore,
        athleteRanking: athlete?.ranking ?? entry.athleteRanking,
        athletePerformanceLabel: athlete?.performanceLabel ?? entry.athletePerformanceLabel,
        clubId: athlete?.clubId ?? entry.clubId,
        clubName: athlete?.clubName ?? club?.name ?? entry.clubName
      };
    });
  }, [athleteMap, clubMap, entries]);
  const publicUrl = publicLiveUrl(competition?.competitionCode || resolvedCompetitionId);
  const diagnosticErrors = [competitionError, live.error, entriesError, cameras.error].filter(Boolean);

  if (mode === "mobile-starter") return <MobileFrame title="START CONTROL"><StarterPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} userId={userId} compact /></MobileFrame>;
  if (mode === "mobile-finish") return <MobileFrame title="FINISH CONTROL"><FinishPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} finishes={results.finishes} userId={userId} compact /></MobileFrame>;
  if (mode === "mobile-jury") return <MobileFrame title="JURY CONTROL"><JuryPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} penalties={results.penalties} userId={userId} role={role} compact /></MobileFrame>;
  if (mode === "public-admin") return <ShareLivePanel competitionId={resolvedCompetitionId} publicUrl={publicUrl} code={competition?.competitionCode || resolvedCompetitionId} />;
  if (mode === "beach") return <BeachSprintControl competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} userId={userId} />;

  return (
    <div className="space-y-4">
      <RaceHeader competitionName={competition?.name} location={competition?.location} race={race} chrono={chrono.formatted} />
      {diagnosticErrors.length > 0 && <DiagnosticPanel errors={diagnosticErrors as string[]} />}
      <div className="grid gap-4 xl:grid-cols-12">
        <section className="xl:col-span-8">
          <CameraPlayer title={mode === "starter" ? "CAM START" : mode === "finish" ? "CAMERA ARRIVEE" : "CAMERA PRINCIPALE"} />
        </section>
        <section className="xl:col-span-4">
          {mode === "jury" ? (
            <JuryPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} penalties={results.penalties} userId={userId} role={role} />
          ) : mode === "finish" ? (
            <FinishPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} finishes={results.finishes} userId={userId} />
          ) : (
            <RaceLeaderboard entries={operationalEntries} finishes={results.finishes} penalties={results.penalties} />
          )}
        </section>
        <section className="xl:col-span-8">
          <CameraDeck cameras={cameras.cameras} />
        </section>
        <section className="xl:col-span-4">
          <RaceStateCard race={race} chrono={chrono.formatted} entries={operationalEntries} />
        </section>
        <section className="xl:col-span-12">
          {mode === "starter" ? (
            <StarterPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} userId={userId} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <StarterPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} userId={userId} />
              <FinishPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} finishes={results.finishes} userId={userId} />
              <JuryPanel competitionId={resolvedCompetitionId} race={race} entries={operationalEntries} penalties={results.penalties} userId={userId} role={role} />
            </div>
          )}
        </section>
        <section className="xl:col-span-12">
          <ResultsPanel race={race} entries={operationalEntries} finishes={results.finishes} penalties={results.penalties} />
        </section>
      </div>
    </div>
  );
}

function RaceHeader({ competitionName, location, race, chrono }: { competitionName?: string; location?: string; race: Race | null; chrono: string }) {
  return (
    <header className="race-card rounded-2xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-race-primary">Race Control Center</p>
          <h1 className="mt-2 text-2xl font-semibold">{competitionName ?? "Championnat du Maroc 2026"}</h1>
          <p className="mt-1 text-sm text-race-muted">{location ?? "Lac de barrage Mohammed Ben Abdellah"}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          <Info label="Course" value={race ? `#${race.raceNumber}` : "#18"} />
          <Info label="Categorie" value={race?.categoryName ?? race?.category ?? "U19 Homme"} />
          <Info label="Distance" value={`${race?.distanceMeters ?? race?.distance ?? 2000} m`} />
          <Info label="Etat" value={race?.status ?? "PREPARATION"} live={race?.status === "RACING"} />
        </div>
        <div className="rounded-xl border border-race-primary/30 bg-race-primary/10 px-5 py-3 text-right">
          <p className="text-[10px] font-bold uppercase text-race-muted">Official timer</p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{chrono}</p>
        </div>
      </div>
    </header>
  );
}

function CameraPlayer({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [line, setLine] = useState(50);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((items) => setDevices(items.filter((item) => item.kind === "videoinput"))).catch(() => setDevices([]));
  }, [stream]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  async function startCamera() {
    const nextStream = await navigator.mediaDevices.getUserMedia({ video: deviceId ? { deviceId: { exact: deviceId } } : true, audio: false });
    setStream(nextStream);
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  return (
    <section className="race-card overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[.16em] text-race-muted">{title}</h2>
          <p className="mt-1 text-xs text-race-success">{stream ? "● CONNECTEE" : "○ Aucune camera connectee"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={deviceId} onChange={(event) => setDeviceId(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-race-elevated px-3 text-xs text-race-text">
            <option value="">Selectionner camera</option>
            {devices.map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>)}
          </select>
          <button type="button" onClick={startCamera} className="inline-flex h-10 items-center gap-2 rounded-lg bg-race-primary px-3 text-xs font-bold"><Video className="size-4" />DEMARRER CAMERA</button>
          <button type="button" onClick={stopCamera} className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-race-muted"><Square className="size-4" />ARRETER</button>
          <button type="button" onClick={() => videoRef.current?.requestFullscreen()} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-race-muted" aria-label="Plein ecran"><Maximize2 className="size-4" /></button>
        </div>
      </div>
      <div className="relative min-h-[360px] bg-black">
        {stream ? <video ref={videoRef} autoPlay muted playsInline className="h-full min-h-[360px] w-full object-cover" /> : <div className="grid min-h-[360px] place-items-center text-center"><div><Camera className="mx-auto size-10 text-race-muted" /><p className="mt-3 text-sm text-race-muted">Activez la camera du PC pour le prototype V1.</p></div></div>}
        <div className={cn("pointer-events-none absolute bg-race-danger/90 shadow-[0_0_20px_rgba(255,70,93,.5)]", orientation === "vertical" ? "top-0 h-full w-1" : "left-0 h-1 w-full")} style={orientation === "vertical" ? { left: `${line}%` } : { top: `${line}%` }} />
        <div className="absolute left-4 top-4 rounded-md bg-black/60 px-3 py-2 text-xs font-bold">AI ASSIST - EXPERIMENTAL</div>
        <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-xl border border-white/10 bg-black/55 p-3 sm:grid-cols-3">
          <label className="text-xs text-race-muted">Position ligne<input type="range" min="5" max="95" value={line} onChange={(event) => setLine(Number(event.target.value))} className="mt-2 w-full" /></label>
          <label className="text-xs text-race-muted">Orientation<select value={orientation} onChange={(event) => setOrientation(event.target.value as "vertical" | "horizontal")} className="mt-2 h-9 w-full rounded-md bg-race-elevated px-2 text-race-text"><option value="vertical">Verticale</option><option value="horizontal">Horizontale</option></select></label>
          <div className="rounded-md border border-white/10 p-2 text-xs text-race-muted">Detection future: aucune detection automatique ne sera generee sans modele entraine.</div>
        </div>
      </div>
    </section>
  );
}

function StarterPanel({ competitionId, race, entries, userId, compact = false }: { competitionId: string; race: Race | null; entries: RaceEntry[]; userId: string; compact?: boolean }) {
  const [running, setRunning] = useState(false);
  const [state, setState] = useState("READY");
  const [offlineNotice, setOfflineNotice] = useState("");
  const raceId = race?.id;
  const readyCount = entries.filter((entry) => entry.status === "READY" || entry.status === "PRESENT").length || entries.length;

  async function launchSequence() {
    if (!raceId) return;
    setRunning(true);
    setOfflineNotice("");
    setState("READY");
    try {
      await markAttention(competitionId, raceId, userId);
      window.setTimeout(() => setState("ATTENTION"), 1200);
      window.setTimeout(async () => {
        setState("GO");
        try {
          await startRaceClock(competitionId, raceId, userId);
        } catch (error) {
          if (isOfflineTimingError(error)) {
            queueOfflineTimingEvent(createTimingEvent({ raceId, type: "START", stationId: "start-control", userId, payload: { competitionId } }));
            setOfflineNotice("OFFLINE - START stored locally");
          } else {
            setOfflineNotice(error instanceof Error ? error.message : "Start rejected");
          }
        } finally {
          setRunning(false);
        }
      }, 3000);
    } catch (error) {
      if (!isOfflineTimingError(error)) {
        setOfflineNotice(error instanceof Error ? error.message : "Start rejected");
        setRunning(false);
        return;
      }
      queueOfflineTimingEvent(createTimingEvent({ raceId, type: "START_ARMED", stationId: "start-control", userId, payload: { competitionId } }));
      setOfflineNotice("OFFLINE - ARM event stored locally");
      setRunning(false);
    }
  }

  return (
    <section className={cn("race-card rounded-2xl p-4", compact && "min-h-screen border-0 bg-transparent shadow-none")}>
      <PanelTitle icon={Volume2} title="START CONTROL" subtitle={race ? `Course #${race.raceNumber} - ${race.categoryName ?? race.category ?? "Categorie"}` : "Aucune course active"} />
      <div className="mt-4 rounded-xl border border-race-success/20 bg-race-success/10 p-4 text-center">
        <p className="text-sm font-bold text-race-success">{readyCount} / {entries.length} PRETS</p>
        <p className="mt-2 text-4xl font-black">{state}</p>
      </div>
      {offlineNotice && <div className="mt-3 rounded-xl border border-race-warning/30 bg-race-warning/10 p-3 text-xs font-black text-race-warning">{offlineNotice}</div>}
      <div className="mt-4 space-y-2">
        {entries.map((entry) => <LaneMini key={entry.id} entry={entry} />)}
      </div>
      <button type="button" disabled={!raceId || running} onClick={launchSequence} className="mt-4 flex min-h-[72px] w-full items-center justify-center gap-3 rounded-xl bg-race-success px-4 text-sm font-black text-[#02120a] disabled:opacity-50"><Play className="size-5" />LANCER LA SEQUENCE</button>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" disabled={!raceId} onClick={() => raceId && cancelStart(competitionId, raceId, userId)} className="min-h-12 rounded-lg bg-race-danger/15 text-xs font-bold text-race-danger">FAUX DEPART</button>
        <button type="button" disabled={!raceId} onClick={() => raceId && cancelStart(competitionId, raceId, userId)} className="min-h-12 rounded-lg border border-white/10 text-xs font-bold text-race-muted">STOP</button>
        <button type="button" disabled={!raceId} onClick={() => raceId && restartRace(competitionId, raceId, userId)} className="min-h-12 rounded-lg border border-white/10 text-xs font-bold text-race-muted">RESET</button>
      </div>
    </section>
  );
}

function FinishPanel({ competitionId, race, entries, finishes, userId, compact = false }: { competitionId: string; race: Race | null; entries: RaceEntry[]; finishes: RaceFinish[]; userId: string; compact?: boolean }) {
  const chrono = useRaceChronometer(race);
  const activeFinishes = finishes.filter((finish) => finish.reviewStatus !== "CANCELLED");
  const finishByEntryId = new Map(activeFinishes.map((finish) => [finish.id, finish]));
  const [busyEntryId, setBusyEntryId] = useState<string | null>(null);
  const [offlineNotice, setOfflineNotice] = useState("");
  async function finish(entry: RaceEntry) {
    if (!race?.id || entry.id.startsWith("demo-")) return;
    setBusyEntryId(entry.id);
    setOfflineNotice("");
    try {
      await registerFinish(competitionId, race.id, entry.id, userId);
    } catch (error) {
      if (isOfflineTimingError(error)) {
        queueOfflineTimingEvent(createTimingEvent({
          raceId: race.id,
          type: "FINISH",
          stationId: `lane-${entry.lane}`,
          userId,
          payload: { competitionId, entryId: entry.id, lane: entry.lane }
        }));
        setOfflineNotice(`OFFLINE - Lane ${entry.lane} finish stored locally`);
      } else {
        setOfflineNotice(error instanceof Error ? error.message : "Finish rejected");
      }
    } finally {
      setBusyEntryId(null);
    }
  }
  async function undo(entry: RaceEntry) {
    if (!race?.id) return;
    setBusyEntryId(entry.id);
    try {
      await undoFinish(competitionId, race.id, entry.id, userId);
    } finally {
      setBusyEntryId(null);
    }
  }
  async function confirm(entry: RaceEntry) {
    if (!race?.id) return;
    setBusyEntryId(entry.id);
    try {
      await confirmFinish(competitionId, race.id, entry.id, userId);
    } finally {
      setBusyEntryId(null);
    }
  }
  return (
    <section className={cn("race-card rounded-2xl p-4", compact && "min-h-screen border-0 bg-transparent shadow-none")}>
      <PanelTitle icon={Flag} title="FINISH & TIMING" subtitle="Manual official mode" />
      <div className="mt-4 rounded-xl border border-race-primary/25 bg-race-primary/10 p-4 text-center">
        <p className="text-xs font-bold uppercase text-race-muted">Official timer</p>
        <p className="mt-1 font-mono text-4xl font-semibold tabular-nums">{chrono.formatted}</p>
      </div>
      {offlineNotice && <div className="mt-3 rounded-xl border border-race-warning/30 bg-race-warning/10 p-3 text-xs font-black text-race-warning">{offlineNotice}</div>}
      <div className="mt-4 grid gap-2">
        {entries.map((entry) => {
          const recordedFinish = finishByEntryId.get(entry.id);
          const busy = busyEntryId === entry.id;
          return (
            <div key={entry.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <button type="button" disabled={!race?.id || Boolean(recordedFinish) || busy} onClick={() => finish(entry)} className="flex min-h-[64px] w-full items-center justify-between rounded-lg px-1 text-left disabled:opacity-60">
                <span><strong>LANE {entry.lane}</strong><span className="block text-xs text-race-muted">{entry.athleteName}</span></span>
                <span className="rounded-lg bg-race-primary px-3 py-2 text-xs font-black">{busy ? "..." : recordedFinish ? "RECORDED" : "FINISH"}</span>
              </button>
              {recordedFinish && (
                <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-[1fr_auto_auto]">
                  <div>
                    <p className="font-mono text-xl font-black tabular-nums">{formatRaceTime(recordedFinish.officialTime)}</p>
                    <p className="text-xs text-race-muted">{recordedFinish.reviewStatus === "CONFIRMED" ? "Finish confirmed" : "Finish recorded - awaiting confirmation"}</p>
                  </div>
                  <button type="button" disabled={busy || recordedFinish.reviewStatus === "CONFIRMED"} onClick={() => confirm(entry)} className="min-h-11 rounded-lg bg-race-success px-4 text-xs font-black text-[#02120a] disabled:opacity-50">CONFIRM</button>
                  <button type="button" disabled={busy} onClick={() => undo(entry)} className="min-h-11 rounded-lg border border-race-danger/40 px-4 text-xs font-black text-race-danger disabled:opacity-50">UNDO</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <FinishDetectionPanel />
    </section>
  );
}

function JuryPanel({ competitionId, race, entries, penalties, userId, role, compact = false }: { competitionId: string; race: Race | null; entries: RaceEntry[]; penalties: RacePenalty[]; userId: string; role: string; compact?: boolean }) {
  const [selectedEntry, setSelectedEntry] = useState<RaceEntry | null>(null);
  const [type, setType] = useState<PenaltyType>("TIME_PENALTY");
  const [penaltyMs, setPenaltyMs] = useState(2000);
  const [reason, setReason] = useState("Decision jury");
  async function submitPenalty() {
    if (!race?.id || !selectedEntry) return;
    await applyPenalty(competitionId, {
      raceId: race.id,
      entryId: selectedEntry.id,
      athleteId: selectedEntry.athleteId,
      boatId: selectedEntry.boatId,
      lane: selectedEntry.lane,
      type,
      reason,
      penaltyMs,
      createdBy: userId
    }, role);
    setSelectedEntry(null);
  }
  return (
    <section className={cn("race-card rounded-2xl p-4", compact && "min-h-screen border-0 bg-transparent shadow-none")}>
      <PanelTitle icon={ShieldAlert} title="JURY / PENALITES" subtitle={race ? `Course #${race.raceNumber}` : "Course en attente"} />
      <div className="mt-4 space-y-2">
        {entries.map((entry) => <button key={entry.id} type="button" onClick={() => setSelectedEntry(entry)} className="flex min-h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 text-left"><span><strong>LANE {entry.lane}</strong><span className="block text-xs text-race-muted">{entry.athleteName}</span></span><span className="rounded-lg bg-race-warning/15 px-3 py-2 text-xs font-bold text-race-warning">+ FAUTE</span></button>)}
      </div>
      <div className="mt-4 space-y-2 text-xs text-race-muted">
        {penalties.length === 0 ? <p>Aucune decision jury.</p> : penalties.slice(0, 4).map((penalty) => <p key={penalty.id}>Lane {penalty.lane}: +{formatRaceTime(penalty.penaltyMs)} {penalty.type}</p>)}
      </div>
      {selectedEntry && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-race-surface p-5">
            <h3 className="text-lg font-bold">BOAT #{selectedEntry.boatNumber}</h3>
            <p className="mt-1 text-sm text-race-muted">{selectedEntry.athleteName}</p>
            <label className="mt-4 block text-xs text-race-muted">Type de decision<select value={type} onChange={(event) => setType(event.target.value as PenaltyType)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-race-elevated px-3 text-race-text"><option value="WARNING">WARNING</option><option value="FALSE_START">FALSE_START</option><option value="TIME_PENALTY">TIME_PENALTY</option><option value="INTERFERENCE">INTERFERENCE</option><option value="LANE_VIOLATION">LANE_INTERFERENCE</option><option value="DSQ">DSQ</option><option value="DNF">DNF</option><option value="DNS">DNS</option><option value="OTHER">CUSTOM</option></select></label>
            <div className="mt-3 grid grid-cols-4 gap-2">{[1000, 2000, 5000, 10000].map((ms) => <button key={ms} type="button" onClick={() => setPenaltyMs(ms)} className={cn("h-10 rounded-lg border border-white/10 text-xs", penaltyMs === ms && "bg-race-primary")}>+{ms / 1000}s</button>)}</div>
            <input value={reason} onChange={(event) => setReason(event.target.value)} className="mt-3 h-11 w-full rounded-lg border border-white/10 bg-race-elevated px-3 text-sm" />
            <div className="mt-4 flex gap-2"><button type="button" onClick={submitPenalty} className="h-11 flex-1 rounded-lg bg-race-warning font-bold text-[#1b1200]">VALIDER</button><button type="button" onClick={() => setSelectedEntry(null)} className="h-11 flex-1 rounded-lg border border-white/10 text-race-muted">ANNULER</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

function RaceLeaderboard({ entries, finishes, penalties }: { entries: RaceEntry[]; finishes: RaceFinish[]; penalties: RacePenalty[] }) {
  return <LiveRanking entries={entries} finishes={finishes} penalties={penalties} />;
}

function ResultsPanel({ race, entries, finishes, penalties }: { race: Race | null; entries: RaceEntry[]; finishes: RaceFinish[]; penalties: RacePenalty[] }) {
  return (
    <section className="race-card rounded-2xl p-4">
      <PanelTitle icon={Check} title="RESULT REVIEW" subtitle={race?.resultsStatus === "OFFICIAL" ? "OFFICIEL" : "PROVISOIRE"} />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-race-muted"><tr><th className="py-2">Rank</th><th>Lane</th><th>Athlete</th><th>Club</th><th>Raw</th><th>Penalty</th><th>Official</th></tr></thead>
          <tbody className="divide-y divide-white/[0.07]">
            {entries.map((entry, index) => {
              const finish = finishes.find((item) => item.reviewStatus !== "CANCELLED" && (item.id === entry.id || item.athleteId === entry.athleteId));
              const penalty = penalties.filter((item) => item.entryId === entry.id && item.status !== "CANCELLED").reduce((sum, item) => sum + item.penaltyMs, 0);
              return <tr key={entry.id}><td className="py-3">{finish?.rank ?? index + 1}</td><td>{entry.lane}</td><td>{entry.athleteName}</td><td className="text-race-muted">{entry.clubName}</td><td className="font-mono">{finish ? formatRaceTime(finish.finishTimeMs) : "--:--.---"}</td><td className="font-mono text-race-warning">{penalty ? `+${formatRaceTime(penalty)}` : "-"}</td><td className="font-mono font-bold">{finish ? formatRaceTime(finish.finishTimeMs + penalty) : "--:--.---"}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-race-muted sm:grid-cols-4"><span>✓ Chronometrage complet</span><span>✓ Jury verifie</span><span>✓ Arrivee verifiee</span><span>Publication: CHIEF_JUDGE / SUPER_ADMIN</span></div>
    </section>
  );
}

function CameraDeck({ cameras }: { cameras: Array<{ id: string; name: string; type: string; enabled: boolean; status: string }> }) {
  const defaults = cameras.length > 0 ? cameras : [
    { id: "cam-1", name: "CAM 1", type: "START", enabled: true, status: "ONLINE" },
    { id: "cam-2", name: "CAM 2", type: "500 M", enabled: false, status: "OFFLINE" },
    { id: "cam-3", name: "CAM 3", type: "1500 M", enabled: false, status: "OFFLINE" },
    { id: "cam-4", name: "CAM 4", type: "FINISH", enabled: false, status: "OFFLINE" }
  ];
  return <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{defaults.map((camera, index) => <div key={camera.id} className="race-card rounded-2xl p-4"><div className="flex items-center justify-between"><MonitorDot className="size-5 text-race-primary" />{index === 0 && <span className="rounded-full bg-race-danger px-2 py-1 text-[10px] font-bold">ON AIR</span>}</div><h3 className="mt-3 font-bold">{camera.name}</h3><p className="text-sm text-race-muted">{camera.type}</p><p className={cn("mt-3 text-xs font-bold", camera.status === "ONLINE" ? "text-race-success" : "text-race-muted")}>{camera.status === "ONLINE" ? "● CONNECTEE" : "○ HORS LIGNE"}</p><button className="mt-3 h-9 w-full rounded-lg border border-white/10 text-xs font-bold text-race-muted">METTRE EN DIRECT</button></div>)}</section>;
}

function RaceStateCard({ race, chrono, entries }: { race: Race | null; chrono: string; entries: RaceEntry[] }) {
  return <section className="race-card rounded-2xl p-4"><PanelTitle icon={Gauge} title="RACE STATE" subtitle="Synchronisation Firebase" /><div className="mt-4 grid gap-2"><Info label="Statut" value={race?.status ?? "PREPARATION"} live={race?.status === "RACING"} /><Info label="Timer" value={chrono} /><Info label="Participants" value={String(entries.length)} /><Info label="Official source" value={race?.startTimestamp ? "serverTimestamp" : "En attente GO"} /></div></section>;
}

function ShareLivePanel({ competitionId, publicUrl, code }: { competitionId: string; publicUrl: string; code: string }) {
  return (
    <div className="space-y-4">
      <section className="race-card rounded-2xl p-5">
        <PanelTitle icon={Radio} title="SHARE LIVE" subtitle="Public broadcast control" />
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <Info label="Live" value="LIVE ACTIF" live />
            <Info label="Public Code" value={code.toUpperCase()} />
            <Info label="Public Link" value={publicUrl} />
            <div className="flex flex-wrap gap-2"><button onClick={() => navigator.clipboard?.writeText(publicUrl)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-race-primary px-4 text-sm font-bold"><Copy className="size-4" />COPIER LE LIEN</button><Link href={`/live/${code}`} className="inline-flex h-11 items-center rounded-lg border border-white/10 px-4 text-sm font-bold">OUVRIR LE LIVE</Link><Link href={`/competitions/${competitionId}/race-control`} className="inline-flex h-11 items-center rounded-lg border border-white/10 px-4 text-sm font-bold">RACE CONTROL</Link></div>
          </div>
          <Image src={qrCodeUrl(publicUrl)} alt="QR Code live public" width={240} height={240} unoptimized className="rounded-xl bg-white p-3" />
        </div>
      </section>
    </div>
  );
}

function BeachSprintControl({ competitionId, race, entries, userId }: { competitionId: string; race: Race | null; entries: RaceEntry[]; userId: string }) {
  const pair = entries.slice(0, 2);
  return <div className="space-y-4"><RaceHeader competitionName="BEACH ROWING SPRINT" location="Sprint control" race={race} chrono={useRaceChronometer(race).formatted} /><CameraPlayer title="BEACH LIVE CAMERA" /><section className="grid gap-4 lg:grid-cols-2">{pair.map((entry, index) => <div key={entry.id} className="race-card rounded-2xl p-5"><p className="text-xs font-bold uppercase text-race-muted">Athlete {index === 0 ? "A" : "B"}</p><h2 className="mt-2 text-2xl font-bold">{entry.athleteName}</h2><p className="text-race-muted">{entry.clubName}</p><button type="button" disabled={!race?.id || entry.id.startsWith("demo-")} onClick={() => race?.id && registerFinish(competitionId, race.id, entry.id, userId)} className="mt-5 h-16 w-full rounded-xl bg-race-primary font-black">FINISH</button></div>)}</section><StarterPanel competitionId={competitionId} race={race} entries={pair} userId={userId} /></div>;
}

function FinishDetectionPanel() {
  return <div className="mt-4 rounded-xl border border-race-warning/20 bg-race-warning/10 p-3 text-xs"><p className="font-bold text-race-warning">AI FINISH DETECTION - EXPERIMENTAL</p><p className="mt-1 text-race-muted">Aucune detection automatique ne sera creee en V1. Les suggestions futures devront etre confirmees ou rejetees par un officiel.</p></div>;
}

function isOfflineTimingError(error: unknown) {
  if (typeof navigator !== "undefined" && !navigator.onLine) return true;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return ["network", "offline", "unavailable", "deadline", "timeout", "failed to fetch"].some((needle) => message.includes(needle));
}

function DiagnosticPanel({ errors }: { errors: string[] }) {
  return <section className="rounded-2xl border border-race-warning/25 bg-race-warning/10 p-4 text-sm text-race-warning"><AlertTriangle className="mr-2 inline size-4" />Diagnostic / System: {errors.join(" | ")}</section>;
}

function MobileFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-race-background p-4 text-race-text"><p className="text-xs font-bold uppercase tracking-[.2em] text-race-primary">RowMotion Race</p><h1 className="mt-1 text-xl font-black">{title}</h1><div className="mt-4">{children}</div></main>;
}

function LaneMini({ entry }: { entry: RaceEntry }) {
  return <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm"><span className="flex items-center gap-3"><EntryAvatar entry={entry} /><span><Check className="mr-2 inline size-4 text-race-success" />LANE {entry.lane}<span className="block text-xs text-race-muted">{entry.athleteName}{entry.athleteScore != null ? ` - Score ${entry.athleteScore}` : ""}</span></span></span><span className="text-race-muted">Boat #{entry.boatNumber}</span></div>;
}

function EntryAvatar({ entry }: { entry: RaceEntry }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-race-elevated">
      {entry.athletePhotoURL ? <span aria-label={`Photo ${entry.athleteName}`} className="size-full bg-cover bg-center" style={{ backgroundImage: `url("${entry.athletePhotoURL}")` }} /> : <Users className="size-4 text-race-muted" />}
    </span>
  );
}

function PanelTitle({ icon: Icon, title, subtitle }: { icon: typeof Timer; title: string; subtitle: string }) {
  return <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-race-primary/15 text-race-primary"><Icon className="size-5" /></div><div><h2 className="text-sm font-black uppercase tracking-[.14em]">{title}</h2><p className="text-xs text-race-muted">{subtitle}</p></div></div>;
}

function Info({ label, value, live = false }: { label: string; value: string; live?: boolean }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-[10px] font-bold uppercase text-race-muted">{label}</p><p className={cn("mt-1 text-sm font-semibold", live && "text-race-success")}>{live ? "● " : ""}{value}</p></div>;
}
