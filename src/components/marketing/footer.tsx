import { AppLogo } from "@/components/layout/app-logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="flex flex-col items-center">
          <AppLogo variant="auth" className="w-[120px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          
          <nav className="mt-10 flex justify-center gap-x-8 gap-y-4 text-sm leading-6 text-slate-500 flex-wrap" aria-label="Footer">
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </nav>
          
          <p className="mt-10 text-center text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} Busilogix, Inc. All rights reserved. Built for modern commerce.
          </p>
        </div>
      </div>
    </footer>
  );
}
