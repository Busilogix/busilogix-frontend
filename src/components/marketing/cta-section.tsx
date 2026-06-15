import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36 bg-slate-50">
      {/* Light grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        {/* Main card */}
        <div
          className="relative rounded-[2.5rem] overflow-hidden p-12 sm:p-16 text-center"
          style={{
            background: "linear-gradient(145deg, #0f1225 0%, #0a0e1a 50%, #0d1128 100%)",
          }}
        >
          {/* Inner glows */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-[600px] rounded-full bg-indigo-600/30 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-40 w-[400px] rounded-full bg-blue-500/20 blur-[60px] pointer-events-none" />
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10 pointer-events-none" />

          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full border border-indigo-500/8 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full border border-indigo-500/12 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-8">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-indigo-400" />
              </span>
              Open Beta · Limited Spots Available
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] mb-5">
              Your business deserves{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #a5b4fc 0%, #60a5fa 50%, #34d399 100%)" }}
              >
                better tools
              </span>
            </h2>

            <p className="mx-auto max-w-xl text-lg text-slate-400 leading-relaxed mb-10">
              Smart invoicing, live inventory, customer CRM, and analytics — all in one clean workspace. Beta members get full access at no cost during our launch phase.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group relative inline-flex h-14 items-center gap-2 px-10 text-sm font-bold text-white rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/40 w-full sm:w-auto justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3b82f6 100%)" }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                Claim Your Beta Access
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-14 items-center gap-2 px-10 text-sm font-bold text-white/80 bg-white/8 border border-white/15 rounded-2xl hover:bg-white/12 hover:text-white transition-all w-full sm:w-auto justify-center backdrop-blur-sm"
              >
                <Zap className="size-4 text-slate-400" />
                Learn about our vision
              </Link>
            </div>

            <p className="mt-8 text-[12px] text-slate-600">
              Full access free for beta users · Core features guaranteed · No credit card
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
