"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AccountMenu } from "./account-menu";
import { SidebarHeader } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "lg:hidden",
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full w-72 flex-col overflow-hidden border-r border-sidebar-border/70 bg-[linear-gradient(180deg,oklch(0.99_0.01_250)_0%,oklch(0.975_0.012_252)_55%,oklch(0.96_0.018_252)_100%)] p-0 text-sidebar-foreground"
      >
        <SheetHeader className="shrink-0 p-0 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarHeader />
        </SheetHeader>

        <SidebarNav
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
          onNavigate={() => setOpen(false)}
        />

        <div className="relative z-20 shrink-0 overflow-visible border-t border-sidebar-border/60 px-3 py-3">
          <AccountMenu />
        </div>
      </SheetContent>
    </Sheet>
  );
}
