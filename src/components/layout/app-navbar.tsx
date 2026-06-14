"use client";

import { useState } from "react";
import { Bell, Building2, CheckCircle2, LifeBuoy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import { MobileNav } from "./mobile-nav";
import {
  shellContentClassName,
  shellHeaderSurfaceClassName,
} from "./shell-content";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SupportModal } from "../support/support-modal";

export function AppNavbar() {
  const { store } = useStore();
  const pathname = usePathname();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const storeName = store?.name || "";
  const logoUrl = store?.logoUrl;

  const getPageTitle = (path: string) => {
    if (!path) return "";
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/customers/new")) return "New Customer";
    if (path.includes("/customers/") && path.endsWith("/edit")) return "Edit Customer";
    if (path.startsWith("/customers/")) return "Customer Details";
    if (path.startsWith("/customers")) return "Customers";
    if (path.startsWith("/invoices/new")) return "New Invoice";
    if (path.includes("/invoices/") && path.endsWith("/edit")) return "Edit Invoice";
    if (path.startsWith("/invoices/")) return "Invoice Details";
    if (path.startsWith("/invoices")) return "Invoices";
    if (path.includes("/products/") && path.endsWith("/edit")) return "Edit Product";
    if (path.startsWith("/products")) return "Products";
    if (path.startsWith("/inventory")) return "Inventory";
    if (path.startsWith("/reports")) return "Reports";
    if (path.startsWith("/settings")) return "Settings";
    if (path.startsWith("/store-setup")) return "Store Setup";
    return "";
  };

  const pageTitle = getPageTitle(pathname || "");

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

          {pageTitle && (
            <div className="flex items-center gap-2 border-l pl-3 border-slate-200/60 dark:border-slate-800/60 ml-1 select-none">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-500 dark:text-slate-400">
                {pageTitle}
              </span>
            </div>
          )}



          <div className="flex-1" aria-hidden />

          <Button
            variant="default"
            className="h-9 w-9 sm:w-auto p-0 sm:px-3 gap-0 sm:gap-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => setIsSupportModalOpen(true)}
            aria-label="Contact Support"
          >
            <LifeBuoy className="size-4" />
            <span className="hidden sm:inline font-semibold text-xs tracking-wide">Support</span>
          </Button>

          <Popover>
            <PopoverTrigger
              className="relative size-9 shrink-0 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-foreground transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Notifications"
            >
              <Bell className="size-[18px] transition-transform duration-300 group-hover:rotate-12" />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-80 p-0 shadow-lg rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="font-semibold text-sm">Notifications</span>
              </div>
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                  <Bell className="size-6 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No new notifications
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  When you have notifications, they will appear here.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <SupportModal
        open={isSupportModalOpen}
        onOpenChange={setIsSupportModalOpen}
      />
    </header>
  );
}
