import {
  FileText,
  Calculator,
  Bell,
  Palette,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Download,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Automated Tax Calculation",
    description:
      "Stop calculating percentages manually. Busilogix automatically applies the correct tax rates based on your configured jurisdiction — GST, VAT, or custom rates.",
    icon: Calculator,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "One-Click PDF Generation",
    description:
      "Generate pixel-perfect, professionally branded PDF invoices with a single click and send them directly to your client's inbox without ever leaving the platform.",
    icon: Download,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    title: "Smart Payment Reminders",
    description:
      "Set up automated nudges for overdue invoices. Let the system handle the follow-ups — configure when and how often reminder emails go out.",
    icon: Bell,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Custom Branding & Templates",
    description:
      "Add your logo, brand colors, and payment instructions. Every invoice you send reinforces your professional identity, not generic software templates.",
    icon: Palette,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
  {
    title: "Real-time Payment Tracking",
    description:
      "See at a glance which invoices are paid, pending, or overdue. Your cash flow position is always visible from the dashboard.",
    icon: Zap,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Secure Data Storage",
    description:
      "Every invoice is encrypted and backed up. Your billing history is always accessible, secure, and audit-ready.",
    icon: Shield,
    color: "text-slate-600 bg-slate-50 border-slate-100",
  },
];

const stats = [
  { value: "3x", label: "Faster invoice creation vs manual" },
  { value: "94%", label: "On-time payment rate with reminders" },
  { value: "100%", label: "Tax accuracy with auto-calculation" },
];

export default function SmartInvoicingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/70 via-white to-white" />
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
                <FileText className="size-3.5" /> Smart Invoicing
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                Get paid faster with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  professional invoices
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Create, send, and track invoices in seconds. Automated tax
                calculations, real-time payment status, and smart reminders —
                all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 px-7 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all rounded-xl flex items-center gap-2"
                  )}
                >
                  Start invoicing free
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              {/* Stats row */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CSS Invoice Mockup */}
            <div className="relative">
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
                {/* Invoice header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Invoice</div>
                      <div className="text-2xl font-black">#INV-0024</div>
                    </div>
                    <div className="text-right text-xs opacity-80">
                      <div className="font-semibold">Acme Corp</div>
                      <div>Issued: Jun 10, 2026</div>
                      <div>Due: Jun 25, 2026</div>
                    </div>
                  </div>
                </div>

                {/* Invoice body */}
                <div className="p-6 space-y-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest grid grid-cols-12 gap-2 pb-2 border-b border-slate-100">
                    <span className="col-span-6">Item</span>
                    <span className="col-span-2 text-right">Qty</span>
                    <span className="col-span-2 text-right">Rate</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  {[
                    { name: "Web Design Services", qty: 1, rate: "$1,200", total: "$1,200" },
                    { name: "Monthly Maintenance", qty: 3, rate: "$150", total: "$450" },
                    { name: "Domain & Hosting", qty: 1, rate: "$80", total: "$80" },
                  ].map((item) => (
                    <div key={item.name} className="grid grid-cols-12 gap-2 text-xs text-slate-700">
                      <span className="col-span-6 font-medium">{item.name}</span>
                      <span className="col-span-2 text-right text-slate-500">{item.qty}</span>
                      <span className="col-span-2 text-right text-slate-500">{item.rate}</span>
                      <span className="col-span-2 text-right font-semibold">{item.total}</span>
                    </div>
                  ))}

                  <div className="border-t border-slate-100 pt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>$1,730.00</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>GST (18%)</span>
                      <span>$311.40</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-900 text-sm pt-1">
                      <span>Total Due</span>
                      <span>$2,041.40</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                      <Clock className="size-3" /> Pending Payment
                    </span>
                    <button className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      Send Reminder
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-slate-200 shadow-lg px-4 py-3 flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Invoice Paid</p>
                  <p className="text-[10px] text-slate-500">INV-0023 · $4,500</p>
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
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything built in</h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">No add-ons, no integrations needed — every invoicing tool you need is included from day one.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
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

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                From draft to paid in under 2 minutes
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Pick a client", desc: "Select from your CRM directory — their address, tax ID, and contact details are auto-filled." },
                  { step: "02", title: "Add line items", desc: "Select products from your catalog or type custom services. Quantity, rate, and totals update instantly." },
                  { step: "03", title: "Send or download", desc: "Email the invoice directly or download a branded PDF. Track when it's opened, paid, or overdue." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-8 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Invoice Activity</p>
              {[
                { label: "Draft created", time: "10:02 AM", done: true },
                { label: "Tax auto-calculated (GST 18%)", time: "10:02 AM", done: true },
                { label: "PDF generated", time: "10:03 AM", done: true },
                { label: "Sent to client@acme.com", time: "10:03 AM", done: true },
                { label: "Opened by client", time: "10:15 AM", done: true },
                { label: "Payment received", time: "Awaiting...", done: false },
              ].map((e) => (
                <div key={e.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("size-1.5 rounded-full", e.done ? "bg-emerald-500" : "bg-slate-300")} />
                    <span className={e.done ? "text-slate-700 font-medium" : "text-slate-400"}>{e.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{e.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/15 via-slate-950 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">Ready to get paid faster?</h2>
          <p className="text-slate-300 text-base mb-8">Join Busilogix today — completely free during our Beta phase.</p>
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-13 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl rounded-xl flex items-center gap-2 mx-auto w-fit")}>
            Start invoicing for free <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
