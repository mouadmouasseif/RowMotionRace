"use client";

import { useMemo, useState } from "react";
import type { PenaltyType, RaceEntry } from "@/types/live-race";
import { applyPenalty } from "@/services/penaltyService";

const penaltyTypes: PenaltyType[] = ["WARNING", "FALSE_START", "DISQUALIFIED", "DNS", "DNF", "DSQ", "TIME_PENALTY", "LANE_VIOLATION", "INTERFERENCE", "TECHNICAL_FAULT", "OTHER"];
const penaltyOptions = [0, 1000, 2000, 5000, 10000];

export function JuryPenaltyPanel({ competitionId, raceId, entries, userId, role }: { competitionId: string; raceId?: string; entries: RaceEntry[]; userId: string; role: string }) {
  const [entryId, setEntryId] = useState("");
  const [type, setType] = useState<PenaltyType>("TIME_PENALTY");
  const [penaltyMs, setPenaltyMs] = useState(5000);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const entry = useMemo(() => entries.find((item) => item.id === entryId), [entries, entryId]);

  async function submit() {
    if (!raceId || !entry || !reason.trim()) return;
    await applyPenalty(competitionId, {
      raceId,
      entryId: entry.id,
      athleteId: entry.athleteId,
      boatId: entry.boatId,
      lane: entry.lane,
      type,
      penaltyMs,
      reason: reason.trim(),
      comment: comment.trim(),
      createdBy: userId
    }, role);
    setReason("");
    setComment("");
  }

  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Jury Penalty</h2>
      <div className="mt-4 grid gap-3">
        <select value={entryId} onChange={(event) => setEntryId(event.target.value)} className="rounded-md border border-white/10 bg-race-background px-3 py-2 text-xs">
          <option value="">Athlete / boat: Not configured</option>
          {entries.map((entry) => <option key={entry.id} value={entry.id}>Lane {entry.lane} - {entry.athleteName} - Boat {entry.boatNumber}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value as PenaltyType)} className="rounded-md border border-white/10 bg-race-background px-3 py-2 text-xs">
          {penaltyTypes.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
        </select>
        <div className="grid grid-cols-5 gap-2">
          {penaltyOptions.map((option) => <button key={option} type="button" onClick={() => setPenaltyMs(option)} className={`h-10 rounded-md text-[10px] font-bold ${penaltyMs === option ? "bg-race-warning text-black" : "border border-white/10 bg-white/[0.04]"}`}>{option ? `+${option / 1000}s` : "Warn"}</button>)}
        </div>
        <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason" className="rounded-md border border-white/10 bg-race-background px-3 py-2 text-xs" />
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Commentaire" className="min-h-20 rounded-md border border-white/10 bg-race-background px-3 py-2 text-xs" />
        <button type="button" disabled={!raceId || !entry || !reason.trim()} onClick={submit} className="h-11 rounded-md bg-race-primary text-xs font-bold text-white disabled:opacity-40">VALIDATE</button>
      </div>
    </section>
  );
}
