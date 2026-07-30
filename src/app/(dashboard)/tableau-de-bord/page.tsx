import Link from "next/link";
import { BarChart3, CalendarDays, ClipboardList, Flag, Radio, Shuffle, Timer, Trophy, Users } from "lucide-react";
import { CompetitionCard, IntegrityNote, NextRaceCard } from "@/components/race/preview-components";
import { previewProgramme } from "@/constants/interface-preview";

const stats = [["12", "Épreuves"], ["148", "Athlètes"], ["24", "Clubs"], ["56", "Courses"]] as const;
const quickLinks = [
  ["Inscriptions", "/competitions?vue=inscriptions", ClipboardList],
  ["Tirage", "/competitions?vue=tirage", Shuffle],
  ["Chronométrage", "/chronometrage", Timer],
  ["Résultats", "/resultats", BarChart3]
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div><p className="text-xs text-race-muted">Mercredi 15 mai</p><h2 className="mt-1 text-xl font-semibold sm:text-2xl">Tableau de bord</h2></div>
        <span className="hidden items-center gap-2 rounded-full bg-race-success/10 px-3 py-2 text-xs text-race-success sm:inline-flex"><Radio className="size-3.5" /> Système opérationnel</span>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]">
        <div className="space-y-4">
          <CompetitionCard />
          <NextRaceCard />
          <section className="race-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-medium text-race-muted">Statistiques</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {stats.map(([value, label]) => <div key={label} className="rounded-xl border border-white/[0.06] bg-black/10 px-2 py-3 text-center"><p className="text-xl font-semibold tabular-nums text-blue-100 sm:text-2xl">{value}</p><p className="mt-1 text-[9px] text-race-muted sm:text-[11px]">{label}</p></div>)}
            </div>
          </section>
          <section className="race-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-medium text-race-muted">Accès rapides</p>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
              {quickLinks.map(([label, href, Icon]) => <Link key={label} href={href} className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-black/10 px-1 text-center text-[9px] text-race-muted transition hover:border-race-primary/30 hover:text-white sm:text-[11px]"><Icon className="size-5 text-race-primary transition group-hover:scale-110" />{label}</Link>)}
            </div>
          </section>
        </div>
        <div className="space-y-4">
          <section className="race-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.14em] text-race-muted">Programme du jour</p><h3 className="mt-1 font-semibold">Courses du 15 mai</h3></div><CalendarDays className="size-5 text-race-primary" /></div>
            <div className="mt-4 space-y-2">
              {previewProgramme.slice(0, 4).map((race) => <Link key={race.time} href={race.status === "EN COURS" ? "/depart" : "/programme"} className={`grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-xl border p-3 transition hover:bg-white/[0.03] ${race.status === "EN COURS" ? "border-race-primary/30 bg-race-primary/[0.07]" : "border-white/[0.06]"}`}><span className="text-sm font-semibold tabular-nums">{race.time}</span><span><b className="block text-xs font-medium">{race.name}</b><small className="text-[10px] text-race-muted">{race.heat}</small></span><span className={`text-[8px] font-bold ${race.status === "TERMINÉE" ? "text-race-success" : race.status === "EN COURS" ? "text-race-primary" : "text-race-muted"}`}>{race.status}</span></Link>)}
            </div>
          </section>
          <section className="race-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between"><h3 className="font-semibold">Résumé compétition</h3><Trophy className="size-5 text-race-warning" /></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center"><Summary icon={Flag} value="18" label="Terminées" /><Summary icon={Users} value="4" label="En piste" /><Summary icon={Trophy} value="34" label="Médailles" /></div>
          </section>
        </div>
      </div>
      <IntegrityNote />
    </div>
  );
}

function Summary({ icon: Icon, value, label }: { icon: typeof Flag; value: string; label: string }) {
  return <div className="rounded-xl bg-black/10 p-3"><Icon className="mx-auto size-4 text-race-primary" /><p className="mt-2 text-lg font-semibold">{value}</p><p className="text-[9px] text-race-muted">{label}</p></div>;
}
