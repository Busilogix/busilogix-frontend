import { Separator } from "@/components/ui/separator";

import { AppLogo } from "./app-logo";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-sidebar-border/80 bg-sidebar/90 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <AppLogo showTagline />
      </div>
      <SidebarNav />
      <div className="mt-auto px-4 py-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <div className="rounded-xl border border-sidebar-border bg-background/70 p-4">
          <p className="text-sm font-medium text-foreground">Business ready</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Track customers, invoices, revenue, and settings from one workspace.
          </p>
        </div>
      </div>
    </aside>
  );
}
