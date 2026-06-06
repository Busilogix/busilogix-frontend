import { AppNavbar } from "./app-navbar";
import { AppSidebar } from "./app-sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
        <AppNavbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
