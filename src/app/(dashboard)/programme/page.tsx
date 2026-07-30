import Link from "next/link";
import { CheckCircle2, CircleDot, Radio } from "lucide-react";
import { previewProgramme } from "@/constants/interface-preview";

export const metadata = { title: "Programme" };
export default function ProgrammePage() {
  return <div className="mx-auto max-w-4xl space-y-4"><div><p className="text-xs uppercase tracking-[.16em] text-race-primary">Championnat du Maroc 2026</p><h2 className="mt-1 text-xl font-semibold">Programme</h2></div><section className="race-card rounded-2xl p-4"><div className="flex gap-2 overflow-x-auto pb-1">{["15 MAI", "16 MAI", "17 MAI", "18 MAI"].map((date, index) => <button key={date} type="button" className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold ${index === 0 ? "bg-race-primary text-white" : "border border-white/10 text-race-muted"}`}>{date}</button>)}</div></section><section className="race-card overflow-hidden rounded-2xl"><div className="divide-y divide-white/[0.06]">{previewProgramme.map((race) => <Link key={race.time} href={race.status === "EN COURS" ? "/depart" : "/programme"} className={`grid grid-cols-[54px_1fr_auto] items-center gap-3 p-4 transition hover:bg-white/[0.03] ${race.status === "EN COURS" ? "bg-race-primary/[0.07]" : ""}`}><span className="text-sm font-semibold tabular-nums">{race.time}</span><span><b className="block text-xs font-medium sm:text-sm">{race.name}</b><small className="text-[10px] text-race-muted">{race.heat}</small></span><StatusIcon status={race.status} /></Link>)}</div></section></div>;
}
function StatusIcon({ status }: { status: string }) { if (status === "TERMINÉE") return <CheckCircle2 className="size-5 text-race-success" />; if (status === "EN COURS") return <Radio className="size-5 text-race-primary" />; return <CircleDot className="size-5 text-race-muted" />; }
