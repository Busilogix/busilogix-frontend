import { Check, HelpCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is it free for beta users?",
    a: "Yes. All accounts registered during our Open Beta period get full access to core modules (Smart Invoicing, Customer CRM, Inventory Management) at no cost for the duration of the beta.",
  },
  {
    q: "What are the limitations during beta?",
    a: "None. You have full access to create unlimited invoices, register unlimited customers, track unlimited products, and explore live reports.",
  },
  {
    q: "Will there be paid plans in the future?",
    a: "Yes, we will introduce premium add-ons and enterprise tiers (e.g. multi-user workspaces, API access, integrations) down the road, but the core features will remain free for early adopters.",
  },
];

export default function PricingPage() {
  const features = [
    "Unlimited invoices & clients",
    "Unlimited products & SKUs",
    "Real-time revenue reports",
    "Automatic tax calculations",
    "Customer contact history",
    "Priority email support",
  ];

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] pt-32 pb-24 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white" />
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            No hidden fees, no complicated multi-tiered plans. Just pure value to run your commerce business.
          </p>
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto mb-20">
          {/* Active Beta Tier Card */}
          <div className="relative rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                  Open Beta Tier
                </span>
                <span className="text-xs font-bold text-slate-400">Limited time offer</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Early Adopter Plan</h3>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                Join our beta program today. Help us shape the platform and lock in key benefits forever.
              </p>
              
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-black">$0</span>
                <span className="text-sm font-semibold text-slate-400">/ during beta</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-xs text-slate-300">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-x-3 items-center">
                    <Check className="h-4 w-4 flex-none text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primary/95 hover:to-indigo-600/95 shadow-lg shadow-indigo-500/20 rounded-xl font-bold"
                )}
              >
                Create free account
              </Link>
              <p className="mt-4 text-[10px] text-slate-500 text-center leading-relaxed">
                *No credit card required. Free for all beta users while in Open Beta.
              </p>
            </div>
          </div>

          {/* Future Growth Card (Visual comparison) */}
          <div className="relative rounded-3xl bg-white border border-slate-200/60 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Future Plans
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Pro / Teams</h3>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Unlock advanced collaboration and scaling capabilities for teams as we release newer versions.
              </p>
              
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-black text-slate-300">TBD</span>
                <span className="text-sm font-semibold text-slate-400">/ monthly</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-xs text-slate-500">
                <li className="flex gap-x-3 items-center">
                  <Check className="h-4 w-4 flex-none text-slate-300" />
                  Multiple users & workspace roles
                </li>
                <li className="flex gap-x-3 items-center">
                  <Check className="h-4 w-4 flex-none text-slate-300" />
                  Advanced API & Webhook access
                </li>
                <li className="flex gap-x-3 items-center">
                  <Check className="h-4 w-4 flex-none text-slate-300" />
                  Custom third-party integrations
                </li>
                <li className="flex gap-x-3 items-center">
                  <Check className="h-4 w-4 flex-none text-slate-300" />
                  Automated customer reconciliation
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <button
                disabled
                className="w-full h-11 border border-slate-200/80 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
              >
                Available post-beta
              </button>
              <p className="mt-4 text-[10px] text-slate-400 text-center leading-relaxed">
                Beta users get early testing rights for Pro features at no cost.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto border-t border-slate-200/60 pt-16">
          <h3 className="text-center text-xl font-bold text-slate-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-slate-50/70 border border-slate-200/50 p-6 rounded-2xl">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                  <HelpCircle className="size-4.5 text-indigo-500 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
