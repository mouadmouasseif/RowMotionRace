import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { BrandMark } from "@/components/shared/brand-mark";
import { AuthGuard } from "@/features/authentication/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen lg:pl-[282px]">
        <AppSidebar />
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#020b18]/90 px-4 backdrop-blur-xl lg:h-20 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <LinkButton href="/competitions?vue=menu" label="Ouvrir le menu"><Menu className="size-5" /></LinkButton>
            <BrandMark compact />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-race-primary">RowMotion Race</p>
              <h1 className="text-sm font-semibold">Centre de course</h1>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-race-primary">Centre de course</p>
            <h1 className="mt-1 text-xl font-semibold">RowMotion Race</h1>
          </div>
          <LinkButton href="/competitions?vue=notifications" label="Notifications"><Bell className="size-5" /><span className="absolute right-1 top-1 size-2 rounded-full bg-race-danger" /></LinkButton>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>
        <MobileNavigation />
      </div>
    </AuthGuard>
  );
}

function LinkButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <Link href={href} aria-label={label} className="relative grid size-10 place-items-center rounded-xl border border-white/10 bg-race-surface text-race-muted transition hover:text-white">{children}</Link>;
}
