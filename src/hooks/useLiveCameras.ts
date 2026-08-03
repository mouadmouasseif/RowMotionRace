"use client";

import { useEffect, useState } from "react";
import type { RaceCamera } from "@/types/live-race";
import { subscribeCameras } from "@/services/cameraService";

export function useLiveCameras(competitionId: string) {
  const [cameras, setCameras] = useState<RaceCamera[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) return;
    return subscribeCameras(competitionId, setCameras, (err) => setError(err.message));
  }, [competitionId]);

  return { cameras, error };
}
