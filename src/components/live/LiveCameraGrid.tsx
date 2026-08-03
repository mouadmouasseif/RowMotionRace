"use client";

import { Video, VideoOff } from "lucide-react";
import type { RaceCamera } from "@/types/live-race";

export function LiveCameraGrid({ cameras }: { cameras: RaceCamera[] }) {
  const visible = cameras.filter((camera) => camera.enabled);
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Live Cameras</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {visible.length === 0 ? <CameraPlaceholder label="Cameras not configured" /> : visible.map((camera) => (
          <div key={camera.id} className="min-h-40 rounded-lg border border-white/[0.08] bg-black/40 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">{camera.name || "Camera not configured"}</span>
              <span className={camera.status === "ONLINE" ? "text-race-success" : "text-race-muted"}>{camera.status || "OFFLINE"}</span>
            </div>
            <div className="mt-3 grid min-h-28 place-items-center rounded-md bg-race-background">
              {camera.streamUrl ? <video src={camera.streamUrl} className="h-full max-h-44 w-full rounded-md object-cover" muted playsInline controls /> : <div className="text-center text-race-muted"><VideoOff className="mx-auto size-7" /><p className="mt-2 text-xs">Stream offline</p></div>}
            </div>
            <p className="mt-2 text-[10px] uppercase text-race-muted">{camera.type} • {camera.location || "Location not configured"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CameraPlaceholder({ label }: { label: string }) {
  return <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] text-center text-race-muted"><div><Video className="mx-auto size-7" /><p className="mt-2 text-sm">{label}</p></div></div>;
}
