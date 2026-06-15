import Link from "next/link";

import { AppLogo } from "./app-logo";
import { shellContentClassName } from "./shell-content";
import { cn } from "@/lib/utils";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pb-6 pt-2 sm:pb-8 shrink-0 transition-all duration-300">
      <div className={cn(shellContentClassName)}>
        <div className="rounded-2xl border px-4 py-6 sm:px-8 sm:py-8 bg-white/75 dark:bg-slate-900/75 border-slate-200/50 dark:border-slate-800/40 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04),0_10px_20px_-12px_rgba(0,0,0,0.06)] dark:shadow-none backdrop-blur-sm transition-all duration-300">
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

            {/* Quick links columns wrapper to lay out side-by-side on mobile */}
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
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
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-slate-200/50 dark:bg-slate-800/40" />

          {/* Bottom footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p className="text-center sm:text-left">
              &copy; {currentYear} Busilogix. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <a
                href="https://www.linkedin.com/company/busilogixhq/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Busilogix on LinkedIn"
                className="inline-flex items-center gap-1.5 hover:text-[#0A66C2] transition-colors duration-150"
              >
                <svg
                  className="h-3.5 w-3.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
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
