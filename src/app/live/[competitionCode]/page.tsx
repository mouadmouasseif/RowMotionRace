import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

export default async function PublicLivePage({ params }: { params: Promise<{ competitionCode: string }> }) {
  const { competitionCode } = await params;
  return (
    <main className="min-h-screen bg-race-background p-5 sm:p-8">
      <nav className="mx-auto flex max-w-5xl items-center justify-between"><BrandMark /><Link href="/live" className="inline-flex items-center gap-2 text-sm text-race-muted hover:text-race-text"><ArrowLeft className="size-4" /> Changer de code</Link></nav>
      <section className="mx-auto mt-20 max-w-3xl rounded-3xl border border-white/8 bg-race-surface p-8 text-center sm:p-12">
        <Radio className="mx-auto size-9 text-race-primary" />
        <p className="mt-6 font-mono text-sm tracking-[0.2em] text-race-primary">{decodeURIComponent(competitionCode).toUpperCase()}</p>
        <h1 className="mt-3 text-3xl font-semibold text-race-text">Aucune course diffusée</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-race-muted">Le direct apparaîtra ici lorsqu’une compétition publiée portant ce code sera disponible dans Firebase.</p>
      </section>
    </main>
  );
}
