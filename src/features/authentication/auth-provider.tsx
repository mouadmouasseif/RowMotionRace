"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import type { RowMotionUser } from "@/types/rowmotion-ai";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { observeRowMotionAuth } from "@/integrations/rowmotion-ai/rowmotion-auth.adapter";
import { getExistingUserById } from "@/integrations/rowmotion-ai/rowmotion-users.adapter";

interface AuthState { user: User | null; profile: RowMotionUser | null; loading: boolean; error: string | null }
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: isFirebaseConfigured, error: null });
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return observeRowMotionAuth(async (user) => {
      if (!user) return setState({ user: null, profile: null, loading: false, error: null });
      try {
        setState({ user, profile: await getExistingUserById(user.uid), loading: false, error: null });
      } catch {
        setState({ user, profile: null, loading: false, error: "Profil RowMotion AI inaccessible." });
      }
    });
  }, []);
  return <AuthContext.Provider value={useMemo(() => state, [state])}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider manquant.");
  return value;
}
