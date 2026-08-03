"use client";

import { useEffect, useState } from "react";
import type { Competition } from "@/types/federation";
import { subscribeCompetition, subscribeCompetitions } from "@/services/federationService";

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => subscribeCompetitions(setCompetitions, (err) => setError(err.message)), []);
  return { competitions, error };
}

export function useCompetition(competitionId: string) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!competitionId) return;
    return subscribeCompetition(competitionId, setCompetition, (err) => setError(err.message));
  }, [competitionId]);
  return { competition, error };
}
