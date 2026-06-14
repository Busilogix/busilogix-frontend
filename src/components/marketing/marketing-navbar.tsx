"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AppLogo } from "@/components/layout/app-logo";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  FileText,
  Package,
  Users,
  BarChart3,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const features = [
  {
    name: "Smart Invoicing",
    description: "Create, send & track invoices in seconds",
    href: "/features/invoicing",
    icon: FileText,
    accent: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    name: "Customer CRM",
    description: "Unified client directory & billing history",
    href: "/features/crm",
    icon: Users,
    accent: "from-teal-500 to-emerald-500",
    iconBg: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    name: "Inventory Management",
    description: "Real-time stock tracking & low-stock alerts",
    href: "/features/inventory",
    icon: Package,
    accent: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    name: "Revenue Analytics",
    description: "Live charts & business performance reports",
    href: "/features/analytics",
    icon: BarChart3,
    accent: "from-rose-500 to-orange-500",
    iconBg: "bg-rose-50 text-rose-600 border-rose-100",
  },
];

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const isHome = pathname === "/";
  // When transparent (over dark hero on home page) use white text; when scrolled or on other pages use dark text
  const lightNav = isHome && !scrolled;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinkClass = (path: string) =>
    cn(
      "relative text-[13px] font-semibold transition-all duration-200 px-1 py-0.5",
      isActive(path)
        ? lightNav ? "text-white" : "text-slate-900"
        : lightNav ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-slate-900"
    );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          (!isHome || scrolled)
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-900/5"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <AppLogo variant="navbar" asLink={false} className="w-8 h-8 shrink-0 transition-transform group-hover:scale-105 duration-200" />
            <span className={cn("font-extrabold text-[15px] tracking-tight transition-colors duration-200", lightNav ? "text-white" : "text-slate-900")}>
              Busilogix
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Home */}
            <Link href="/" className={cn(navLinkClass("/"), "px-3 py-1.5 rounded-lg", isActive("/") ? (lightNav ? "bg-white/10" : "bg-slate-100") : (lightNav ? "hover:bg-white/10" : "hover:bg-slate-50"))}>
              Home
              {isActive("/") && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
            </Link>

            {/* Features Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 text-[13px] font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg outline-none",
                  pathname?.startsWith("/features")
                    ? (lightNav ? "text-white bg-white/10" : "text-slate-900 bg-slate-100")
                    : (lightNav ? "text-white/70 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")
                )}
              >
                Features
                <ChevronDown className="size-3.5 mt-0.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-[400px] p-3 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/10 bg-white"
              >
                {/* Header */}
                <div className="px-2 pb-2 mb-1 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Features</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {features.map((f) => {
                    const active = pathname === f.href;
                    return (
                      <Link
                        key={f.name}
                        href={f.href}
                        onClick={() => setDropdownOpen(false)}
                        className={cn(
                          "group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 relative overflow-hidden",
                          active ? "bg-slate-50 ring-1 ring-slate-200" : "hover:bg-slate-50"
                        )}
                      >
                        {/* Left accent bar */}
                        <div className={cn("absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity", f.accent, active && "opacity-100")} />
                        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm", f.iconBg)}>
                          <f.icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={cn("text-xs font-bold truncate", active ? "text-primary" : "text-slate-800")}>{f.name}</p>
                            {active && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">Current</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{f.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {/* Footer CTA */}
                <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                  <Link
                    href="/signup"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Start using all features free</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Other links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  navLinkClass(link.href),
                  "px-3 py-1.5 rounded-lg",
                  isActive(link.href) ? (lightNav ? "bg-white/10" : "bg-slate-100") : (lightNav ? "hover:bg-white/10" : "hover:bg-slate-50")
                )}
              >
                {link.label}
                {isActive(link.href) && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
              </Link>
            ))}
          </nav>

          {/* Right: Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Beta badge */}
            <span className={cn(
              "hidden lg:inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-2.5 py-1 border transition-colors duration-200",
              lightNav
                ? "text-indigo-300 bg-indigo-500/15 border-indigo-500/25"
                : "text-indigo-600 bg-indigo-50 border-indigo-200/60"
            )}>
              <Sparkles className="size-2.5" />
              Open Beta
            </span>
            <Link
              href="/login"
              className={cn(
                "text-[13px] font-semibold transition-all duration-200 px-3 py-2 rounded-lg",
                lightNav
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 h-9 px-4 text-[12px] font-bold text-white rounded-lg shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }}
            >
              Start free
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              "md:hidden flex size-9 items-center justify-center rounded-xl border transition-colors",
              lightNav
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-slate-200/80 bg-white shadow-sm text-slate-600 hover:bg-slate-50"
            )}
            aria-label="Open menu"
          >
            <Menu className="size-4.5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <AppLogo variant="navbar" asLink={false} className="w-7 h-7 shrink-0" />
                <span className="font-extrabold text-[15px] text-slate-900 tracking-tight">Busilogix</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 hover:bg-slate-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  isActive("/") ? "bg-primary/8 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                Home
              </Link>

              {/* Features group */}
              <div className="pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Features</p>
                {features.map((f) => (
                  <Link
                    key={f.name}
                    href={f.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                      pathname === f.href ? "bg-primary/8 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className={cn("flex size-7 items-center justify-center rounded-lg border text-xs", f.iconBg)}>
                      <f.icon className="size-3.5" />
                    </div>
                    {f.name}
                  </Link>
                ))}
              </div>

              <div className="pt-3 space-y-0.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Company</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                      isActive(link.href) ? "bg-primary/8 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-100 px-4 py-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/60 rounded-full px-3 py-1.5 w-fit">
                <Sparkles className="size-3" />
                Open Beta — Free for early members
              </div>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-bold text-white shadow-md shadow-indigo-500/20"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }}
              >
                Start for free
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
