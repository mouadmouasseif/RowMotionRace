import { ResultsDemo } from "@/components/race/results-demo";
export const metadata = { title: "Résultats" };
export default function ResultsPage() { return <div className="mx-auto max-w-3xl"><div className="mb-4"><p className="text-xs uppercase tracking-[.16em] text-race-primary">Contrôle officiel</p><h2 className="mt-1 text-xl font-semibold">Résultats</h2></div><ResultsDemo /></div>; }
