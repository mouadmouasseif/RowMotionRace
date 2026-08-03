"use client";

import type { Race, RaceCheckpoint, RaceEntry, RaceSplit } from "@/types/live-race";

export function LiveCourseProgress({ race, entries, checkpoints, splits }: { race: Race | null; entries: RaceEntry[]; checkpoints: RaceCheckpoint[]; splits: RaceSplit[] }) {
  const distance = race?.distanceMeters ?? race?.distance;
  if (!distance || checkpoints.length < 2 || splits.length === 0) {
    return <section className="race-card rounded-lg p-4"><h2 className="text-sm font-semibold">Live Course Progress</h2><p className="mt-4 text-xs text-race-muted">Live position unavailable</p></section>;
  }
  const latestByBoat = new Map<string, RaceSplit>();
  splits.forEach((split) => {
    const previous = latestByBoat.get(split.boatId);
    if (!previous || split.splitTimeMs > previous.splitTimeMs) latestByBoat.set(split.boatId, split);
  });
  const checkpointById = new Map(checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));

  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Live Course Progress</h2>
      <div className="mt-4 flex justify-between text-[10px] text-race-muted">{checkpoints.map((checkpoint) => <span key={checkpoint.id}>{checkpoint.name}<br />{checkpoint.distanceMeters}m</span>)}</div>
      <div className="mt-3 h-px bg-white/15" />
      <div className="mt-4 space-y-3">
        {entries.map((entry) => {
          const split = latestByBoat.get(entry.boatId);
          const checkpoint = split ? checkpointById.get(split.checkpointId) : undefined;
          const left = checkpoint ? Math.min(100, Math.max(0, (checkpoint.distanceMeters / distance) * 100)) : 0;
          return <div key={entry.id} className="grid grid-cols-[120px_1fr] items-center gap-3 text-xs"><span className="truncate">Boat {entry.boatNumber}</span><div className="relative h-4 rounded-full bg-white/[0.06]"><span className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-race-primary" style={{ left: `${left}%` }} /></div></div>;
        })}
      </div>
    </section>
  );
}
