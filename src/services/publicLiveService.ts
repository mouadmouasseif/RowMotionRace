"use client";

export function publicLiveUrl(competitionCodeOrRaceId: string) {
  const base = typeof window === "undefined" ? "" : window.location.origin;
  return `${base}/live/public/${encodeURIComponent(competitionCodeOrRaceId)}`;
}

export function qrCodeUrl(targetUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(targetUrl)}`;
}
