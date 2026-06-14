import {
  Package,
  AlertTriangle,
  History,
  Zap,
  ArrowRight,
  TrendingDown,
  BarChart3,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Real-time Stock Sync",
    description:
      "Every invoice automatically deducts stock. Your inventory counts are always accurate across all products, no manual entry needed.",
    icon: RefreshCcw,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    title: "Low Stock Alerts",
    description:
      "Set restock thresholds per product. Get notified before you run out so you can order in time and never miss a sale.",
    icon: AlertTriangle,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Immutable Adjustment Logs",
    description:
      "Every stock change — new arrivals, sales, returns, write-offs — is recorded with a timestamp and reason for full traceability.",
    icon: History,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    title: "Instant SKU Lookup",
    description:
      "Type or scan a SKU to instantly load a product's name, price, tax category, and current stock when creating invoices.",
    icon: Zap,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

const stats = [
  { value: "100%", label: "Automatic stock updates on invoicing" },
  { value: "0", label: "Manual data-entry errors" },
  { value: "3x", label: "Faster product lookups with SKU search" },
];

const sampleProducts = [
  { name: "Mechanical Keyboard", sku: "SKU-0021", stock: 142, status: "In Stock", bar: 80 },
  { name: "USB-C Hub 7-Port", sku: "SKU-0048", stock: 18, status: "Low Stock", bar: 15 },
  { name: "27\" Monitor Stand", sku: "SKU-0063", stock: 0, status: "Out of Stock", bar: 0 },
  { name: "Wireless Mouse", sku: "SKU-0077", stock: 230, status: "In Stock", bar: 95 },
];

export default function InventoryPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50/70 via-white to-white" />
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full mb-6">
                <Package className="size-3.5" /> Inventory Management
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                Never run out of stock{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  with live inventory sync
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Real-time stock tracking, automated deductions on invoicing, low
                stock alerts, and a complete adjustment log — all in one place.
              </p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all rounded-xl flex items-center gap-2 w-fit"
                )}
              >
                Start tracking stock free
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

            {/* Right: Inventory Table Mockup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">Inventory Overview</p>
                  <p className="text-purple-200 text-xs">142 SKUs tracked · Live sync</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-white/10 px-2.5 py-1.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>
              <div className="p-5">
                {/* Summary row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "In Stock", value: "126", color: "text-emerald-600 bg-emerald-50" },
                    { label: "Low Stock", value: "13", color: "text-amber-600 bg-amber-50" },
                    { label: "Out of Stock", value: "3", color: "text-red-600 bg-red-50" },
                  ].map((c) => (
                    <div key={c.label} className={cn("rounded-xl p-3 text-center", c.color)}>
                      <p className="font-black text-lg">{c.value}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5">{c.label}</p>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                    <span className="col-span-5">Product</span>
                    <span className="col-span-2 text-right">Stock</span>
                    <span className="col-span-3">Level</span>
                    <span className="col-span-2 text-right">Status</span>
                  </div>
                  {sampleProducts.map((p) => (
                    <div key={p.sku} className="grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-5">
                        <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                        <p className="text-[9px] text-slate-400">{p.sku}</p>
                      </div>
                      <span className="col-span-2 text-right font-bold text-slate-700">{p.stock}</span>
                      <div className="col-span-3">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              p.bar > 50 ? "bg-emerald-500" : p.bar > 0 ? "bg-amber-400" : "bg-red-400"
                            )}
                            style={{ width: `${p.bar}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={cn(
                          "col-span-2 text-right text-[9px] font-bold",
                          p.status === "In Stock" ? "text-emerald-600" : p.status === "Low Stock" ? "text-amber-600" : "text-red-500"
                        )}
                      >
                        {p.status}
                      </span>
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
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Full inventory control, zero effort</h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">From restock alerts to full audit trails, every tool you need is automatically managed.</p>
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

      {/* How it auto-deducts */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                Automatic stock deduction on every invoice
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                When you issue an invoice, Busilogix automatically deducts the sold quantities from your stock. No separate steps, no sync delays — your inventory is always real-time accurate.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Invoice created with 5× Wireless Mouse", icon: "🧾" },
                  { label: "Stock for Wireless Mouse: 230 → 225", icon: "📦" },
                  { label: "Audit log entry added automatically", icon: "📋" },
                  { label: "Low stock alert sent if below threshold", icon: "🔔" },
                ].map((e) => (
                  <div key={e.label} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <span className="text-lg">{e.icon}</span>
                    {e.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Stock Adjustments</p>
              {[
                { name: "Wireless Mouse", change: "-5", reason: "Invoice #INV-0024", color: "text-red-500" },
                { name: "USB-C Hub", change: "+50", reason: "Restock batch received", color: "text-emerald-500" },
                { name: "Keyboard", change: "-2", reason: "Invoice #INV-0023", color: "text-red-500" },
                { name: "Monitor Stand", change: "+20", reason: "New supplier delivery", color: "text-emerald-500" },
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3 text-xs shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-800">{row.name}</p>
                    <p className="text-slate-400 text-[10px]">{row.reason}</p>
                  </div>
                  <span className={cn("font-black text-sm", row.color)}>{row.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/15 via-slate-950 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">Always know what you have in stock</h2>
          <p className="text-slate-300 text-base mb-8">Join Busilogix today — completely free during our Beta phase.</p>
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-13 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl rounded-xl flex items-center gap-2 mx-auto w-fit")}>
            Start managing inventory free <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
