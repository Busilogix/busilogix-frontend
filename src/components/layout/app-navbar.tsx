"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useStoreName } from "@/hooks/use-store-name";
import { cn } from "@/lib/utils";

import { AppLogo } from "./app-logo";
import { MobileNav } from "./mobile-nav";
import {
  shellContentClassName,
  shellHeaderSurfaceClassName,
} from "./shell-content";

export function AppNavbar() {
  const storeName = useStoreName();

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-background/80 backdrop-blur-sm">
      <div className={cn(shellContentClassName, "pt-4 sm:pt-6")}>
        <div className={shellHeaderSurfaceClassName}>
          <div className="lg:hidden">
            <MobileNav />
          </div>

          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-3"
            aria-label={`${storeName} dashboard`}
          >
            <AppLogo variant="navbar" asLink={false} />
            <p className="truncate text-sm font-bold tracking-tight text-foreground sm:text-base">
              {storeName}
            </p>
          </Link>

          <div className="flex-1" aria-hidden />

          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        </div>
      </div>
    </header>
  );
}
