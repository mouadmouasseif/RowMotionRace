import { Database, Settings } from "lucide-react";
import { isFirebaseConfigured, missingFirebaseEnvironmentKeys } from "@/lib/firebase/config";

export const metadata = { title: "Paramètres" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-white/8 bg-race-surface p-8">
      <Settings className="size-8 text-race-primary" />
      <h2 className="mt-5 text-2xl font-semibold text-race-text">Configuration de la plateforme</h2>
      <p className="mt-3 text-sm leading-6 text-race-muted">Les secrets restent gérés par l’environnement de déploiement et ne sont jamais affichés dans l’interface.</p>
      <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/8 bg-race-background/60 p-5">
        <Database className="mt-0.5 size-5 shrink-0 text-race-primary" />
        <div><p className="font-medium text-race-text">Firebase RowMotion AI</p><p className="mt-1 text-sm text-race-muted">{isFirebaseConfigured ? "Configuration publique présente." : `${missingFirebaseEnvironmentKeys.length} variable(s) publique(s) à renseigner.`}</p></div>
      </div>
    </div>
  );
}
