"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";
import { cn } from "@/lib/utils";

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
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
  const { userEmail, userName, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initials = getInitials(userName, userEmail);
  const displayName = userName || (userEmail ? userEmail.split("@")[0] : "Signed in");

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
          "flex w-full items-center gap-3 rounded-2xl border border-sidebar-border/80 bg-white/75 p-3 text-left shadow-sm shadow-slate-950/5 outline-none backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer",
          open && "border-primary/25 bg-white ring-1 ring-primary/15",
        )}
      >
        <Avatar className="size-9 shrink-0 ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-semibold text-foreground">
            {displayName}
          </span>
          <span className="block text-[10px] text-muted-foreground truncate mt-0.5">
            {userEmail || "Manage account"}
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
          <div className="border-b border-border/60 bg-muted/30 px-3.5 py-3">
            <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
            {userEmail && (
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{userEmail}</p>
            )}
          </div>

          <div className="p-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-foreground hover:bg-accent transition-colors"
            >
              <User className="size-3.5" />
              Settings
            </Link>
          </div>

          <div className="border-t border-border/60 p-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-black text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
