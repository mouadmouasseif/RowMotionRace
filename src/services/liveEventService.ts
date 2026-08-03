"use client";

import { addDoc, limit, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import type { LiveEvent, LiveEventType } from "@/types/live-race";
import { liveEventsCollection } from "./livePaths";

export function subscribeLiveEvents(
  competitionId: string,
  raceId: string,
  onChange: (events: LiveEvent[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(liveEventsCollection(competitionId), where("raceId", "==", raceId), orderBy("timestamp", "desc"), limit(40)),
    (snapshot) => onChange(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as LiveEvent).reverse()),
    onError
  );
}

export function createLiveEvent(
  competitionId: string,
  event: Omit<LiveEvent, "id" | "timestamp"> & { type: LiveEventType }
) {
  return addDoc(liveEventsCollection(competitionId), { ...event, timestamp: serverTimestamp() });
}
