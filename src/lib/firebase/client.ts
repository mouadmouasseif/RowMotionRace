import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseConfig } from "./config";

let app: FirebaseApp | undefined;
let analytics: Analytics | null | undefined;

export function getFirebaseClientApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
  return app;
}

export const getFirebaseClientAuth = (): Auth => getAuth(getFirebaseClientApp());
export const getFirebaseClientDb = (): Firestore => getFirestore(getFirebaseClientApp());
export const getFirebaseClientStorage = (): FirebaseStorage => getStorage(getFirebaseClientApp());

export async function getFirebaseClientAnalytics(): Promise<Analytics | null> {
  if (analytics !== undefined) return analytics;
  analytics = typeof window !== "undefined" && (await isSupported())
    ? getAnalytics(getFirebaseClientApp())
    : null;
  return analytics;
}
