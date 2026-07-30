import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/authentication/auth-provider";
import { FirebaseAnalytics } from "@/components/shared/firebase-analytics";

export const metadata: Metadata = {
  title: { default: "RowMotion Race", template: "%s · RowMotion Race" },
  description: "L’application officielle de gestion des compétitions d’aviron au Maroc.",
  icons: { icon: "/brand/favicon.png", apple: "/brand/rowmotion-race-icon.png" },
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="fr"><body><AuthProvider><FirebaseAnalytics />{children}</AuthProvider></body></html>; }
