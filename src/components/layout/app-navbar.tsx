"use client";

import { Bell, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import { MobileNav } from "./mobile-nav";
import {
  shellContentClassName,
  shellHeaderSurfaceClassName,
} from "./shell-content";

export function AppNavbar() {
  const { store } = useStore();
  const storeName = store?.name || "";
  const logoUrl = store?.logoUrl;

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-background/40 backdrop-blur-sm">
      <div className={cn(shellContentClassName, "pt-4 sm:pt-6")}>
        <div className="flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-2 sm:gap-4 sm:px-5 transition-all duration-300 bg-white/75 dark:bg-slate-900/75 border-slate-200/50 dark:border-slate-800/40 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04),0_10px_20px_-12px_rgba(0,0,0,0.06)] dark:shadow-none">
          <div className="lg:hidden">
            <MobileNav />
          </div>

          <Link
            href="/dashboard"
            className="group flex min-w-0 items-center gap-2.5 rounded-xl outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-3"
            aria-label={`${storeName} dashboard`}
          >
            {logoUrl ? (
              <span className="relative block size-9 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-0.5 aspect-square ring-2 ring-primary/5 shadow-sm transition-all group-hover:ring-primary/25">
                <Image
                  src={logoUrl}
                  alt={storeName}
                  fill
                  className="object-contain rounded-lg"
                  sizes="36px"
                  priority
                />
              </span>
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 text-white font-bold text-sm border border-primary/10 shadow-md shadow-primary/10 transition-transform group-hover:scale-105">
                {storeName ? storeName[0].toUpperCase() : <Building2 className="size-4" />}
              </div>
            )}
            <p className="truncate text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 sm:text-base group-hover:text-primary transition-colors">
              {storeName}
            </p>
          </Link>



          <div className="flex-1" aria-hidden />

          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 shrink-0 rounded-xl text-muted-foreground hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-foreground transition-all duration-200 group"
            aria-label="Notifications"
          >
            <Bell className="size-[18px] transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </Button>
        </div>
      </div>
    </header>
  );
}
