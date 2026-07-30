import { ShieldCheck, Users } from "lucide-react";

export const metadata = { title: "Utilisateurs" };

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-white/8 bg-race-surface p-8">
      <Users className="size-8 text-race-primary" />
      <h2 className="mt-5 text-2xl font-semibold text-race-text">Comptes RowMotion AI partagés</h2>
      <p className="mt-3 text-sm leading-6 text-race-muted">RowMotion Race ne crée pas de nouvelle administration des utilisateurs. Les rôles principaux restent inchangés et les droits de compétition sont lus depuis `racePermissions`.</p>
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-race-success/[0.06] p-4 text-sm text-race-muted"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-race-success" /> Les fonctions de création et de modification des comptes sont absentes de cette Phase 1.</div>
    </div>
  );
}
