"use client";

export function NumberStepper({ label, value, min = 0, onChange }: { label: string; value: number; min?: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-xs">
      <span className="text-race-muted">{label}</span>
      <div className="mt-2 grid grid-cols-[44px_1fr_44px] overflow-hidden rounded-md border border-white/10">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="bg-white/[0.04] font-bold">-</button>
        <input type="number" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-h-11 bg-race-background px-3 text-center font-mono" />
        <button type="button" onClick={() => onChange(value + 1)} className="bg-white/[0.04] font-bold">+</button>
      </div>
    </label>
  );
}
