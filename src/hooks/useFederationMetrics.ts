"use client";

import { useEffect, useState } from "react";
import type { FederationMetrics } from "@/types/federation";
import { findLiveRace, loadFederationMetrics } from "@/services/federationService";
import type { Competition } from "@/types/federation";
import type { Race } from "@/types/live-race";

const emptyMetrics: FederationMetrics = {
  activeCompetitions: 0,
  upcomingCompetitions: 0,
  racesToday: 0,
  liveRaces: 0,
  registeredAthletes: 0,
  participatingClubs: 0,
  activeJudges: 0,
  assignedBoats: 0,
  pendingResults: 0,
  openPenalties: 0
};

export function useFederationMetrics() {
  const [metrics, setMetrics] = useState<FederationMetrics>(emptyMetrics);
  const [liveRace, setLiveRace] = useState<{ competition: Competition; race: Race } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([loadFederationMetrics(), findLiveRace()])
      .then(([nextMetrics, nextLiveRace]) => {
        if (!active) return;
        setMetrics(nextMetrics);
        setLiveRace(nextLiveRace);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Firebase unavailable");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { metrics, liveRace, loading, error };
}
