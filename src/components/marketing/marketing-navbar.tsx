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
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    name: "Smart Invoicing",
    description: "Create, send & track invoices in seconds",
    href: "/features/invoicing",
    icon: FileText,
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    iconBgLight: "bg-blue-50 border-blue-100 text-blue-600",
  },
  {
    name: "Customer CRM",
    description: "Unified client directory & billing history",
    href: "/features/crm",
    icon: Users,
    gradient: "from-teal-500 to-emerald-500",
    iconBg: "bg-teal-500/10 border-teal-500/20 text-teal-500",
    iconBgLight: "bg-teal-50 border-teal-100 text-teal-600",
  },
  {
    name: "Inventory Management",
    description: "Real-time stock tracking & low-stock alerts",
    href: "/features/inventory",
    icon: Package,
    gradient: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-500",
    iconBgLight: "bg-purple-50 border-purple-100 text-purple-600",
  },
  {
    name: "Revenue Analytics",
    description: "Live charts & business performance reports",
    href: "/features/analytics",
    icon: BarChart3,
    gradient: "from-rose-500 to-orange-500",
    iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-500",
    iconBgLight: "bg-rose-50 border-rose-100 text-rose-600",
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
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close features dropdown when clicking outside
  useEffect(() => {
    if (!featuresOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-features-menu]")) setFeaturesOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [featuresOpen]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const isHome = pathname === "/";
  const lightNav = isHome && !scrolled;

  return (
    <>
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-2xl border-b border-slate-200/70 shadow-sm shadow-slate-900/[0.06]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 gap-4">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <AppLogo
              variant="navbar"
              asLink={false}
              className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className={cn(
                "font-black text-[16px] tracking-tight transition-colors duration-300",
                lightNav ? "text-white" : "text-slate-900"
              )}
            >
              Busilogix
            </span>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "relative px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200",
                isActive("/")
                  ? lightNav
                    ? "text-white bg-white/15"
                    : "text-slate-900 bg-slate-100"
                  : lightNav
                  ? "text-white/65 hover:text-white hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              Home
            </Link>

            {/* Features dropdown */}
            <div className="relative" data-features-menu>
              <button
                onClick={() => setFeaturesOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 outline-none",
                  pathname?.startsWith("/features")
                    ? lightNav
                      ? "text-white bg-white/15"
                      : "text-slate-900 bg-slate-100"
                    : lightNav
                    ? "text-white/65 hover:text-white hover:bg-white/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                Features
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    featuresOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Dropdown panel */}
              {featuresOpen && (
                <div className="absolute left-0 top-full mt-2 w-[460px] rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/12 overflow-hidden">
                  {/* Panel header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Features</p>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                      Beta · Free
                    </span>
                  </div>

                  {/* Feature links */}
                  <div className="p-3 grid grid-cols-2 gap-1.5">
                    {features.map((f) => {
                      const active = pathname === f.href;
                      return (
                        <Link
                          key={f.name}
                          href={f.href}
                          onClick={() => setFeaturesOpen(false)}
                          className={cn(
                            "group flex items-start gap-3 rounded-xl p-3 transition-all duration-150 relative overflow-hidden",
                            active
                              ? "bg-indigo-50/80 ring-1 ring-indigo-200/60"
                              : "hover:bg-slate-50"
                          )}
                        >
                          {/* Accent line */}
                          <div
                            className={cn(
                              "absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b transition-opacity duration-150",
                              f.gradient,
                              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}
                          />
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm transition-transform duration-200 group-hover:scale-105",
                              f.iconBgLight
                            )}
                          >
                            <f.icon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={cn("text-[12px] font-bold truncate", active ? "text-indigo-600" : "text-slate-800 group-hover:text-slate-900")}>
                                {f.name}
                              </p>
                              {active && (
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 rounded-full px-1.5 py-px shrink-0">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{f.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Footer CTA */}
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">All features included during beta</p>
                    <Link
                      href="/signup"
                      onClick={() => setFeaturesOpen(false)}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
                    >
                      Get started free
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200",
                  isActive(link.href)
                    ? lightNav
                      ? "text-white bg-white/15"
                      : "text-slate-900 bg-slate-100"
                    : lightNav
                    ? "text-white/65 hover:text-white hover:bg-white/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right CTAs ────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Beta pill */}
            <span
              className={cn(
                "hidden lg:inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-3 py-1.5 border transition-all duration-300",
                lightNav
                  ? "text-indigo-300 bg-indigo-500/12 border-indigo-500/25"
                  : "text-indigo-600 bg-indigo-50 border-indigo-100"
              )}
            >
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-indigo-400" />
              </span>
              Open Beta
            </span>

            {/* Login */}
            <Link
              href="/login"
              className={cn(
                "text-[13px] font-semibold px-4 py-2 rounded-xl transition-all duration-200",
                lightNav
                  ? "text-white/75 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              )}
            >
              Log in
            </Link>

            {/* Signup CTA */}
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-1.5 h-10 px-5 text-[12px] font-bold text-white rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #3b82f6 100%)" }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
              Get started
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ── Mobile menu button ────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              "md:hidden flex size-10 items-center justify-center rounded-xl border transition-all duration-200",
              lightNav
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-slate-200 bg-white shadow-sm text-slate-700 hover:bg-slate-50"
            )}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* ─── Mobile Drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] flex flex-col bg-white shadow-2xl shadow-black/20">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <AppLogo variant="navbar" asLink={false} className="shrink-0" />
                <span className="font-black text-[15px] text-slate-900 tracking-tight">Busilogix</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Nav content */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                  isActive("/") ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                Home
              </Link>

              {/* Features group */}
              <div className="pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Features</p>
                {features.map((f) => (
                  <Link
                    key={f.name}
                    href={f.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                      pathname === f.href
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span className={cn("flex size-8 items-center justify-center rounded-lg border", f.iconBgLight)}>
                      <f.icon className="size-4" />
                    </span>
                    {f.name}
                  </Link>
                ))}
              </div>

              {/* Company group */}
              <div className="pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Company</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                      isActive(link.href)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Drawer footer */}
            <div className="border-t border-slate-100 px-4 py-5 space-y-3">
              {/* Trust pills */}
              <div className="flex flex-wrap gap-2 pb-1">
                {[
                  { icon: Zap, label: "60s setup" },
                  { icon: Shield, label: "No card needed" },
                  { icon: TrendingUp, label: "Free in beta" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                    <Icon className="size-3 text-indigo-500" />
                    {label}
                  </span>
                ))}
              </div>

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="group flex w-full items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #3b82f6 100%)" }}
              >
                Get started free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
