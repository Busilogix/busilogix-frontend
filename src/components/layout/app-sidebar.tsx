import { AccountMenu } from "./account-menu";
import { SidebarHeader } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border/70 bg-[linear-gradient(180deg,oklch(1_0_0)_0%,oklch(0.985_0.01_250)_100%)] lg:sticky lg:top-0 lg:flex">
      <SidebarHeader priority />

      <SidebarNav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden" />

      <div className="relative z-20 shrink-0 overflow-visible border-t border-sidebar-border/60 px-3 py-3">
        <AccountMenu />
      </div>
    </aside>
  );
}
