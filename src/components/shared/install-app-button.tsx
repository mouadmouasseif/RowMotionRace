"use client";

import { useEffect, useState } from "react";
import { Download, MonitorDown, Share2, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type HelpMode = "ios" | "mac-safari" | "android" | "desktop" | "generic";

function isRunningStandalone() {
  const iosNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || iosNavigator.standalone === true;
}

function getHelpMode(): HelpMode {
  const userAgent = navigator.userAgent.toLowerCase();
  const ios =
    /iphone|ipad|ipod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = /safari/.test(userAgent) && !/chrome|crios|android|edg/.test(userAgent);
  const android = /android/.test(userAgent);
  const desktop = /windows|macintosh|linux|cros/.test(userAgent) && !android;

  if (ios) return "ios";
  if (safari) return "mac-safari";
  if (android) return "android";
  if (desktop) return "desktop";
  return "generic";
}

function getInstallHelp(mode: HelpMode) {
  switch (mode) {
    case "ios":
      return {
        icon: Share2,
        title: "Installer sur iPhone ou iPad",
        body: "Dans Safari, touchez Partager puis choisissez Ajouter a l'ecran d'accueil."
      };
    case "mac-safari":
      return {
        icon: MonitorDown,
        title: "Installer sur Mac",
        body: "Dans Safari, ouvrez le menu Fichier puis choisissez Ajouter au Dock."
      };
    case "android":
      return {
        icon: Smartphone,
        title: "Installer sur Android",
        body: "Dans Chrome ou Edge, ouvrez le menu du navigateur puis choisissez Installer l'application ou Ajouter a l'ecran d'accueil."
      };
    case "desktop":
      return {
        icon: MonitorDown,
        title: "Installer sur ordinateur",
        body: "Dans Chrome, Edge ou Brave, utilisez l'icone d'installation dans la barre d'adresse ou le menu du navigateur."
      };
    default:
      return {
        icon: Download,
        title: "Installer RowMotion Race",
        body: "Ouvrez le menu de votre navigateur puis choisissez Installer l'application ou Ajouter a l'ecran d'accueil."
      };
  }
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpMode, setHelpMode] = useState<HelpMode>("generic");

  useEffect(() => {
    if (isRunningStandalone()) return;

    setHelpMode(getHelpMode());
    setVisible(true);

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setShowHelp(false);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setShowHelp(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setVisible(false);
    setInstallPrompt(null);
  };

  if (!visible) return null;

  const help = getInstallHelp(helpMode);
  const HelpIcon = help.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => void install()}
        className="fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-race-primary/50 bg-[#071323]/95 px-4 py-3 text-xs font-bold text-white shadow-[0_10px_35px_rgba(0,119,255,.28)] backdrop-blur transition hover:border-race-primary hover:bg-[#0a1b31] focus:outline-none focus:ring-2 focus:ring-race-primary sm:bottom-5"
        aria-haspopup="dialog"
      >
        <Download className="size-4 text-race-primary" aria-hidden="true" />
        Installer l&apos;app
      </button>

      {showHelp ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-end bg-black/70 p-4 backdrop-blur-sm sm:place-items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-title"
        >
          <section className="race-card relative w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-race-muted hover:text-white"
              aria-label="Fermer"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-race-primary/15 text-race-primary">
              <HelpIcon className="size-6" aria-hidden="true" />
            </div>
            <h2 id="install-title" className="pr-10 text-xl font-semibold">
              {help.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-race-muted">{help.body}</p>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full rounded-xl bg-race-primary px-4 py-3 text-sm font-bold text-white hover:bg-blue-500"
            >
              J&apos;ai compris
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
