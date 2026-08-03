"use client";

import { useEffect, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import type { RaceEntry } from "@/types/live-race";
import { raceEntriesCollection } from "@/services/livePaths";

export function useRaceEntries(competitionId: string, raceId?: string) {
  const [entries, setEntries] = useState<RaceEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId || !raceId) {
      setEntries([]);
      return;
    }
    return onSnapshot(
      query(raceEntriesCollection(competitionId, raceId), orderBy("lane", "asc")),
      (snapshot) => setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RaceEntry)),
      (err) => setError(err.message)
    );
  }, [competitionId, raceId]);

  return { entries, error };
}
