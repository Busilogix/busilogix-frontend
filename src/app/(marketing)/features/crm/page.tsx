import {
  Users,
  FileStack,
  Mail,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Unified Client Database",
    description:
      "Keep all client contact info, billing addresses, tax IDs, and notes in one centralized directory — no more spreadsheet chaos.",
    icon: Users,
    color: "text-teal-600 bg-teal-50 border-teal-100",
  },
  {
    title: "Complete Billing History",
    description:
      "Instantly pull up any client's full transaction timeline — every invoice, payment, and outstanding balance in one view.",
    icon: FileStack,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Communication Tracking",
    description:
      "See exactly when invoices and reminders were sent, viewed, and actioned. Never wonder if a client received their bill again.",
    icon: Mail,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "End-to-End Data Privacy",
    description:
      "Client data is encrypted at rest and in transit. Strict access controls ensure only authorized users can view sensitive records.",
    icon: ShieldCheck,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
];

const stats = [
  { value: "360°", label: "View of every client relationship" },
  { value: "5s", label: "Average client lookup time" },
  { value: "0", label: "Duplicate data entries" },
];

export default function CrmPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/70 via-white to-white" />
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full mb-6">
                <Users className="size-3.5" /> Customer CRM
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
                Build lasting relationships with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                  every client
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                One unified directory for all your customers. Track contacts,
                billing history, and communication logs to turn every
                interaction into a stronger partnership.
              </p>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 transition-all rounded-xl flex items-center gap-2 w-fit"
                )}
              >
                Build your client list free
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

            {/* Right: Client Card Mockup */}
            <div className="relative space-y-3">
              {/* Client Detail Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5 flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg">
                    A
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-lg">Acme Corporation</p>
                    <p className="text-xs opacity-75">Customer since Jan 2025 · ID #CUS-0041</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-2">
                    <Mail className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Email</p>
                      <p className="text-slate-800 font-semibold">billing@acme.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Phone</p>
                      <p className="text-slate-800 font-semibold">+1 (555) 242-1100</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 col-span-2">
                    <MapPin className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Address</p>
                      <p className="text-slate-800 font-semibold">742 Evergreen Terrace, Springfield, IL 62701</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-5 py-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billing Summary</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total Billed", value: "$28,450" },
                      { label: "Total Paid", value: "$24,950" },
                      { label: "Outstanding", value: "$3,500" },
                    ].map((b) => (
                      <div key={b.label} className="bg-slate-50 rounded-lg p-2 text-center">
                        <p className="font-black text-slate-900 text-sm">{b.value}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{b.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity Strip */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-md px-5 py-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Invoice #INV-0024 sent", time: "2h ago", icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Payment reminder sent", time: "3d ago", icon: Mail, color: "text-amber-500" },
                    { label: "Invoice #INV-0021 paid", time: "5d ago", icon: TrendingUp, color: "text-blue-500" },
                  ].map((a) => (
                    <div key={a.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <a.icon className={cn("size-3.5", a.color)} />
                        <span className="text-slate-700 font-medium">{a.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{a.time}</span>
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
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything about every client</h2>
            <p className="mt-3 text-slate-500 text-sm leading-relaxed">A complete picture of each customer relationship — from first contact to latest invoice.</p>
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/15 via-slate-950 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">Know your customers, grow your business</h2>
          <p className="text-slate-300 text-base mb-8">Join Busilogix today — completely free during our Beta phase.</p>
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-13 px-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xl rounded-xl flex items-center gap-2 mx-auto w-fit")}>
            Start building your directory <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
