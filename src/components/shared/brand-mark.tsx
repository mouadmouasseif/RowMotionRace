import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="RowMotion Race — accueil">
      {compact ? (
        <Image
          src="/brand/rowmotion-race-icon.png"
          width={48}
          height={48}
          alt="RowMotion Race"
          className="size-11 rounded-xl object-contain"
          priority
        />
      ) : (
        <Image
          src="/brand/rowmotion-race-logo.png"
          width={320}
          height={134}
          alt="RowMotion Race — Performance, Précision, Victoire"
          className="h-auto w-[190px] object-contain"
          priority
        />
      )}
    </Link>
  );
}
