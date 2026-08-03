"use client";

import type { LiveEvent } from "@/types/live-race";

export function LiveEventTimeline({ events }: { events: LiveEvent[] }) {
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Live Events</h2>
      <ol className="mt-4 space-y-3">
        {events.length === 0 ? <li className="text-xs text-race-muted">Timeline waiting</li> : events.map((event) => (
          <li key={event.id} className="grid grid-cols-[76px_1fr] gap-3 text-xs">
            <time className="font-mono text-race-muted">{event.timestamp?.toDate ? event.timestamp.toDate().toLocaleTimeString("fr-FR") : "Waiting"}</time>
            <div><p className="font-semibold">{event.type.replaceAll("_", " ")}</p><p className="text-race-muted">{event.boatId ? `Boat ${event.boatId}` : event.athleteId ? `Athlete ${event.athleteId}` : "Race event"}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
