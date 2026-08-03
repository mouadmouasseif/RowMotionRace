"use client";

import { addDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import type { RaceCamera } from "@/types/live-race";
import { camerasCollection } from "./livePaths";

export function subscribeCameras(competitionId: string, onChange: (cameras: RaceCamera[]) => void, onError?: (error: Error) => void) {
  return onSnapshot(
    query(camerasCollection(competitionId), orderBy("name", "asc")),
    (snapshot) => onChange(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RaceCamera)),
    onError
  );
}

export function upsertCamera(competitionId: string, camera: Omit<RaceCamera, "id" | "connectedAt">) {
  return addDoc(camerasCollection(competitionId), { ...camera, connectedAt: serverTimestamp() });
}

export function setCameraEnabled(competitionId: string, cameraId: string, enabled: boolean) {
  return updateDoc(doc(camerasCollection(competitionId), cameraId), { enabled });
}
