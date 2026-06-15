import { BarChart3, FileText, Package, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Smart Invoicing",
    description: "Create, send, and track professional invoices in seconds. Automatic tax calculation and real-time payment status.",
    icon: FileText,
    href: "/features/invoicing",
    accent: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    glow: "group-hover:shadow-blue-500/20",
    tag: "Most used",
  },
  {
    name: "Customer CRM",
    description: "Maintain a unified database of clients. View complete billing history, outstanding balances, and contact details.",
    icon: Users,
    href: "/features/crm",
    accent: "from-teal-500 to-emerald-500",
    iconBg: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    glow: "group-hover:shadow-teal-500/20",
    tag: null,
  },
  {
    name: "Inventory Management",
    description: "Real-time stock levels with low-stock alerts. Maintain a complete log of product adjustments and movements.",
    icon: Package,
    href: "/features/inventory",
    accent: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    glow: "group-hover:shadow-purple-500/20",
    tag: null,
  },
  {
    name: "Revenue Analytics",
    description: "Understand business performance with live trends, visual charts, and detailed reports on your sales data.",
    icon: BarChart3,
    href: "/features/analytics",
    accent: "from-rose-500 to-orange-500",
    iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    glow: "group-hover:shadow-rose-500/20",
    tag: "New",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 sm:py-36 overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-indigo-500/8 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 text-xs font-bold text-indigo-600 mb-5">
            <Sparkles className="size-3.5" />
            Everything you need
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.1]">
            A complete operating system
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }}>
              for your business
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-500">
            All the core modules you need to run a modern commerce operation — without the complexity of legacy ERPs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden ${feature.glow} hover:border-slate-300`}
            >
              {/* Top gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon + tag row */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`flex size-12 items-center justify-center rounded-2xl border ${feature.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="size-5" aria-hidden />
                  </div>
                  {feature.tag && (
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-2.5 py-1">
                      {feature.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2.5">{feature.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>

              {/* Learn more */}
              <div className="relative z-10 mt-7 flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                <span>Explore</span>
                <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
