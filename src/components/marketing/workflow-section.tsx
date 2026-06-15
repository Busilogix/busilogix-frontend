import { Store, ShoppingBag, Send, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    name: "Setup Your Workspace",
    description: "Register your business details, logo, and tax credentials in minutes. Your workspace is ready instantly.",
    icon: Store,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    lineGradient: "from-indigo-500 to-blue-500",
  },
  {
    id: 2,
    name: "Add Your Products",
    description: "Import or manually add your inventory. Track prices, stock levels, and SKUs with ease.",
    icon: ShoppingBag,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    lineGradient: "from-blue-500 to-teal-500",
  },
  {
    id: 3,
    name: "Bill Your Customers",
    description: "Create professional invoices, add line items, apply discounts, and instantly generate PDFs.",
    icon: Send,
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/20",
    lineGradient: "from-teal-500 to-purple-500",
  },
  {
    id: 4,
    name: "Track Revenue",
    description: "Access real-time dashboards to see outstanding balances, paid invoices, and revenue analytics.",
    icon: TrendingUp,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    lineGradient: "from-purple-500 to-indigo-500",
  },
];

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="relative py-28 sm:py-36 overflow-hidden bg-[#060812]">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-indigo-300 mb-5">
            Streamlined Workflow
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.1]">
            From zero to operational{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(130deg, #a5b4fc 0%, #60a5fa 100%)" }}
            >
              in minutes
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            We've eliminated setup friction. Four simple steps to get your entire commercial operation running.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px" aria-hidden>
            <div className="h-full bg-gradient-to-r from-indigo-500/30 via-teal-500/30 to-purple-500/30" />
            <div className="absolute left-0 right-0 top-0 h-full bg-gradient-to-r from-indigo-500/20 via-teal-500/20 to-purple-500/20 blur-sm" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className="group relative flex flex-col items-center text-center bg-white/4 border border-white/8 hover:border-white/15 rounded-3xl p-7 transition-all duration-300 hover:bg-white/6 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`flex size-20 items-center justify-center rounded-2xl border ${step.bg} transition-transform duration-300 group-hover:scale-110`}>
                    <step.icon className={cn("size-8", step.color)} />
                  </div>
                  {/* Step badge */}
                  <div className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white text-[10px] font-black shadow-lg shadow-indigo-500/30 ring-2 ring-[#060812]">
                    {step.id}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-2.5">{step.name}</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Start your journey today
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// cn utility inline since this is a server component without the import
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
