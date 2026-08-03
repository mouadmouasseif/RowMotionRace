"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/authentication/auth-provider";
import { createRegistration, updateRegistrationStatus } from "@/services/federationService";
import { getExistingAthletes } from "@/integrations/rowmotion-ai/rowmotion-athletes.adapter";
import type { RowMotionAthlete } from "@/types/rowmotion-ai";
import type { CompetitionEvent, CompetitionRegistration } from "@/types/federation";

export function RegistrationPanel({ competitionId, events, registrations }: { competitionId: string; events: CompetitionEvent[]; registrations: CompetitionRegistration[] }) {
  const { user, profile } = useAuth();
  const [athletes, setAthletes] = useState<RowMotionAthlete[]>([]);
  const [search, setSearch] = useState("");
  const [athleteId, setAthleteId] = useState("");
  const [eventIds, setEventIds] = useState<string[]>([]);
  useEffect(() => {
    getExistingAthletes(300).then(setAthletes).catch(() => setAthletes([]));
  }, []);
  const filtered = athletes.filter((athlete) => [athlete.displayName, athlete.licenseNumber].filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())).slice(0, 20);
  const selected = athletes.find((athlete) => athlete.id === athleteId);

  async function submit() {
    if (!selected || eventIds.length === 0) return;
    await createRegistration(competitionId, { athleteId: selected.id, athleteName: selected.displayName, clubId: selected.clubId ?? "", events: eventIds, status: "SUBMITTED" }, user?.uid ?? "anonymous", profile?.role ?? "ADMIN");
    setAthleteId("");
    setEventIds([]);
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
      <div className="race-card rounded-lg p-4">
        <h3 className="text-sm font-semibold">Competition Registration</h3>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search athlete..." className="mt-4 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-xs" />
        <select value={athleteId} onChange={(event) => setAthleteId(event.target.value)} className="mt-3 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-xs"><option value="">Select athlete</option>{filtered.map((athlete) => <option key={athlete.id} value={athlete.id}>{athlete.displayName} • {athlete.licenseNumber ?? "Licence not available"}</option>)}</select>
        <div className="mt-4 space-y-2">{events.length === 0 ? <p className="text-xs text-race-muted">Events not configured</p> : events.map((event) => <label key={event.id} className="flex items-center gap-2 rounded-md border border-white/[0.07] p-2 text-xs"><input type="checkbox" checked={eventIds.includes(event.id)} onChange={(input) => setEventIds((current) => input.target.checked ? [...current, event.id] : current.filter((id) => id !== event.id))} />{event.name} • {event.boatClass} • {event.distanceMeters}m</label>)}</div>
        <button type="button" disabled={!selected || eventIds.length === 0} onClick={submit} className="mt-4 h-11 w-full rounded-md bg-race-primary text-xs font-bold text-white disabled:opacity-40">ADD</button>
      </div>
      <section className="race-card rounded-lg p-4">
        <h3 className="text-sm font-semibold">Registrations</h3>
        <div className="mt-3 divide-y divide-white/[0.06]">{registrations.length === 0 ? <p className="py-3 text-xs text-race-muted">No registrations yet</p> : registrations.map((registration) => <div key={registration.id} className="grid gap-2 py-3 text-xs sm:grid-cols-[1fr_120px_auto]"><span>{registration.athleteName || registration.athleteId}</span><span>{registration.status}</span><div className="flex gap-2"><button onClick={() => updateRegistrationStatus(competitionId, registration.id, "CONFIRMED", user?.uid ?? "anonymous", profile?.role ?? "ADMIN")} className="rounded-md bg-race-success px-2 py-1 text-white">Accept</button><button onClick={() => updateRegistrationStatus(competitionId, registration.id, "REJECTED", user?.uid ?? "anonymous", profile?.role ?? "ADMIN")} className="rounded-md bg-race-danger px-2 py-1 text-white">Reject</button></div></div>)}</div>
      </section>
    </section>
  );
}
