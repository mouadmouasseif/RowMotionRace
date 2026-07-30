import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variable Firebase Admin manquante : ${name}`);
  return value;
}

export function getFirebaseAdminApp(): App {
  const current = getApps()[0];
  if (current) return current;
  return initializeApp({
    credential: cert({
      projectId: required("FIREBASE_ADMIN_PROJECT_ID"),
      clientEmail: required("FIREBASE_ADMIN_CLIENT_EMAIL"),
      privateKey: required("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n")
    })
  });
}

export const getFirebaseAdminAuth = () => getAuth(getFirebaseAdminApp());
