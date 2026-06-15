import Link from "next/link";
import { Home } from "lucide-react";

import { AuthBrandPanel } from "@/components/auth";
import { GuestGuard } from "@/components/auth/guest-guard";
import { AuthSupportButton } from "@/components/support/auth-support-button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        <AuthBrandPanel />
        <div
          className="relative flex flex-col"
          style={{
            background:
              "radial-gradient(ellipse at top right, oklch(0.96 0.025 252 / 0.6), transparent 60%), oklch(0.985 0.01 250)",
          }}
        >
          <Link
            href="/"
            className="absolute top-4 left-4 sm:top-6 sm:left-8 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/50 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Home className="size-4 text-primary" aria-hidden />
            Home
          </Link>
          <AuthSupportButton />
          <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-16">
            {children}
          </main>
          <p className="pb-5 text-center text-[11px] text-muted-foreground/70">
            © 2026 Busilogix · Intelligent Commerce Operations Platform
          </p>
        </div>
      </div>
    </GuestGuard>
  );
}
