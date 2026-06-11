import { AppNavbar } from "./app-navbar";
import { AppSidebar } from "./app-sidebar";
import { AppFooter } from "./app-footer";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
        <AppNavbar />
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">{children}</div>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}
