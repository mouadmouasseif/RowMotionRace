"use client";

import type { RaceEntry } from "@/types/live-race";

export function LiveRaceEntries({ entries }: { entries: RaceEntry[] }) {
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Live Athletes / Boats</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="text-race-muted"><tr><th className="py-2">Lane</th><th>Athlete</th><th>Boat</th><th>Club</th><th>Category</th><th>Status</th></tr></thead>
          <tbody className="divide-y divide-white/[0.06]">
            {entries.length === 0 ? <tr><td colSpan={6} className="py-4 text-race-muted">Entries not configured</td></tr> : entries.map((entry) => (
              <tr key={entry.id}><td className="py-3 font-mono text-race-primary">{entry.lane}</td><td>{entry.athleteName || "Not available"}</td><td>{entry.boatNumber || "Not available"}</td><td>{entry.clubName || "Not available"}</td><td>{entry.category || "Not available"}</td><td>{entry.status || "Waiting"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
