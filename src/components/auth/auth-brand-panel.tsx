import { BarChart3, FileText, Package, Users, Zap } from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";

const stats = [
  { value: "10K+", label: "Invoices processed" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "500+", label: "Businesses powered" },
];

const features = [
  {
    icon: FileText,
    title: "Smart invoicing",
    description:
      "Create, send, and track invoices with automatic totals and tax.",
  },
  {
    icon: Users,
    title: "Customer management",
    description: "Unified contact, billing history, and account ledger.",
  },
  {
    icon: Package,
    title: "Product & inventory",
    description:
      "Real-time stock levels, low-stock alerts, and adjustment logs.",
  },
  {
    icon: BarChart3,
    title: "Revenue analytics",
    description: "Live trends, outstanding payments, and performance reports.",
  },
];

export function AuthBrandPanel() {
  return (
    <div
      className="relative hidden flex-col overflow-hidden lg:flex"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.18 0.04 252) 0%, oklch(0.12 0.06 258) 50%, oklch(0.08 0.02 252) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.48 0.18 252 / 0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, oklch(0.55 0.20 200 / 0.20) 0%, transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
        <div className="inline-flex rounded-xl bg-white w-fit px-3 py-2 shadow-lg shadow-black/20">
          <AppLogo variant="panel" asLink={false} />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
              <Zap className="size-3 text-primary" />
              Intelligent Commerce Operations
            </div>
            <h2 className="max-w-sm text-3xl font-bold tracking-tight text-white xl:text-4xl">
              Run your entire business from one place
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Invoices, customers, products, inventory, and analytics — all
              connected in a single intelligent workspace.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                  <item.icon className="size-4 text-primary" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-white/55">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-3 text-center">
              <p className="text-xl font-bold tabular-nums text-white">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
