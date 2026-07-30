import Link from "next/link";
import { Radio } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
export default function LivePage() { return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-lg rounded-3xl border border-white/10 bg-race-surface p-8 text-center"><div className="mb-8 flex justify-center"><BrandMark /></div><Radio className="mx-auto size-8 text-race-primary" /><h1 className="mt-5 text-3xl font-semibold">Direct public</h1><p className="mt-3 text-sm text-race-muted">Le suivi par code compétition sera activé pendant la phase de course.</p><Link href="/" className="mt-7 inline-flex rounded-xl border border-white/10 px-4 py-3 text-sm">Retour à l’accueil</Link></section></main>; }
