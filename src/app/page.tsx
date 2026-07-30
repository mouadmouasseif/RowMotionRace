import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Flag, ShieldCheck, Timer, Trophy } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

const features = [[Timer, "Chronométrage précis"], [Flag, "PRÊT · ATTENTION · GO"], [BarChart3, "Résultats en direct"], [Trophy, "Classements et analyses"]] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8"><BrandMark /><Link href="/connexion" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:border-race-primary/40">Accéder à Race <ArrowRight className="size-4" /></Link></nav>
      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-race-primary/20 bg-race-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-blue-300"><ShieldCheck className="size-3.5" /> Plateforme officielle de compétition</span>
          <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-[-.04em] sm:text-6xl">Performance.<br /><span className="text-race-primary">Précision.</span> Victoire.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-race-muted sm:text-lg">L’application de gestion des compétitions d’aviron au Maroc, connectée aux profils RowMotion AI existants.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/connexion" className="inline-flex h-12 items-center gap-2 rounded-xl bg-race-primary px-5 font-semibold text-white transition hover:bg-blue-500">Ouvrir le centre de course <ArrowRight className="size-5" /></Link><Link href="/live" className="inline-flex h-12 items-center rounded-xl border border-white/10 bg-race-surface px-5 font-medium">Suivre en direct</Link></div>
          <div className="mt-10 grid grid-cols-2 gap-3">{features.map(([Icon, label]) => <div key={label} className="race-card flex min-h-20 items-center gap-3 rounded-xl p-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-race-primary/10"><Icon className="size-5 text-race-primary" /></span><p className="text-[11px] font-medium uppercase leading-4 tracking-[.05em] text-race-muted">{label}</p></div>)}</div>
        </div>
        <div className="relative">
          <div className="absolute inset-10 rounded-full bg-race-primary/15 blur-3xl" />
          <Image src="/brand/rowmotion-race-mobile-showcase.png" width={925} height={1800} alt="Aperçu des écrans mobiles RowMotion Race" className="relative mx-auto h-auto max-h-[760px] w-auto rounded-2xl object-contain shadow-2xl shadow-black/60" priority />
        </div>
      </section>
    </main>
  );
}
