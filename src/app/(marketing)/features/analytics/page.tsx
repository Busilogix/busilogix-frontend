import {
  BarChart3,
  TrendingUp,
  PieChart,
  Download,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Live Revenue Dashboard",
    description:
      "Monitor total revenue, outstanding invoices, and top-selling products in real-time from a single, beautifully designed dashboard.",
    icon: BarChart3,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    title: "Month-over-Month Growth",
    description:
      "Compare performance across weeks, months, and quarters. Spot trends early and make data-driven decisions with confidence.",
    icon: TrendingUp,
    color: "text-orange-600 bg-orange-50 border-orange-100",
  },
  {
    title: "Revenue Segmentation",
    description:
      "Break down revenue by product category, individual customer, or time period. Know exactly what drives your business.",
    icon: PieChart,
    color: "text-pink-600 bg-pink-50 border-pink-100",
  },
  {
    title: "Instant Export & Reports",
    description:
      "Export financial summaries, invoice logs, and transaction histories in standard formats — ready to share with your accountant.",
    icon: Download,
    color: "text-violet-600 bg-violet-50 border-violet-100",
  },
];

const stats = [
  { value: "Real-time", label: "Revenue data updates" },
  { value: "100%", label: "Accuracy vs manual reporting" },
  { value: "1-click", label: "Export to PDF / CSV" },
];

const monthlyData = [
  { month: "Jan", revenue: 6200, h: 52 },
  { month: "Feb", revenue: 7100, h: 60 },
  { month: "Mar", revenue: 5800, h: 48 },
  { month: "Apr", revenue: 8900, h: 74 },
  { month: "May", revenue: 11200, h: 93 },
  { month: "Jun", revenue: 9600, h: 80 },
];

export default function AnalyticsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50/70 via-white to-white" />
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full mb-6">
                <BarChart3 className="size-3.5" /> Revenue Analytics
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                Understand your business with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">
                  live analytics
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Turn raw transaction data into actionable insights. Visual
                charts, revenue breakdowns, and growth tracking — updated in
                real time as you invoice.
              </p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 transition-all rounded-xl flex items-center gap-2 w-fit"
                )}
              >
                See your analytics free
                <ArrowRight className="size-4" />
              </Link>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Revenue Chart Mockup */}
            <div className="space-y-4">
              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Revenue (Jun)", value: "$9,600", delta: "+8.2%", up: true },
                  { label: "Invoices Sent", value: "47", delta: "+5", up: true },
                  { label: "Outstanding", value: "$3,200", delta: "-$800", up: false },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                    <p className="font-black text-slate-900 text-lg mt-1">{kpi.value}</p>
                    <span className={cn("flex items-center gap-0.5 text-[10px] font-bold mt-1", kpi.up ? "text-emerald-600" : "text-red-500")}>
                      {kpi.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {kpi.delta} vs last month
                    </span>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Monthly Revenue</p>
                    <p className="text-[10px] text-slate-400">January – June 2026</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="size-3" /> +22% YoY
                  </span>
                </div>

                {/* Bars */}
                <div className="flex items-end gap-2 h-28">
                  {monthlyData.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[8px] font-bold text-slate-500">
                        ${(m.revenue / 1000).toFixed(1)}k
                      </span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-rose-500 to-orange-400 transition-all"
                        style={{ height: `${m.h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  {monthlyData.map((m) => (
                    <div key={m.month} className="flex-1 text-center">
                      <span className="text-[9px] font-semibold text-slate-400">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top products */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md px-5 py-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Revenue Sources</p>
                <div className="space-y-2">
                  {[
                    { name: "Web Design Services", pct: 38, color: "bg-rose-500" },
                    { name: "Monthly Retainer", pct: 31, color: "bg-orange-400" },
                    { name: "Product Sales", pct: 21, color: "bg-amber-400" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-600 font-medium w-36 truncate">{p.name}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", p.color)} style={{ width: `${p.pct}%` }} />
                      </div>
                      <span className="text-slate-500 font-bold text-[10px] w-6">{p.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Data that drives decisions</h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">Every metric you need to run a smarter business, updated automatically as you work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg border mb-4", f.color)}>
                  <f.icon className="size-4.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/15 via-slate-950 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">Stop guessing, start knowing</h2>
          <p className="text-slate-300 text-base mb-8">Join Busilogix today — completely free during our Beta phase.</p>
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-13 px-8 bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-xl rounded-xl flex items-center gap-2 mx-auto w-fit")}>
            See your analytics free <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
