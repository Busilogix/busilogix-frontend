import Link from "next/link";

import { AppLogo } from "./app-logo";
import { shellContentClassName } from "./shell-content";
import { cn } from "@/lib/utils";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pb-6 pt-2 sm:pb-8 shrink-0 transition-all duration-300">
      <div className={cn(shellContentClassName)}>
        <div className="rounded-2xl border px-6 py-8 sm:px-8 bg-white/75 dark:bg-slate-900/75 border-slate-200/50 dark:border-slate-800/40 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04),0_10px_20px_-12px_rgba(0,0,0,0.06)] dark:shadow-none backdrop-blur-sm transition-all duration-300">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
            {/* Brand section */}
            <div className="flex flex-col space-y-4 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <AppLogo variant="navbar" asLink priority={false} className="w-8 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                  Busilogix
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
                Intelligent commerce operations platform. Empowering modern teams
                with professional invoicing, real-time inventory management, and
                deep business analytics.
              </p>
              {/* System Status badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 w-fit">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                All systems operational
              </div>
            </div>

            {/* Quick links columns */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                Workspace
              </h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Customers", href: "/customers" },
                  { label: "Invoices", href: "/invoices" },
                  { label: "Products", href: "/products" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-150 flex items-center gap-1 group"
                    >
                      <span className="h-1 w-0 bg-primary rounded-full transition-all duration-200 group-hover:w-1"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                Operations
              </h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Inventory Logs", href: "/inventory" },
                  { label: "Business Reports", href: "/reports" },
                  { label: "Settings", href: "/settings" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-150 flex items-center gap-1 group"
                    >
                      <span className="h-1 w-0 bg-primary rounded-full transition-all duration-200 group-hover:w-1"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-slate-200/50 dark:bg-slate-800/40" />

          {/* Bottom footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              &copy; {currentYear} Busilogix. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="flex items-center gap-1">
                Made with <span className="text-rose-500 animate-pulse">❤️</span> for modern commerce
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
