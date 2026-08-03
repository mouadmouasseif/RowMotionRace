import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/authentication/auth-provider";
import { FirebaseAnalytics } from "@/components/shared/firebase-analytics";
import { InstallAppButton } from "@/components/shared/install-app-button";
import { PwaRegister } from "@/components/shared/pwa-register";

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: "RowMotion Race",
  title: {
    default: "RowMotion Race - Gestion des competitions d'aviron",
    template: "%s - RowMotion Race"
  },
  description:
    "L'application officielle de gestion, de chronometrage et de suivi en direct des competitions d'aviron au Maroc.",
  keywords: [
    "RowMotion Race",
    "aviron Maroc",
    "competition d'aviron",
    "chronometrage sportif",
    "resultats en direct",
    "classement aviron"
  ],
  authors: [{ name: "RowMotion Race" }],
  creator: "RowMotion Race",
  publisher: "RowMotion Race",
  category: "sports",
  classification: "Application de gestion sportive",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.png", type: "image/png", sizes: "492x492" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/icon-512.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/brand/favicon.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RowMotion Race"
  },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "RowMotion Race",
    title: "RowMotion Race - Performance, precision, victoire",
    description:
      "Gerez les departs, le chronometrage, les resultats et les classements de vos competitions d'aviron.",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "RowMotion Race - Performance, precision, victoire"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "RowMotion Race",
    description: "La plateforme de gestion des competitions d'aviron au Maroc.",
    images: ["/og.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "RowMotion Race",
    "msapplication-TileColor": "#03070d",
    "msapplication-TileImage": "/brand/icon-192.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#03070d" },
    { media: "(prefers-color-scheme: light)", color: "#071323" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <FirebaseAnalytics />
          <PwaRegister />
          {children}
          <InstallAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
