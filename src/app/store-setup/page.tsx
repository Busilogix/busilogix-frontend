"use client";

import { AuthBrandPanel, AuthGuard } from "@/components/auth";
import { StoreSetupForm } from "@/components/store-setup/store-setup-form";
import { AuthSupportButton } from "@/components/support/auth-support-button";

export default function StoreSetupPage() {
  return (
    <AuthGuard>
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        <AuthBrandPanel />
        <div
          className="relative flex flex-col"
          style={{
            background:
              "radial-gradient(ellipse at top right, oklch(0.96 0.025 252 / 0.6), transparent 60%), oklch(0.985 0.01 250)",
          }}
        >
          <AuthSupportButton />
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <StoreSetupForm />
          </main>
          <p className="pb-5 text-center text-[11px] text-muted-foreground/70">
            © 2026 Busilogix · Intelligent Commerce Operations Platform
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
