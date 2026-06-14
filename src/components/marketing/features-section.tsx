import { BarChart3, FileText, Package, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Smart Invoicing",
    description: "Create, send, and track professional invoices in seconds. Automatic tax calculation and payment status tracking.",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50/80 dark:bg-blue-950/20",
    ringColor: "ring-blue-100 dark:ring-blue-900/30",
    href: "/features/invoicing",
    gradient: "from-blue-500/10 to-indigo-500/5",
  },
  {
    name: "Customer CRM",
    description: "Maintain a unified database of your clients. View complete billing history, outstanding balances, and contact details.",
    icon: Users,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50/80 dark:bg-teal-950/20",
    ringColor: "ring-teal-100 dark:ring-teal-900/30",
    href: "/features/crm",
    gradient: "from-teal-500/10 to-emerald-500/5",
  },
  {
    name: "Inventory Management",
    description: "Keep track of your stock levels in real-time. Get low-stock alerts and maintain a complete log of product adjustments.",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50/80 dark:bg-purple-950/20",
    ringColor: "ring-purple-100 dark:ring-purple-900/30",
    href: "/features/inventory",
    gradient: "from-purple-500/10 to-pink-500/5",
  },
  {
    name: "Revenue Analytics",
    description: "Understand your business performance with live trends, visual charts, and detailed reports on your sales data.",
    icon: BarChart3,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50/80 dark:bg-rose-950/20",
    ringColor: "ring-rose-100 dark:ring-rose-900/30",
    href: "/features/analytics",
    gradient: "from-rose-500/10 to-orange-500/5",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-slate-50/60 relative overflow-hidden">
      {/* Decorative subtle background grid */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A complete operating system for your business
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Busilogix provides all the core modules required to run a modern commerce operation smoothly, without the bloated complexity of legacy ERPs.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-350 overflow-hidden relative"
              >
                {/* Diagonal card background hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 group-hover:scale-105 transition-transform duration-300">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${feature.bgColor} ring-1 ${feature.ringColor}`}>
                      <feature.icon className={`size-4.5 ${feature.color}`} aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 mt-2">
                  <span>Learn more</span>
                  <ArrowRight className="ml-1 size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
