"use client";

import { useEffect, useState } from "react";
import type { Race } from "@/types/live-race";

export function formatRaceTime(ms: number) {
  const safe = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);
  const millis = safe % 1000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

export function useRaceChronometer(race: Race | null) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startMs = race?.startTimestamp?.toMillis() ?? race?.startedAt?.toMillis();
    if (!startMs) {
      setElapsedMs(0);
      return;
    }

    const update = () => setElapsedMs(Date.now() - startMs);
    update();
    if (race?.status !== "RACING" && race?.status !== "FINISHING") return;
    const interval = window.setInterval(update, 16);
    return () => window.clearInterval(interval);
  }, [race?.startTimestamp, race?.startedAt, race?.status]);

  return { elapsedMs, formatted: formatRaceTime(elapsedMs), hasOfficialStart: Boolean(race?.startTimestamp || race?.startedAt) };
}
