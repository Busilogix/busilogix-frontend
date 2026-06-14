import {
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  FileText,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-24 pb-0 lg:pt-20 lg:h-screen lg:min-h-[760px] lg:flex lg:flex-col lg:justify-between border-b border-slate-900">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -5%, oklch(0.42 0.20 265 / 0.55) 0%, transparent 65%), oklch(0.08 0.03 255)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute top-16 left-1/3 -z-10 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-32 right-1/5 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 w-full lg:flex-1 lg:flex lg:items-center lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* LEFT: Copy */}
          <div className="text-left">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-1.5 text-[11px] font-bold text-indigo-300 tracking-wide backdrop-blur-sm">
                <Sparkles className="size-3 text-indigo-400" />
                Open Beta — Join Free Today
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
              The smarter way to run{" "}
              <span
                className="text-transparent bg-clip-text block"
                style={{
                  backgroundImage:
                    "linear-gradient(130deg, #a5b4fc 0%, #60a5fa 45%, #34d399 100%)",
                }}
              >
                your business
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-xl">
              Invoicing, CRM, inventory, and analytics — all connected in one
              clean workspace. No spreadsheets, no juggling apps.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: FileText, label: "Smart Invoicing" },
                { icon: Users, label: "Customer CRM" },
                { icon: Package, label: "Inventory" },
                { icon: BarChart3, label: "Analytics" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800/70 border border-slate-700/60 rounded-full px-3 py-1"
                >
                  <Icon className="size-3 text-indigo-400" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex h-13 items-center justify-center gap-2 px-7 text-sm font-bold text-white rounded-xl transition-all hover:-translate-y-0.5 shadow-2xl shadow-indigo-600/25"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                }}
              >
                Start for free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-13 items-center justify-center gap-2 px-7 text-sm font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-all shadow-lg"
              >
                See what's inside
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <p className="mt-4 text-[11px] text-slate-600">
              No credit card · Free forever for beta members
            </p>
          </div>

          {/* RIGHT: App Mockup */}
          <div className="relative hidden lg:block">
            {/* Glow halo */}
            <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-2xl scale-95 -z-10" />

            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/80">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-500/50" />
                  <div className="size-2.5 rounded-full bg-amber-500/50" />
                  <div className="size-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex-1 mx-3 bg-slate-800/60 rounded px-3 py-0.5 text-[9px] text-slate-500 text-center">
                  app.busilogix.com/dashboard
                </div>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              <div className="flex h-[480px]">
                {/* Sidebar */}
                <aside className="w-44 bg-slate-950 border-r border-slate-800/50 p-3 flex flex-col justify-between shrink-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1.5">
                      <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-[10px]">
                        B
                      </div>
                      <span className="text-[11px] font-bold text-white">Busilogix</span>
                    </div>
                    <nav className="space-y-0.5">
                      {[
                        { icon: LayoutDashboard, label: "Dashboard", active: true },
                        { icon: Users, label: "Customers", active: false },
                        { icon: FileText, label: "Invoices", active: false },
                        { icon: Package, label: "Products", active: false },
                        { icon: BarChart3, label: "Reports", active: false },
                      ].map(({ icon: Icon, label, active }) => (
                        <div
                          key={label}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] transition-all",
                            active
                              ? "bg-indigo-600/20 text-indigo-300 font-bold ring-1 ring-indigo-500/20"
                              : "text-slate-500"
                          )}
                        >
                          <Icon className={cn("size-3", active && "text-indigo-400")} />
                          {label}
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className="border-t border-slate-800/50 pt-2.5 flex items-center gap-2">
                    <div className="size-5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
                      JD
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-slate-300">John Doe</p>
                      <p className="text-[8px] text-slate-600">Admin</p>
                    </div>
                  </div>
                </aside>

                {/* Main panel */}
                <main className="flex-1 p-4 bg-slate-900/60 flex flex-col gap-3 overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">Dashboard</p>
                      <p className="text-[9px] text-slate-500">Overview · June 2026</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/40 rounded-lg px-2 py-1 text-[9px] text-slate-400">
                      <Zap className="size-2.5 text-indigo-400" />
                      Synced
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Revenue", value: "$12,480", sub: "+8.2%", color: "text-emerald-400", icon: TrendingUp },
                      { label: "Invoices", value: "6 Open", sub: "$2,900 due", color: "text-amber-400", icon: FileText },
                      { label: "Products", value: "98 SKUs", sub: "2 low stock", color: "text-blue-400", icon: Package },
                    ].map((k) => (
                      <div key={k.label} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-2.5">
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wide">{k.label}</p>
                        <p className="text-[11px] font-black text-white mt-1">{k.value}</p>
                        <span className={cn("text-[8px] font-semibold flex items-center gap-0.5 mt-0.5", k.color)}>
                          <k.icon className="size-2" />{k.sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3 flex flex-col flex-1 min-h-0">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[9px] font-bold text-slate-300">Revenue Trend</p>
                      <span className="text-[8px] text-slate-500">Last 6 months</span>
                    </div>
                    <div className="flex-1 w-full">
                      <svg viewBox="0 0 280 70" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <path d="M0 70 C30 62, 50 50, 80 42 S130 35, 160 30 S210 42, 240 22 S270 8, 280 12 L280 70 Z" fill="url(#grad1)" />
                        <path d="M0 70 C30 62, 50 50, 80 42 S130 35, 160 30 S210 42, 240 22 S270 8, 280 12" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                        {[[80, 42],[160, 30],[240, 22],[280, 12]].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="2" fill="#6366f1" />
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-3 space-y-2">
                    <p className="text-[9px] font-bold text-slate-300">Recent</p>
                    {[
                      { name: "Acme Corp", amount: "$1,850", status: "Paid", icon: CheckCircle, color: "text-emerald-400 bg-emerald-400/10" },
                      { name: "Globex Inc", amount: "$3,200", status: "Pending", icon: Clock, color: "text-amber-400 bg-amber-400/10" },
                    ].map((t) => (
                      <div key={t.name} className="flex items-center justify-between text-[9px]">
                        <div>
                          <p className="font-semibold text-slate-200">{t.name}</p>
                          <p className="text-slate-500">{t.amount}</p>
                        </div>
                        <span className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold", t.color)}>
                          <t.icon className="size-2" />{t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sharp division border at the bottom */}
    </section>
  );
}
