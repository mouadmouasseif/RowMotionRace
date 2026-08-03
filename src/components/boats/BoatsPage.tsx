"use client";

import { useEffect, useState } from "react";
import type { Boat, BoatStatus } from "@/types/federation";
import { createBoat, subscribeBoats } from "@/services/boatService";

const statuses: BoatStatus[] = ["AVAILABLE", "ASSIGNED", "RACING", "MAINTENANCE"];

export function BoatsPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [form, setForm] = useState({ boatNumber: "", boatClass: "1x", clubName: "", status: "AVAILABLE" as BoatStatus });
  useEffect(() => subscribeBoats(setBoats), []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await createBoat(form);
    setForm({ boatNumber: "", boatClass: "1x", clubName: "", status: "AVAILABLE" });
  }
  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="race-card rounded-lg p-4">
        <h2 className="text-sm font-semibold">Boat Management</h2>
        <input value={form.boatNumber} onChange={(event) => setForm({ ...form, boatNumber: event.target.value })} placeholder="Boat number" className="mt-4 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-xs" />
        <input value={form.boatClass} onChange={(event) => setForm({ ...form, boatClass: event.target.value })} placeholder="Boat class" className="mt-3 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-xs" />
        <input value={form.clubName} onChange={(event) => setForm({ ...form, clubName: event.target.value })} placeholder="Club" className="mt-3 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-xs" />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BoatStatus })} className="mt-3 min-h-10 w-full rounded-md border border-white/10 bg-race-background px-3 text-xs">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
        <button disabled={!form.boatNumber.trim()} className="mt-4 h-10 w-full rounded-md bg-race-primary text-xs font-bold text-white disabled:opacity-40">Add Boat</button>
      </form>
      <section className="race-card rounded-lg p-4">
        <h2 className="text-sm font-semibold">Boats</h2>
        <div className="mt-3 divide-y divide-white/[0.06]">{boats.length === 0 ? <p className="py-3 text-xs text-race-muted">No boats configured</p> : boats.map((boat) => <div key={boat.id} className="grid grid-cols-[1fr_100px_120px] py-3 text-xs"><span>Boat {boat.boatNumber}</span><span>{boat.boatClass}</span><span>{boat.status}</span></div>)}</div>
      </section>
    </div>
  );
}
