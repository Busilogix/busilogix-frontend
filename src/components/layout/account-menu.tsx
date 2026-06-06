"use client";

import { ChevronDown, LogOut, Receipt, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";
import { cn } from "@/lib/utils";

import { AppLogo } from "./app-logo";

function getInitials(email: string | null): string {
  if (!email) {
    return "BL";
  }

  const localPart = email.split("@")[0] ?? "";
  const parts = localPart.split(/[._-]/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return localPart.slice(0, 2).toUpperCase() || "BL";
}

type AccountMenuProps = {
  className?: string;
};

export function AccountMenu({ className }: AccountMenuProps) {
  const { userEmail, logout } = useAuth();
  const email = userEmail ?? "Signed in";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-sidebar-border/80 bg-white/75 p-3 text-left shadow-sm shadow-slate-950/5 outline-none backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white focus-visible:ring-3 focus-visible:ring-ring/50",
          open && "border-primary/25 bg-white ring-1 ring-primary/15",
        )}
      >
        <Avatar className="size-9 shrink-0 ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(userEmail)}
          </AvatarFallback>
        </Avatar>

        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-medium text-foreground">
            {email}
          </span>
          <span className="block text-xs text-muted-foreground">
            Manage account
          </span>
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-56 overflow-hidden rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-xl shadow-slate-950/10 ring-1 ring-foreground/5"
        >
          <div className="border-b border-border/70 bg-white px-2.5 py-2">
            <AppLogo variant="popover" asLink={false} />
            <p className="mt-1.5 truncate text-xs text-muted-foreground">
              {email}
            </p>
          </div>

          <div className="p-1.5">
            <AccountMenuItem icon={User} label="Profile" />
            <AccountMenuItem icon={Receipt} label="Billing" />
          </div>

          <div className="border-t border-border/70 p-1.5">
            <AccountMenuItem
              icon={LogOut}
              label="Sign out"
              destructive
              onClick={handleLogout}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AccountMenuItem({
  icon: Icon,
  label,
  destructive = false,
  onClick,
}: {
  icon: typeof User;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
        destructive &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}
