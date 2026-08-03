"use client";

import { useEffect, useState } from "react";
import type { Race } from "@/types/live-race";
import { subscribeRace, subscribeRaces } from "@/services/raceService";

export function useLiveRace(competitionId: string, raceId?: string) {
  const [race, setRace] = useState<Race | null>(null);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) return;
    return subscribeRaces(
      competitionId,
      (nextRaces) => {
        setRaces(nextRaces);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [competitionId]);

  useEffect(() => {
    if (!competitionId || !raceId) {
      setRace(null);
      return;
    }
    return subscribeRace(competitionId, raceId, setRace, (err) => setError(err.message));
  }, [competitionId, raceId]);

  return { race, races, loading, error };
}
