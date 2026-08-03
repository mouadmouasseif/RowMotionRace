"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Anchor,
  Building2,
  CalendarDays,
  Camera,
  ClipboardList,
  Gauge,
  LogOut,
  Medal,
  MonitorDot,
  Radio,
  Settings,
  Share2,
  ShieldCheck,
  Shuffle,
  Timer,
  Trophy,
  Users
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { useAuth } from "@/features/authentication/auth-provider";
import { signOutOfRowMotion } from "@/integrations/rowmotion-ai/rowmotion-auth.adapter";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "CENTRE NATIONAL",
    items: [
      ["Tableau de bord", "/tableau-de-bord", Gauge],
      ["Competitions", "/competitions", Trophy],
      ["Calendrier", "/programme", CalendarDays],
      ["Live maintenant", "/live", Radio]
    ]
  },
  {
    title: "ORGANISATION",
    items: [
      ["Athletes", "/athletes", Users],
      ["Clubs", "/clubs", Building2],
      ["Inscriptions", "/competitions", ClipboardList],
      ["Jury & officiels", "/jury", ShieldCheck]
    ]
  },
  {
    title: "RACE CONTROL",
    items: [
      ["Centre de course", "/competitions", MonitorDot],
      ["Departs", "/race-control/start", Anchor],
      ["Chronometrage", "/chronometrage", Timer],
      ["Arrivees", "/race-control/finish", FlagIcon],
      ["Jury / Penalites", "/jury", ShieldCheck]
    ]
  },
  {
    title: "RESULTATS",
    items: [
      ["Resultats", "/resultats", Trophy],
      ["Qualifications", "/classements?vue=qualifications", Shuffle],
      ["Classements", "/classements", Activity],
      ["Medailles", "/classements?vue=medailles", Medal]
    ]
  },
  {
    title: "LIVE",
    items: [
      ["Live Public", "/live", Radio],
      ["Cameras", "/competitions?tab=cameras", Camera],
      ["Share Live", "/competitions?tab=live", Share2]
    ]
  },
  {
    title: "SYSTEME",
    items: [
      ["Appareils", "/parametres?section=devices", MonitorDot],
      ["Synchronisation", "/parametres?section=sync", Activity],
      ["Diagnostic Firebase", "/diagnostic-integration", Gauge],
      ["Parametres", "/parametres", Settings]
    ]
  }
] as const;

function FlagIcon(props: React.ComponentProps<typeof Trophy>) {
  return <Trophy {...props} />;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const role = profile?.role ?? "SUPER_ADMIN";

  async function logout() {
    await signOutOfRowMotion();
    router.replace("/connexion");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[282px] flex-col border-r border-white/[0.07] bg-[#010916]/95 backdrop-blur-xl lg:flex">
      <div className="border-b border-white/[0.07] px-5 py-5">
        <BrandMark />
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[.2em] text-race-primary">Centre national</p>
        <p className="mt-1 text-xs text-race-muted">{role}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[.16em] text-race-muted">{group.title}</p>
            <ul className="mt-2 space-y-1">
              {group.items.map(([label, href, Icon]) => {
                const path = href.split("?")[0];
                const active = pathname === path || (path !== "/" && pathname.startsWith(path));
                return (
                  <li key={`${group.title}-${label}`}>
                    <Link href={href} className={cn("flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm text-race-muted transition hover:bg-white/5 hover:text-white", active && "bg-race-primary/15 font-semibold text-white")}>
                      <Icon className={cn("size-[18px]", active && "text-race-primary")} />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/[0.07] p-4">
        <button type="button" onClick={logout} className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-race-muted transition hover:bg-race-danger/10 hover:text-race-danger">
          <LogOut className="size-[18px]" /> Deconnexion
        </button>
      </div>
    </aside>
  );
}
