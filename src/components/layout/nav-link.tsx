"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/navigation";

type NavLinkProps = {
  item: NavItem;
  onNavigate?: () => void;
};

export function NavLink({ item, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-transform",
          isActive ? "text-primary" : "group-hover:scale-105",
        )}
        aria-hidden
      />
      <span>{item.title}</span>
    </Link>
  );
}
