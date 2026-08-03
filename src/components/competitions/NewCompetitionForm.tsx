"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/authentication/auth-provider";
import { createCompetition } from "@/services/federationService";
import type { CompetitionStatus, CompetitionType } from "@/types/federation";

const competitionTypes: CompetitionType[] = ["REGATTA", "CHAMPIONSHIP", "CUP", "NATIONAL_CHAMPIONSHIP", "REGIONAL_CHAMPIONSHIP", "CLUB_EVENT", "QUALIFICATION", "TIME_TRIAL", "BEACH_SPRINT", "INDOOR", "HEAD_RACE", "CUSTOM"];
const statuses: CompetitionStatus[] = ["DRAFT", "REGISTRATION_OPEN", "REGISTRATION_CLOSED", "LIVE", "COMPLETED", "CANCELLED"];

export function NewCompetitionForm() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organizer: "",
    federationName: "",
    organizingClubName: "",
    location: "",
    type: "REGATTA" as CompetitionType,
    format: "",
    status: "DRAFT" as CompetitionStatus,
    startsAt: "",
    endsAt: "",
    registrationOpensAt: "",
    registrationClosesAt: "",
    maxAthletes: "",
    maxClubs: "",
    competitionCode: "",
    publicLiveEnabled: true,
    publicResultsEnabled: true,
    logoUrl: "",
    coverImageUrl: ""
  });

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const id = await createCompetition({
      ...form,
      startsAt: form.startsAt ? new Date(form.startsAt) as unknown as never : undefined,
      endsAt: form.endsAt ? new Date(form.endsAt) as unknown as never : undefined,
      registrationOpensAt: form.registrationOpensAt ? new Date(form.registrationOpensAt) as unknown as never : undefined,
      registrationClosesAt: form.registrationClosesAt ? new Date(form.registrationClosesAt) as unknown as never : undefined,
      maxAthletes: form.maxAthletes ? Number(form.maxAthletes) : undefined,
      maxClubs: form.maxClubs ? Number(form.maxClubs) : undefined,
      competitionCode: form.competitionCode.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    }, user?.uid ?? "anonymous", profile?.role ?? "ADMIN");
    router.push(`/competitions/${id}`);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl space-y-4">
      <header><p className="text-xs font-bold uppercase text-race-primary">Competition Management</p><h2 className="mt-2 text-2xl font-semibold">Ajouter competition</h2></header>
      <section className="race-card grid gap-3 rounded-lg p-4 md:grid-cols-2">
        <Field label="Nom competition" value={form.name} onChange={(value) => setField("name", value)} required />
        <Field label="Organisateur" value={form.organizer} onChange={(value) => setField("organizer", value)} />
        <Field label="Federation" value={form.federationName} onChange={(value) => setField("federationName", value)} />
        <Field label="Club organisateur" value={form.organizingClubName} onChange={(value) => setField("organizingClubName", value)} />
        <Field label="Lieu" value={form.location} onChange={(value) => setField("location", value)} />
        <Field label="Format" value={form.format} onChange={(value) => setField("format", value)} />
        <Select label="Type competition" value={form.type} values={competitionTypes} onChange={(value) => setField("type", value as CompetitionType)} />
        <Select label="Statut" value={form.status} values={statuses} onChange={(value) => setField("status", value as CompetitionStatus)} />
        <Field label="Date debut" type="datetime-local" value={form.startsAt} onChange={(value) => setField("startsAt", value)} />
        <Field label="Date fin" type="datetime-local" value={form.endsAt} onChange={(value) => setField("endsAt", value)} />
        <Field label="Inscriptions ouverture" type="datetime-local" value={form.registrationOpensAt} onChange={(value) => setField("registrationOpensAt", value)} />
        <Field label="Inscriptions fermeture" type="datetime-local" value={form.registrationClosesAt} onChange={(value) => setField("registrationClosesAt", value)} />
        <Field label="Nombre maximum d'athletes" type="number" value={form.maxAthletes} onChange={(value) => setField("maxAthletes", value)} />
        <Field label="Nombre maximum de clubs" type="number" value={form.maxClubs} onChange={(value) => setField("maxClubs", value)} />
        <Field label="Logo URL" value={form.logoUrl} onChange={(value) => setField("logoUrl", value)} />
        <Field label="Image couverture URL" value={form.coverImageUrl} onChange={(value) => setField("coverImageUrl", value)} />
        <Field label="Code competition" value={form.competitionCode} onChange={(value) => setField("competitionCode", value)} />
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.publicLiveEnabled} onChange={(event) => setField("publicLiveEnabled", event.target.checked)} />Live public active</label>
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.publicResultsEnabled} onChange={(event) => setField("publicResultsEnabled", event.target.checked)} />Resultats publics</label>
      </section>
      <button type="submit" disabled={saving || !form.name.trim()} className="h-11 rounded-md bg-race-primary px-5 text-xs font-bold text-white disabled:opacity-40">{saving ? "Saving" : "Create Competition"}</button>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="text-xs text-race-muted">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text" /></label>;
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label className="text-xs text-race-muted">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-white/10 bg-race-background px-3 text-race-text">{values.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label>;
}
