"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "./auth-provider";
import { canAccessRaceModule } from "@/lib/permissions/permissions";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (!loading && !user) router.replace(`/connexion?retour=${encodeURIComponent(pathname)}`); }, [loading, pathname, router, user]);
  if (loading || !user) return <div className="grid min-h-screen place-items-center bg-race-background text-race-muted"><LoaderCircle className="size-6 animate-spin text-race-primary" /></div>;
  if (error || !profile || !canAccessRaceModule(profile)) return <div className="grid min-h-screen place-items-center bg-race-background p-6"><div className="max-w-lg rounded-3xl border border-race-danger/30 bg-race-surface p-8 text-center"><ShieldAlert className="mx-auto size-8 text-race-danger" /><h1 className="mt-4 text-xl font-semibold">Accès non autorisé</h1><p className="mt-2 text-sm text-race-muted">{error ?? "Le rôle RowMotion AI ne permet pas l’accès à Race."}</p></div></div>;
  return children;
}
