"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircleGauge, Flag, Menu, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  ["Accueil", "/tableau-de-bord", CircleGauge],
  ["Compétitions", "/competitions", Trophy],
  ["Courses", "/depart", Flag],
  ["Résultats", "/resultats", BarChart3],
  ["Menu", "/competitions?vue=menu", Menu]
] as const;

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#020b18]/95 px-2 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="Navigation mobile">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(([label, href, Icon]) => {
          const active = pathname === href.split("?")[0];
          return (
            <li key={label}>
              <Link href={href} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] text-race-muted", active && "text-race-primary")}>
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
