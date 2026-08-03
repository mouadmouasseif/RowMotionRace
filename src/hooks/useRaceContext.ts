"use client";

import { useEffect, useState } from "react";
import type { RaceContext } from "@/types/live-race";

const storageKey = "rowmotion-race.currentRaceContext";

export function useRaceContext() {
  const [context, setContextState] = useState<RaceContext | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) setContextState(JSON.parse(raw) as RaceContext);
  }, []);

  function setContext(nextContext: RaceContext) {
    setContextState(nextContext);
    window.localStorage.setItem(storageKey, JSON.stringify(nextContext));
  }

  return { context, setContext };
}
