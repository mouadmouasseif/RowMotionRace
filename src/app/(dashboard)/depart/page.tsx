import { StartSequenceDemo } from "@/components/race/start-sequence-demo";
export const metadata = { title: "Départ" };
export default function StartPage() { return <div className="mx-auto max-w-3xl"><div className="mb-4"><p className="text-xs uppercase tracking-[.16em] text-race-primary">Contrôle de course</p><h2 className="mt-1 text-xl font-semibold">Départ</h2></div><StartSequenceDemo /></div>; }
