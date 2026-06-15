import {
  ArrowRight,
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
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#060812] pt-24 pb-0 lg:pt-16 lg:h-screen lg:min-h-[800px] lg:flex lg:flex-col lg:justify-between">
      {/* ── Ambient background ─────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 120% 60% at 60% -10%, rgba(99,102,241,0.45) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 0% 60%, rgba(139,92,246,0.20) 0%, transparent 55%), #060812",
        }}
      />
      {/* grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* glow orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[700px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 left-10 -z-10 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 w-full lg:flex-1 lg:flex lg:items-center lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center w-full">

          {/* ── LEFT: Copy ─────────────────────────────────────────────── */}
          <div className="text-left">

            {/* Beta badge */}
            <div className="mb-7 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[11px] font-bold text-indigo-300 tracking-wide backdrop-blur-sm">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-indigo-400" />
                </span>
                Open Beta · Free for Beta Members
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="ml-1 text-slate-500">Loved by early users</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-[72px] font-black tracking-tight text-white leading-[1.03]">
              The smarter way
              <br />
              to run{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(130deg, #a5b4fc 0%, #60a5fa 50%, #34d399 100%)",
                }}
              >
                your business
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-lg">
              Invoicing, CRM, inventory, and analytics — all connected in one
              clean workspace. No spreadsheets, no juggling apps.
            </p>

            {/* Trust pills */}
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { icon: FileText, label: "Smart Invoicing", color: "text-blue-400" },
                { icon: Users, label: "Customer CRM", color: "text-teal-400" },
                { icon: Package, label: "Inventory", color: "text-purple-400" },
                { icon: BarChart3, label: "Analytics", color: "text-rose-400" },
              ].map(({ icon: Icon, label, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"
                >
                  <Icon className={cn("size-3", color)} />
                  {label}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="group relative inline-flex h-14 items-center justify-center gap-2 px-8 text-sm font-bold text-white rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/40"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3b82f6 100%)",
                }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                Get Early Access
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-14 items-center justify-center gap-2 px-8 text-sm font-bold text-white/90 bg-white/8 border border-white/15 rounded-2xl hover:bg-white/12 hover:border-white/25 transition-all backdrop-blur-sm"
              >
                See what's inside
                <ChevronRight className="size-4" />
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-7 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-500" />
                No credit card required
              </span>
              <span className="w-px h-3 bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" />
                Setup in under 60 seconds
              </span>
              <span className="w-px h-3 bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <CheckCircle className="size-3.5 text-indigo-400" />
                Free during Open Beta
              </span>
            </div>
          </div>

          {/* ── RIGHT: App Mockup ──────────────────────────────────────── */}
          <div className="relative hidden lg:block">
            {/* outer glow */}
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[32px] blur-2xl -z-10" />

            {/* Browser frame */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden ring-1 ring-white/5">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/60" />
                  <div className="size-3 rounded-full bg-amber-500/60" />
                  <div className="size-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-3 bg-white/5 border border-white/8 rounded-md px-3 py-1 text-[10px] text-slate-500 text-center font-mono">
                  app.busilogix.com/dashboard
                </div>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              <div className="flex h-[500px]">
                {/* Sidebar */}
                <aside className="w-48 bg-black/40 border-r border-white/5 p-3.5 flex flex-col justify-between shrink-0">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 px-1">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-[11px] shadow-lg shadow-indigo-500/30">
                        B
                      </div>
                      <span className="text-[12px] font-bold text-white tracking-tight">Busilogix</span>
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
                            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[10px] font-medium transition-all",
                            active
                              ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/25"
                              : "text-slate-500 hover:text-slate-400"
                          )}
                        >
                          <Icon className={cn("size-3.5", active ? "text-indigo-400" : "text-slate-600")} />
                          {label}
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-[9px] font-bold text-white shadow">
                      JD
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-slate-300">John Doe</p>
                      <p className="text-[8px] text-slate-600">Admin · Pro</p>
                    </div>
                  </div>
                </aside>

                {/* Main panel */}
                <main className="flex-1 p-4 flex flex-col gap-3 overflow-hidden" style={{ background: "linear-gradient(180deg, #0f1220 0%, #0a0e1a 100%)" }}>
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-black text-white tracking-tight">Dashboard</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Overview · June 2026</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-lg px-2.5 py-1.5 text-[9px] text-slate-400">
                      <Zap className="size-2.5 text-indigo-400" />
                      All synced
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Revenue", value: "$12,480", sub: "+8.2%", color: "text-emerald-400", bg: "from-emerald-500/15 to-transparent", icon: TrendingUp },
                      { label: "Invoices", value: "6 Open", sub: "$2,900 due", color: "text-amber-400", bg: "from-amber-500/15 to-transparent", icon: FileText },
                      { label: "Products", value: "98 SKUs", sub: "2 low stock", color: "text-blue-400", bg: "from-blue-500/15 to-transparent", icon: Package },
                    ].map((k) => (
                      <div key={k.label} className="relative bg-white/5 border border-white/8 rounded-xl p-2.5 overflow-hidden">
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", k.bg)} />
                        <div className="relative z-10">
                          <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wide">{k.label}</p>
                          <p className="text-[12px] font-black text-white mt-1">{k.value}</p>
                          <span className={cn("text-[8px] font-semibold flex items-center gap-0.5 mt-0.5", k.color)}>
                            <k.icon className="size-2" />{k.sub}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white/4 border border-white/8 rounded-xl p-3 flex flex-col flex-1 min-h-0">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] font-bold text-slate-300">Revenue Trend</p>
                      <span className="text-[8px] text-slate-500 bg-white/5 rounded-full px-2 py-0.5">Last 6 months</span>
                    </div>
                    <div className="flex-1 w-full">
                      <svg viewBox="0 0 280 70" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <path d="M0 70 C30 62,50 50,80 42 S130 35,160 30 S210 42,240 22 S270 8,280 12 L280 70 Z" fill="url(#heroGrad)" />
                        <path d="M0 70 C30 62,50 50,80 42 S130 35,160 30 S210 42,240 22 S270 8,280 12" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                        {[[80,42],[160,30],[240,22],[280,12]].map(([cx,cy],i) => (
                          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#818cf8" />
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Recent invoices */}
                  <div className="bg-white/4 border border-white/8 rounded-xl p-3 space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Recent Invoices</p>
                    {[
                      { name: "Acme Corp", amount: "$1,850", status: "Paid", icon: CheckCircle, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
                      { name: "Globex Inc", amount: "$3,200", status: "Pending", icon: Clock, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                    ].map((t) => (
                      <div key={t.name} className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-200">{t.name}</p>
                          <p className="text-[8px] text-slate-500">{t.amount}</p>
                        </div>
                        <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold border", t.color)}>
                          <t.icon className="size-2" />{t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </main>
              </div>
            </div>

            {/* floating cards */}
            <div className="absolute -bottom-4 -left-8 bg-slate-900/90 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-2xl shadow-black/40 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="size-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white">Revenue up 24%</p>
                <p className="text-[9px] text-slate-500">vs last month</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-8 bg-slate-900/90 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-2xl shadow-black/40 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <FileText className="size-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white">Invoice sent</p>
                <p className="text-[9px] text-slate-500">PDF generated · just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
