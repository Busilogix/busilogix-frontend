import { AuthBrandPanel } from "@/components/auth";
import { AppLogo } from "@/components/layout/app-logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex flex-col">
        <header className="hidden px-8 pt-8 lg:block">
          <AppLogo href="/login" showTagline />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          {children}
        </main>
      </div>
    </div>
  );
}
