"use client";

import { useEffect } from "react";
import { getFirebaseClientAnalytics } from "@/lib/firebase/client";

export function FirebaseAnalytics() {
  useEffect(() => { void getFirebaseClientAnalytics(); }, []);
  return null;
}
