import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, MapPin, Radio, ShieldCheck } from "lucide-react";

export function CompetitionCard() {
  return (
    <article className="race-card rounded-2xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Image src="/brand/rowmotion-race-icon.png" width={58} height={58} alt="" className="size-12 rounded-xl object-contain sm:size-14" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-[.14em] text-race-muted">Compétition en cours</p>
            <span className="rounded-md bg-race-success/15 px-2 py-1 text-[9px] font-bold text-race-success">EN DIRECT</span>
          </div>
          <h2 className="mt-1 text-base font-semibold sm:text-lg">Championnat du Maroc 2026</h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-race-muted">
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> Lac de barrage, Rabat</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" /> 15–18 mai 2026</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NextRaceCard() {
  return (
    <Link href="/depart" className="race-card group block rounded-2xl p-4 transition hover:border-race-primary/35 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[.14em] text-race-muted">Prochaine course</p>
          <h2 className="mt-2 font-semibold">U19 Homme 1x — Qualification 2</h2>
          <p className="mt-1 text-xs text-race-muted">Série 2 · Manche 1/5</p>
        </div>
        <ChevronRight className="size-5 text-race-muted transition group-hover:translate-x-1 group-hover:text-race-primary" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div><p className="text-[10px] uppercase text-race-muted">Départ prévu</p><p className="mt-1 text-3xl font-semibold tabular-nums text-race-primary">10:45</p></div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-race-primary/10 px-2.5 py-1.5 text-[10px] font-medium text-race-primary"><Clock3 className="size-3" /> Préparer</span>
      </div>
    </Link>
  );
}

export function AthleteAvatar({ lane }: { lane: number }) {
  const colors = ["from-amber-400 to-orange-700", "from-sky-400 to-blue-800", "from-violet-400 to-indigo-800", "from-emerald-400 to-teal-800"];
  return <span className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${colors[(lane - 1) % colors.length]} text-xs font-bold text-white ring-2 ring-white/10`}>{lane}</span>;
}

export function LiveBadge() {
  return <span className="inline-flex items-center gap-1.5 rounded-md bg-race-success/15 px-2 py-1 text-[9px] font-bold text-race-success"><Radio className="size-3" /> EN DIRECT</span>;
}

export function IntegrityNote() {
  return <p className="inline-flex items-center gap-2 text-[11px] text-race-muted"><ShieldCheck className="size-4 text-race-success" /> Aperçu d’interface local — aucune donnée de profil écrite dans Firebase</p>;
}
