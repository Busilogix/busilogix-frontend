"use client";

import { Bell, Command, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MobileNav } from "./mobile-nav";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border/80 bg-background/80 px-4 shadow-sm shadow-slate-950/5 backdrop-blur-xl supports-backdrop-filter:bg-background/70 sm:px-6">
      <MobileNav />

      <div className="flex flex-1 items-center gap-3 lg:pl-0">
        <div className="relative hidden max-w-lg flex-1 sm:block">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search customers, invoices..."
            className="h-10 w-full rounded-xl border border-input bg-background/70 pr-20 pl-9 text-sm shadow-inner shadow-slate-950/5 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Search"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-1 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:flex">
            <Command className="size-3" aria-hidden /> K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search"
        >
          <Search className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Account menu"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                BL
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Account</span>
                <span className="text-xs font-normal text-muted-foreground">
                  user@busilogix.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
