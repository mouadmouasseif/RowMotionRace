import { ExistingDataExplorer } from "@/components/shared/existing-data-explorer";

export default function AthletesPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <p className="mb-6 text-sm text-race-muted">Athletes RowMotion AI synchronises automatiquement avec image, score et club.</p>
      <ExistingDataExplorer initialTab="athletes" />
    </div>
  );
}
