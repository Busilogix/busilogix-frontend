"use client";

import { sidebarNavItems } from "@/config/navigation";

import { cn } from "@/lib/utils";

import { NavLink } from "./nav-link";

type SidebarNavProps = {
  onNavigate?: () => void;
  className?: string;
};

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  return (
    <nav
      className={cn("flex flex-col gap-3 px-3 py-3", className)}
      aria-label="Main"
    >
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground/75 uppercase">
          Workspace
        </p>
        <div className="flex flex-col gap-0.5">
          {sidebarNavItems.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </nav>
  );
}
