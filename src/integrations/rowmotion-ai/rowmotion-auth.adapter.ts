import { browserLocalPersistence, onAuthStateChanged, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase/client";

async function createServerSession(user: User) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken: await user.getIdToken() })
  });
  if (!response.ok) throw new Error("La session sécurisée nécessite la configuration Firebase Admin.");
}

export async function signInToExistingRowMotionAccount(email: string, password: string) {
  const auth = getFirebaseClientAuth();
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await createServerSession(credential.user);
  return credential.user;
}

export const sendRowMotionPasswordReset = (email: string) => sendPasswordResetEmail(getFirebaseClientAuth(), email);
export const observeRowMotionAuth = (callback: (user: User | null) => void) => onAuthStateChanged(getFirebaseClientAuth(), callback);
export async function signOutOfRowMotion() {
  await Promise.all([signOut(getFirebaseClientAuth()), fetch("/api/auth/session", { method: "DELETE" })]);
}
