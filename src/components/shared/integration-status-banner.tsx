import Link from "next/link";
import { ArrowUpRight, Database, ShieldCheck } from "lucide-react";
import { isFirebaseConfigured, missingFirebaseEnvironmentKeys } from "@/lib/firebase/config";
import { StatusPill } from "./status-pill";

export function IntegrationStatusBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-race-surface p-6 shadow-glow sm:p-8">
      <div className="absolute -right-20 -top-24 size-64 rounded-full bg-race-primary/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-race-primary/15 text-race-primary">
            <Database className="size-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-race-text">Connexion RowMotion AI</h2>
              <StatusPill status={isFirebaseConfigured ? "success" : "warning"}>
                {isFirebaseConfigured ? "Configurée" : "À configurer"}
              </StatusPill>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-race-muted">
              {isFirebaseConfigured
                ? "Race utilise le projet Firebase partagé. Les profils restent la source de vérité dans RowMotion AI."
                : `${missingFirebaseEnvironmentKeys.length} variable(s) Firebase manquante(s). Aucune donnée n’est créée ni dupliquée.`}
            </p>
          </div>
        </div>
        <Link
          href="/diagnostic-integration"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-race-text transition hover:border-race-primary/40 hover:bg-race-primary/10"
        >
          <ShieldCheck className="size-4 text-race-primary" />
          Vérifier l’intégration
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
