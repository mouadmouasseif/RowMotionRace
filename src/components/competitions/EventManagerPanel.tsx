"use client";

import { useState } from "react";
import { useAuth } from "@/features/authentication/auth-provider";
import { createCompetitionEvent } from "@/services/federationService";
import type { CompetitionEvent, StartMethod } from "@/types/federation";

const startMethods: StartMethod[] = ["MASS_START", "LANE_START", "TIME_TRIAL", "INDIVIDUAL_START", "BEACH_START", "CUSTOM"];

export function EventManagerPanel({ competitionId, events }: { competitionId: string; events: CompetitionEvent[] }) {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: "", categoryName: "", gender: "MEN", boatClass: "1x", raceType: "HEAT", distanceMeters: 2000, startMethod: "LANE_START" as StartMethod, maxEntries: 0, numberOfHeats: 1, qualificationRules: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await createCompetitionEvent(competitionId, { ...form, status: "REGISTRATION" }, user?.uid ?? "anonymous", profile?.role ?? "ADMIN");
    setForm((current) => ({ ...current, name: "", categoryName: "" }));
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="race-card rounded-lg p-4">
        <h3 className="text-sm font-semibold">+ Add Race / Event</h3>
        <div className="mt-4 grid gap-3">
          <Input label="Race Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Input label="Category" value={form.categoryName} onChange={(value) => setForm({ ...form, categoryName: value })} />
          <Input label="Gender" value={form.gender} onChange={(value) => setForm({ ...form, gender: value })} />
          <Input label="Boat Class" value={form.boatClass} onChange={(value) => setForm({ ...form, boatClass: value })} />
          <Input label="Race Type" value={form.raceType} onChange={(value) => setForm({ ...form, raceType: value })} />
          <Input label="Distance" type="number" value={String(form.distanceMeters)} onChange={(value) => setForm({ ...form, distanceMeters: Number(value) })} />
          <label className="text-xs text-race-muted">Start Method<select value={form.startMethod} onChange={(event) => setForm({ ...form, startMethod: event.target.value as StartMethod })} className="mt-1 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text">{startMethods.map((method) => <option key={method} value={method}>{method.replaceAll("_", " ")}</option>)}</select></label>
          <Input label="Number of Heats" type="number" value={String(form.numberOfHeats)} onChange={(value) => setForm({ ...form, numberOfHeats: Number(value) })} />
          <Input label="Qualification Rules" value={form.qualificationRules} onChange={(value) => setForm({ ...form, qualificationRules: value })} />
          <button type="submit" disabled={!form.name.trim()} className="h-11 rounded-md bg-race-primary text-xs font-bold text-white disabled:opacity-40">Create Event</button>
        </div>
      </form>
      <section className="race-card rounded-lg p-4">
        <h3 className="text-sm font-semibold">Events</h3>
        <div className="mt-3 divide-y divide-white/[0.06]">{events.length === 0 ? <p className="py-3 text-xs text-race-muted">No events configured</p> : events.map((event) => <div key={event.id} className="grid gap-2 py-3 text-xs sm:grid-cols-[1fr_120px_120px_120px]"><span>{event.name}</span><span>{event.boatClass}</span><span>{event.distanceMeters} m</span><span>{event.status}</span></div>)}</div>
      </section>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="text-xs text-race-muted">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text" /></label>;
}
