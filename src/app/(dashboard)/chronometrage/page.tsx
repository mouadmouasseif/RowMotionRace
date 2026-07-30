import { TimingDemo } from "@/components/race/timing-demo";
export const metadata = { title: "Chronométrage" };
export default function TimingPage() { return <div className="mx-auto max-w-3xl"><div className="mb-4"><p className="text-xs uppercase tracking-[.16em] text-race-primary">Course officielle</p><h2 className="mt-1 text-xl font-semibold">Chronométrage</h2></div><TimingDemo /></div>; }
