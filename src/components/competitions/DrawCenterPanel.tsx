"use client";

import { useState } from "react";
import { useAuth } from "@/features/authentication/auth-provider";
import { createDraftHeatDraw, detectDrawConflicts, generateHeatDraw } from "@/services/heatDrawService";
import type { CompetitionEvent, CompetitionRegistration, HeatDrawEntry } from "@/types/federation";

export function DrawCenterPanel({ competitionId, events, registrations }: { competitionId: string; events: CompetitionEvent[]; registrations: CompetitionRegistration[] }) {
  const { user, profile } = useAuth();
  const [eventId, setEventId] = useState("");
  const [maxEntriesPerHeat, setMaxEntriesPerHeat] = useState(6);
  const [draft, setDraft] = useState<HeatDrawEntry[]>([]);
  const event = events.find((item) => item.id === eventId);
  const eventRegistrations = registrations.filter((registration) => !eventId || registration.events.includes(eventId));
  const conflicts = detectDrawConflicts(draft, maxEntriesPerHeat);

  function generate() {
    const result = generateHeatDraw({ registrations: eventRegistrations, maxEntriesPerHeat, category: event?.categoryName, gender: event?.gender, boatClass: event?.boatClass });
    setDraft(result.entries);
  }

  async function confirm() {
    if (!eventId || draft.length === 0 || conflicts.length > 0) return;
    await createDraftHeatDraw(competitionId, eventId, draft, user?.uid ?? "anonymous", profile?.role ?? "ADMIN");
  }

  return (
    <section className="race-card rounded-lg p-4">
      <h3 className="text-sm font-semibold">DRAW CENTER</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="text-xs text-race-muted sm:col-span-2">Race / Event<select value={eventId} onChange={(event) => setEventId(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text"><option value="">Select event</option>{events.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-xs text-race-muted">Athletes<input readOnly value={eventRegistrations.length} className="mt-1 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text" /></label>
        <label className="text-xs text-race-muted">Boats per heat<input type="number" value={maxEntriesPerHeat} onChange={(event) => setMaxEntriesPerHeat(Number(event.target.value))} className="mt-1 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text" /></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={generate} disabled={!eventId || eventRegistrations.length === 0} className="h-11 rounded-md bg-race-warning px-4 text-xs font-black text-black disabled:opacity-40">GENERATE DRAW</button><button onClick={confirm} disabled={draft.length === 0 || conflicts.length > 0} className="h-11 rounded-md bg-race-success px-4 text-xs font-bold text-white disabled:opacity-40">CONFIRM</button></div>
      {conflicts.length > 0 && <div className="mt-4 rounded-md border border-race-warning/30 bg-race-warning/10 p-3 text-xs text-race-warning">{conflicts.map((conflict) => <p key={conflict}>Warning: {conflict}</p>)}</div>}
      <div className="mt-4 grid gap-3 lg:grid-cols-3">{draft.length === 0 ? <p className="text-xs text-race-muted">Generate a draft before writing Firebase.</p> : Array.from(new Set(draft.map((entry) => entry.heatNumber))).map((heat) => <div key={heat} className="rounded-lg border border-white/[0.07] p-3"><h4 className="text-xs font-bold">HEAT {heat}</h4><div className="mt-2 space-y-2">{draft.filter((entry) => entry.heatNumber === heat).map((entry) => <div key={entry.registrationId} className="grid grid-cols-[56px_1fr] gap-2 rounded-md bg-white/[0.03] p-2 text-xs"><span>Lane {entry.lane}</span><span>{entry.athleteName || entry.athleteId}</span></div>)}</div></div>)}</div>
    </section>
  );
}
