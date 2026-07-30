import type { FirebaseOptions } from "firebase/app";

const requiredFirebaseEnvironment = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const missingFirebaseEnvironmentKeys = Object.entries(requiredFirebaseEnvironment)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseEnvironmentKeys.length === 0;

export function getFirebaseConfig(): FirebaseOptions {
  if (!isFirebaseConfigured) {
    throw new Error(`Configuration Firebase RowMotion AI incomplète : ${missingFirebaseEnvironmentKeys.join(", ")}`);
  }
  return {
    ...(requiredFirebaseEnvironment as Required<typeof requiredFirebaseEnvironment>),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
}
