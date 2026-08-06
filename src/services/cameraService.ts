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

export function updateCamera(competitionId: string, cameraId: string, camera: Partial<Omit<RaceCamera, "id" | "connectedAt">>) {
  return updateDoc(doc(camerasCollection(competitionId), cameraId), { ...camera, updatedAt: serverTimestamp() });
}

export function setCameraEnabled(competitionId: string, cameraId: string, enabled: boolean) {
  return updateDoc(doc(camerasCollection(competitionId), cameraId), { enabled });
}

export function createTwoCameraNetworkPreset(competitionId: string) {
  return Promise.all([
    upsertCamera(competitionId, {
      name: "Camera Start",
      type: "START",
      location: "Start line",
      streamUrl: "http://192.168.10.21:8080/hls/start.m3u8",
      ipAddress: "192.168.10.21",
      port: 554,
      connectionMode: "HLS",
      obsSceneName: "CAMERA START",
      enabled: true,
      status: "OFFLINE",
      notes: "Use HLS/WebRTC/MJPEG for browser preview. RTSP should be converted through OBS, VLC, or ffmpeg."
    }),
    upsertCamera(competitionId, {
      name: "Camera Finish",
      type: "FINISH",
      location: "Finish line",
      streamUrl: "http://192.168.10.22:8080/hls/finish.m3u8",
      ipAddress: "192.168.10.22",
      port: 554,
      connectionMode: "HLS",
      obsSceneName: "CAMERA FINISH",
      enabled: true,
      status: "OFFLINE",
      notes: "Dedicated finish camera. Timing remains official through TimingEngine and finish button."
    })
  ]);
}
