import { AuthBrandPanel } from "@/components/auth";
import { GuestGuard } from "@/components/auth/guest-guard";

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
