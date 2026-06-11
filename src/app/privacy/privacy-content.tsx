"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Database, Eye, Lock, Mail } from "lucide-react";

import { useAuth } from "@/context/auth-provider";
import { AppLogo } from "@/components/layout/app-logo";
import { cn } from "@/lib/utils";

export function PrivacyContent() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const sections = [
    { id: "collection", label: "1. Information We Collect", icon: Database, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { id: "usage", label: "2. How We Use Information", icon: Eye, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { id: "security", label: "3. Data Security", icon: Lock, color: "text-violet-500 bg-violet-500/10 border-violet-500/20" },
    { id: "contact", label: "4. Contact Us", icon: Mail, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
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
        <div className="bg-gradient-to-r from-primary/10 via-indigo-500/5 to-transparent border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 mb-10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] dark:shadow-none flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary shrink-0 shadow-inner">
            <Shield className="size-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: June 11, 2026 &middot; 4 min read
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

          {/* Policy Text Columns */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Welcome to Busilogix. We are committed to protecting your personal data and your
                privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you use our commerce management platform. Please take a moment
                to read through the document.
              </p>
            </div>

            {/* Section 1 */}
            <section
              id="collection"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                  <Database className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  1. Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  We collect information that you provide directly to us when registering for an
                  account, setting up your store details, creating invoices, and adding products or
                  customer records. This includes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Personal Info</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Full name, email address, password, and mobile contacts.</p>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Business details</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Company name, address, tax registration tags, and logos.</p>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">Operational data</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Customer records, invoice pricing, and transaction history.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section
              id="usage"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                  <Eye className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  2. How We Use Your Information
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  We process and use your records only to operate, maintain, and provide the invoicing and business management platform capabilities. Specifically to:
                </p>
                <ul className="list-none space-y-2.5">
                  <li className="flex items-start gap-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">✓</span>
                    <span>Process, format, and generate customer invoices dynamically in real-time.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">✓</span>
                    <span>Track product stock levels, sales velocity logs, and revenue metrics.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px]">✓</span>
                    <span>Configure Tax rules and remember preferences to speed up cashier workflows.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section
              id="security"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/20 shrink-0">
                  <Lock className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  3. Data Security and Retention
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  We employ standard encryption algorithms and server security configurations to secure your business databases. Invoices and business analytics are stored securely and are only accessible by users associated with your workspace team.
                </p>
                <p>
                  We retain your information as long as your workspace account is active. If you choose to close your account, we delete or anonymize your data unless legally required to retain transaction details for financial audit records.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section
              id="contact"
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700/60 transition-all duration-300 scroll-mt-24"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20 shrink-0">
                  <Mail className="size-4.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  4. Contact Us
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  If you have questions, corrections, or requests regarding this policy or how we handle your company logs, please email our support desk:
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
