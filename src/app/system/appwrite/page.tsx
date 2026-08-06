import { Database, ShieldAlert } from "lucide-react";
import { checkAppwriteHealth } from "@/backend/appwrite/rest";
import { missingAppwriteEnvironmentKeys } from "@/backend/appwrite/client";
import { appwriteCollections } from "@/backend/appwrite/schema";

export default async function AppwriteSystemPage() {
  const health = await checkAppwriteHealth();
  const missing = missingAppwriteEnvironmentKeys();

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-6 text-race-text">
      <section className="race-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-race-primary/15 text-race-primary"><Database className="size-5" /></div>
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-race-primary">System</p>
            <h1 className="text-2xl font-black">Appwrite Backend</h1>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Metric label="Endpoint" value={health.endpoint || "-"} />
          <Metric label="Project" value={health.projectId || "-"} />
          <Metric label="Database" value={health.databaseId || "-"} />
        </div>
        <div className={`mt-5 rounded-xl border p-4 text-sm ${health.ok ? "border-race-success/30 bg-race-success/10 text-race-success" : "border-race-warning/30 bg-race-warning/10 text-race-warning"}`}>
          {health.ok ? "Appwrite database reachable" : health.message}
        </div>
      </section>

      {missing.length > 0 && (
        <section className="race-card rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 size-5 text-race-warning" />
            <div>
              <h2 className="font-bold">Missing configuration</h2>
              <p className="mt-1 text-sm text-race-muted">Add these values before Appwrite can become the primary backend.</p>
              <div className="mt-3 flex flex-wrap gap-2">{missing.map((key) => <code key={key} className="rounded-lg bg-race-background px-3 py-2 text-xs text-race-warning">{key}</code>)}</div>
            </div>
          </div>
        </section>
      )}

      <section className="race-card rounded-2xl p-5">
        <h2 className="font-bold">Configured collections</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {Object.entries(appwriteCollections).map(([name, fields]) => (
            <div key={name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="font-mono text-sm font-bold">{name}</p>
              <p className="mt-1 text-xs text-race-muted">{fields.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-[10px] font-bold uppercase text-race-muted">{label}</p><p className="mt-1 break-all text-sm font-semibold">{value}</p></div>;
}
