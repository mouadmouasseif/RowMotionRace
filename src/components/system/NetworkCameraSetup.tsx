"use client";

import { useState } from "react";
import { Camera, Check, PlugZap, Save, Wifi } from "lucide-react";
import type { CameraConnectionMode, CameraType, RaceCamera } from "@/types/live-race";
import { createTwoCameraNetworkPreset, updateCamera, upsertCamera } from "@/services/cameraService";
import { useLiveCameras } from "@/hooks/useLiveCameras";

const modes: CameraConnectionMode[] = ["HLS", "WEBRTC", "MJPEG", "RTSP", "HDMI_CAPTURE", "OBS_BROWSER"];
const cameraTypes: CameraType[] = ["START", "FINISH", "COURSE", "JURY", "OTHER"];

const emptyCamera = {
  name: "Camera Start",
  type: "START" as CameraType,
  location: "Start line",
  streamUrl: "http://192.168.10.21:8080/hls/start.m3u8",
  ipAddress: "192.168.10.21",
  port: 554,
  username: "",
  connectionMode: "HLS" as CameraConnectionMode,
  obsSceneName: "CAMERA START",
  enabled: true,
  status: "OFFLINE" as const,
  notes: ""
};

export function NetworkCameraSetup({ competitionId }: { competitionId: string }) {
  const { cameras } = useLiveCameras(competitionId);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<Omit<RaceCamera, "id" | "connectedAt">>(emptyCamera);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function selectCamera(camera: RaceCamera) {
    setSelectedId(camera.id);
    setForm({
      name: camera.name,
      type: camera.type,
      location: camera.location ?? "",
      streamUrl: camera.streamUrl ?? "",
      ipAddress: camera.ipAddress ?? "",
      port: camera.port ?? 554,
      username: camera.username ?? "",
      connectionMode: camera.connectionMode ?? "HLS",
      obsSceneName: camera.obsSceneName ?? "",
      enabled: camera.enabled,
      status: camera.status,
      notes: camera.notes ?? ""
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      if (selectedId) await updateCamera(competitionId, selectedId, form);
      else await upsertCamera(competitionId, form);
      setMessage("Camera saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Camera save failed");
    } finally {
      setSaving(false);
    }
  }

  async function preset() {
    setSaving(true);
    setMessage("");
    try {
      await createTwoCameraNetworkPreset(competitionId);
      setMessage("Two-camera network preset created");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Preset failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="race-card rounded-2xl p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-race-primary/15 text-race-primary"><Wifi className="size-5" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-race-primary">Local network video</p>
              <h1 className="text-2xl font-black">2 Network Cameras</h1>
              <p className="mt-1 text-sm text-race-muted">Camera Start + Camera Finish over LAN. Video stays separate from official timing.</p>
            </div>
          </div>
          <button type="button" onClick={preset} disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-race-primary px-4 text-sm font-black disabled:opacity-50">
            <PlugZap className="size-4" /> Create 2-camera preset
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <aside className="race-card rounded-2xl p-4">
          <h2 className="text-sm font-black uppercase tracking-[.14em]">Configured cameras</h2>
          <div className="mt-4 space-y-2">
            {cameras.length === 0 ? <p className="text-sm text-race-muted">No camera configured yet.</p> : cameras.map((camera) => (
              <button key={camera.id} type="button" onClick={() => selectCamera(camera)} className="flex min-h-16 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 text-left">
                <span><strong>{camera.name}</strong><span className="block text-xs text-race-muted">{camera.ipAddress ?? "-"} • {camera.connectionMode ?? "HLS"}</span></span>
                <span className={camera.status === "ONLINE" ? "text-race-success" : "text-race-muted"}>{camera.status}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="race-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black">{selectedId ? "Edit camera" : "Add camera"}</h2>
            {selectedId && <button type="button" onClick={() => { setSelectedId(""); setForm(emptyCamera); }} className="h-10 rounded-lg border border-white/10 px-3 text-xs font-bold text-race-muted">NEW</button>}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <label className="text-xs font-bold uppercase text-race-muted">Role<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CameraType })} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-race-elevated px-3 text-race-text">{cameraTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
            <Field label="IP address" value={form.ipAddress ?? ""} onChange={(value) => setForm({ ...form, ipAddress: value })} />
            <Field label="Port" value={String(form.port ?? "")} onChange={(value) => setForm({ ...form, port: Number(value) || undefined })} />
            <label className="text-xs font-bold uppercase text-race-muted">Connection<select value={form.connectionMode ?? "HLS"} onChange={(event) => setForm({ ...form, connectionMode: event.target.value as CameraConnectionMode })} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-race-elevated px-3 text-race-text">{modes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}</select></label>
            <Field label="OBS scene" value={form.obsSceneName ?? ""} onChange={(value) => setForm({ ...form, obsSceneName: value })} />
            <div className="md:col-span-2"><Field label="Preview / stream URL" value={form.streamUrl ?? ""} onChange={(value) => setForm({ ...form, streamUrl: value })} /></div>
            <Field label="Location" value={form.location ?? ""} onChange={(value) => setForm({ ...form, location: value })} />
            <label className="text-xs font-bold uppercase text-race-muted">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "ONLINE" | "OFFLINE" })} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-race-elevated px-3 text-race-text"><option value="OFFLINE">OFFLINE</option><option value="ONLINE">ONLINE</option></select></label>
          </div>

          <div className="mt-5 rounded-xl border border-race-warning/25 bg-race-warning/10 p-4 text-sm text-race-warning">
            RTSP is good for OBS/VLC, but browsers usually need HLS, WebRTC, or MJPEG for preview. Keep official timing on RowMotion buttons, not camera video.
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-race-success px-5 text-sm font-black text-[#02120a] disabled:opacity-50"><Save className="size-4" />SAVE CAMERA</button>
            {message && <span className="inline-flex items-center gap-2 text-sm text-race-muted"><Check className="size-4 text-race-success" />{message}</span>}
          </div>
        </section>
      </section>

      <section className="race-card rounded-2xl p-5">
        <h2 className="font-black">Recommended local wiring</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Step title="1. Router / switch" text="Use 192.168.10.1 and keep cameras wired when possible." />
          <Step title="2. Camera Start" text="Set fixed IP 192.168.10.21 and name it CAMERA START in OBS." />
          <Step title="3. Camera Finish" text="Set fixed IP 192.168.10.22 and name it CAMERA FINISH in OBS." />
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-xs font-bold uppercase text-race-muted">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-race-elevated px-3 text-race-text" /></label>;
}

function Step({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><Camera className="size-5 text-race-primary" /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-1 text-sm text-race-muted">{text}</p></div>;
}
