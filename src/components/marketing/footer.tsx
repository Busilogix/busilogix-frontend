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
          
          {/* Social Links */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/company/busilogixhq/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Busilogix on LinkedIn"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm hover:border-[#0A66C2] hover:text-[#0A66C2] hover:shadow-md transition-all duration-200 group"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Follow us on LinkedIn
            </a>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} Busilogix, Inc. All rights reserved. Built for modern commerce.
          </p>
        </div>
      </div>
    </footer>
  );
}
