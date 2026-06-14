import { Store, Compass, Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const values = [
  {
    name: "Radical Simplicity",
    description: "Commerce is complex. Software shouldn't be. We design every interface to be intuitive, clean, and blazingly fast.",
    icon: Zap,
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
  {
    name: "Unified Operations",
    description: "Siloed tools breed mistakes. By integrating invoicing, stock, and clients, you get a single source of truth.",
    icon: Compass,
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
  },
  {
    name: "Privacy & Security First",
    description: "Your business data is your own. We build with robust, standard compliance and data encryption at every tier.",
    icon: Shield,
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
  },
  {
    name: "Continuous Evolution",
    description: "We ship rapidly. Working with beta testers, we refine and implement requested workflows every week.",
    icon: Sparkles,
    color: "text-rose-500 bg-rose-50 border-rose-100",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-80px)] pt-32 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white" />
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-900/20">
              <Store className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
            Our Mission & Story
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            We believe that running a business should be the hard part—not the software you use to manage it.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8 border-b border-slate-100 mb-16">
          <div className="space-y-6 text-base text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 text-lg leading-relaxed">
              Busilogix was born out of frustration with legacy Enterprise Resource Planning (ERP) systems.
            </p>
            <p>
              Historically, businesses have been forced to choose between two terrible options: stitch together 
              a fragile web of expensive single-purpose tools (one for invoices, one for inventory, one for CRM), 
              or spend tens of thousands of dollars integrating a bloated, decade-old ERP system.
            </p>
            <p>
              We are building the third option. A deeply integrated, beautifully designed operating system for 
              modern commerce that just works, right out of the box.
            </p>
          </div>
          <div className="relative rounded-2xl border border-slate-200/60 bg-slate-50 p-8 shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            <h3 className="text-xl font-bold text-slate-950 mb-3">Designed for speed, built for scale</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Whether you are generating your first invoice or managing a complex catalogue of thousands of SKUs, 
              Busilogix adapts to your needs. By combining invoicing, CRM, inventory, and analytics into a single 
              platform, we eliminate data silos and manual entry errors.
            </p>
            <Link 
              href="/signup" 
              className={cn(buttonVariants({ size: "sm" }), "bg-slate-900 text-white hover:bg-slate-800 shadow-sm")}
            >
              Start for free
            </Link>
          </div>
        </div>

        {/* Company Values Section */}
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 mb-10">
            Our Core Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((val) => (
              <div 
                key={val.name} 
                className="flex flex-col items-start bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg border mb-4 shadow-sm", val.color)}>
                  <val.icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{val.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
