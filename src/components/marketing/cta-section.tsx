import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-slate-950">
      {/* Layered glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-blue-500/8 blur-2xl pointer-events-none" />

      {/* Decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full border border-indigo-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full border border-indigo-500/8 pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-[11px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-3.5 py-1.5 mb-6">
          <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Open Beta — Founding Member Pricing Locked In
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          Your business deserves{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #a5b4fc 0%, #60a5fa 50%, #34d399 100%)",
            }}
          >
            better tools
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400">
          Smart invoicing, live inventory, customer CRM, and analytics — all in one clean workspace. No credit card, no setup fees.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-13 items-center gap-2 px-8 text-sm font-bold text-white rounded-xl shadow-2xl shadow-indigo-600/30 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }}
          >
            Start your free account
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex h-13 items-center gap-2 px-8 text-sm font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition-all w-full sm:w-auto justify-center backdrop-blur-sm"
          >
            <ExternalLink className="size-4 text-slate-300" />
            Learn about our vision
          </Link>
        </div>

        <p className="mt-5 text-[11px] text-slate-600">
          Free forever for accounts registered during Open Beta · Core features guaranteed
        </p>
      </div>
    </section>
  );
}
