"use client";

import { sidebarNavItems } from "@/config/navigation";

import { NavLink } from "./nav-link";

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main">
      {sidebarNavItems.map((item) => (
        <NavLink key={item.href} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}
