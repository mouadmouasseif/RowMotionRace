"use client";

import { Cloud, Wifi } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/authentication/auth-provider";
import { isFirebaseConfigured } from "@/lib/firebase/config";

const titles: Record<string, string> = {
  "/tableau-de-bord": "Tableau de bord",
  "/competitions": "Compétitions",
  "/athletes": "Athlètes RowMotion AI",
  "/clubs": "Clubs RowMotion AI",
  "/utilisateurs": "Utilisateurs",
  "/parametres": "Paramètres",
  "/diagnostic-integration": "Diagnostic d’intégration"
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const title = titles[pathname] ?? "RowMotion Race";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/8 bg-race-background/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="pl-12 lg:pl-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-race-primary">Centre de course</p>
        <h1 className="mt-1 text-xl font-semibold text-race-text">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden items-center gap-2 rounded-full border border-race-success/20 bg-race-success/[0.08] px-3 py-2 text-xs text-race-success sm:flex">
          <Wifi className="size-3.5" />
          {isFirebaseConfigured ? "Firebase connecté" : "Interface prête"}
        </span>
        <div className="hidden items-center gap-3 rounded-xl border border-white/8 bg-race-surface px-3 py-2 md:flex">
          <Cloud className="size-4 text-race-primary" />
          <div>
            <p className="max-w-32 truncate text-xs font-medium text-race-text">{profile?.displayName}</p>
            <p className="text-[10px] text-race-muted">Firebase partagé</p>
          </div>
        </div>
      </div>
    </header>
  );
}
