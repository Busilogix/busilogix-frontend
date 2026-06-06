import { AppLogo } from "./app-logo";

type SidebarHeaderProps = {
  priority?: boolean;
};

export function SidebarHeader({ priority = false }: SidebarHeaderProps) {
  return (
    <div className="flex shrink-0 flex-col items-center space-y-2 border-b border-sidebar-border/80 bg-white px-4 py-3 text-center">
      <AppLogo variant="sidebar" priority={priority} />
      <h2 className="w-full truncate text-lg font-bold tracking-tight text-slate-900">
        <span className="text-primary/80">Management</span> Dashboard
      </h2>
    </div>
  );
}
