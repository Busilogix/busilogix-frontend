"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

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
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive
          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15"
          : "text-sidebar-foreground/75 hover:bg-white/70 hover:text-sidebar-foreground hover:shadow-sm hover:shadow-slate-950/5",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive ? (
        <span
          className="absolute top-1/2 left-0 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary"
          aria-hidden
        />
      ) : null}

      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
            : "bg-sidebar-accent/70 text-sidebar-foreground/70 group-hover:bg-primary/10 group-hover:text-primary",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>

      <span className="truncate">{item.title}</span>
    </Link>
  );
}
