"use client";

import Link from "next/link";
import { ArrowLeft, Scale, UserCheck, ShieldCheck, Receipt, XCircle, AlertTriangle, Mail } from "lucide-react";

import { useAuth } from "@/context/auth-provider";
import { AppLogo } from "@/components/layout/app-logo";

export function TermsContent() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const sections = [
    { id: "registration", label: "1. Account Registration", icon: UserCheck, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { id: "acceptable-use", label: "2. Acceptable Use", icon: ShieldCheck, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { id: "invoicing", label: "3. Invoicing & Payments", icon: Receipt, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { id: "termination", label: "4. Termination", icon: XCircle, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
    { id: "disclaimer", label: "5. Disclaimer", icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: "contact", label: "6. Contact Us", icon: Mail, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/40 backdrop-blur-md">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppLogo variant="navbar" asLink priority={false} className="w-8 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
              Busilogix
            </span>
          </div>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-3 py-1.5 bg-white dark:bg-slate-900 shadow-sm animate-fade-in"
          >
            <ArrowLeft className="size-3.5" />
            {isAuthenticated ? "Back to Dashboard" : "Back to Login"}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-transparent border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 mb-10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] dark:shadow-none flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary shrink-0 shadow-inner">
            <Scale className="size-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: June 11, 2026 &middot; 5 min read
            </p>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 items-start">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">
              Table of Contents
            </h2>
            <nav className="flex flex-col gap-1.5 border-l border-slate-200/60 dark:border-slate-800/60 ml-3">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all duration-150 py-1.5 pl-4 -ml-px border-l border-transparent hover:border-primary/50 block"
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Terms Text Sections */}
          <div className="space-y-8">
            {/* Intro card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Welcome to Busilogix. These Terms of Service (&quot;Terms&quot;) govern your access to
                and use of the Busilogix invoicing and business operations platform. Please read them
                carefully before activating or using your workspace.
              </p>
            </div>

            {/* Section 1 — Account Registration */}
            <section
              id="registration"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                  <UserCheck className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  1. Account Registration and Workspace
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  To access our services, you must register for an account and configure a business
                  workspace. You agree to provide accurate and complete details. You are fully responsible
                  for maintaining account and password confidentiality and for all operations performed
                  under your business workspace credentials.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Your Responsibility</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Maintain accurate profile details and secure login credentials at all times.</p>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Workspace Scope</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">All activity under your workspace is attributed to your business account.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 — Acceptable Use */}
            <section
              id="acceptable-use"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                  <ShieldCheck className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  2. Acceptable Use
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  You agree to use our platform in compliance with applicable local, state, and international
                  laws. You must not:
                </p>
                <ul className="list-none space-y-2.5">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">✕</span>
                    <span>Use the billing system to generate fraudulent, unauthorized, or misleading invoices.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">✕</span>
                    <span>Upload malicious code, scripts, or attempt to override system controls.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">✕</span>
                    <span>Attempt unauthorized entry to other business workspaces or databases.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 — Invoicing, Payments & Taxes */}
            <section
              id="invoicing"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                  <Receipt className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  3. Invoicing, Payments, and Taxes
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Busilogix provides dynamic invoice generation and operations tools. You acknowledge
                  that you are solely responsible for ensuring the accuracy of all invoices generated
                  through the service, calculating appropriate taxes, and verifying client billing details.
                </p>
                <div className="border border-amber-200/60 dark:border-amber-500/20 rounded-xl p-4 bg-amber-50/50 dark:bg-amber-500/5">
                  <p className="font-semibold text-xs text-amber-800 dark:text-amber-300 mb-1">Important Notice</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
                    Busilogix does not function as a payment collector or directly audit financial transactions
                    unless explicitly linked to checkout endpoints.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 — Termination */}
            <section
              id="termination"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                  <XCircle className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  4. Termination
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  We reserve the right to suspend or terminate your workspace access at our discretion,
                  without notice, for conduct that violates these Terms or is harmful to other platform users
                  or our operational infrastructure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Suspension</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Temporary restriction of services pending investigation of a policy violation.</p>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Termination</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Permanent closure of workspace and removal of associated business data.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 — Disclaimer of Warranties */}
            <section
              id="disclaimer"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                  <AlertTriangle className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  5. Disclaimer of Warranties
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  The platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
                  any kind, either express or implied. Busilogix does not guarantee uninterrupted system
                  access or error-free operations under all hardware configurations.
                </p>
              </div>
            </section>

            {/* Section 6 — Contact Us */}
            <section
              id="contact"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20 shrink-0">
                  <Mail className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  6. Contact Us
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  If you have any questions or clarifications regarding these Terms of Service, please
                  contact us at:
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                  support@busilogix.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-muted-foreground bg-white/40 dark:bg-slate-900/10">
        &copy; {currentYear} Busilogix. All rights reserved.
      </footer>
    </div>
  );
}
