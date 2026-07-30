import Link from "next/link";
import { WifiOff } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata = { title: "Hors ligne", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <main className="race-grid grid min-h-screen place-items-center px-6 py-12 text-center">
      <section className="race-card w-full max-w-md rounded-3xl p-8">
        <BrandMark className="mx-auto mb-8" />
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-race-primary/15 text-race-primary">
          <WifiOff className="size-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Connexion indisponible</h1>
        <p className="mt-3 text-sm leading-6 text-race-muted">
          RowMotion Race est installé, mais cette page nécessite une connexion. Reconnectez-vous puis réessayez.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-race-primary px-5 py-3 text-sm font-bold text-white">
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}
