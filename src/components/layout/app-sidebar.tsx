"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarDays,
  CircleGauge,
  ClipboardList,
  Flag,
  GitBranch,
  ListOrdered,
  LogOut,
  Radio,
  Settings,
  ShieldCheck,
  Shuffle,
  Timer,
  Trophy,
  Users
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { signOutOfRowMotion } from "@/integrations/rowmotion-ai/rowmotion-auth.adapter";
import { cn } from "@/lib/utils";

const items = [
  ["Tableau de bord", "/tableau-de-bord", CircleGauge],
  ["Compétitions", "/competitions", Trophy],
  ["Calendrier", "/programme", CalendarDays],
  ["Inscriptions", "/competitions?vue=inscriptions", ClipboardList],
  ["Tirage des séries", "/competitions?vue=tirage", Shuffle],
  ["Programme", "/programme", ListOrdered],
  ["Départs", "/depart", Flag],
  ["Chronométrage", "/chronometrage", Timer],
  ["Résultats", "/resultats", BarChart3],
  ["Qualifications", "/competitions?vue=qualifications", GitBranch],
  ["Classements", "/classements", Trophy],
  ["Athlètes", "/athletes", Users],
  ["Clubs", "/clubs", Building2],
  ["Live public", "/live", Radio],
  ["Diagnostic", "/diagnostic-integration", ShieldCheck],
  ["Paramètres", "/competitions?vue=parametres", Settings]
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await signOutOfRowMotion();
    router.replace("/connexion");
  }
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[282px] flex-col border-r border-white/[0.07] bg-[#030d1a]/95 backdrop-blur-xl lg:flex">
      <div className="flex h-24 items-center border-b border-white/[0.07] px-5">
        <BrandMark />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
        <ul className="space-y-1">
          {items.map(([label, href, Icon]) => {
            const path = href.split("?")[0];
            const active = !href.includes("?") && (path === "/tableau-de-bord" ? pathname === path : pathname.startsWith(path));
            return (
              <li key={label}>
                <Link href={href} className={cn("flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm text-race-muted transition hover:bg-white/5 hover:text-white", active && "bg-race-primary/15 font-medium text-white")}>
                  <Icon className={cn("size-[18px]", active && "text-race-primary")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-white/[0.07] p-4">
        <button type="button" onClick={logout} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-race-muted transition hover:bg-race-danger/10 hover:text-race-danger">
          <LogOut className="size-[18px]" /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
