import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FeaturePageTemplateProps {
  heroTitle: React.ReactNode;
  heroSubtitle: string;
  heroGradientClass: string; // e.g. "from-indigo-500/10"
  iconBgClass: string; // e.g. "bg-indigo-500/10"
  iconRingClass: string; // e.g. "ring-indigo-500/20"
  iconColorClass: string; // e.g. "text-indigo-600"
  ctaGradientClass: string; // e.g. "from-indigo-500/20"
  features: FeatureItem[];
  ctaTitle?: string;
  ctaSubtitle?: string;
}

export function FeaturePageTemplate({
  heroTitle,
  heroSubtitle,
  heroGradientClass,
  iconBgClass,
  iconRingClass,
  iconColorClass,
  ctaGradientClass,
  features,
  ctaTitle = "Ready to transform your business?",
  ctaSubtitle = "Join Busilogix today. Completely free during our Beta phase.",
}: FeaturePageTemplateProps) {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className={cn("absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-white to-white", heroGradientClass)} />
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-slate-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="mx-auto max-w-4xl font-extrabold tracking-tight text-slate-900 text-5xl sm:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Deep Dive Features Grid */}
      <section className="py-24 sm:py-32 bg-slate-50/70 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Everything you need, built in.</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Deep-dive features crafted for productivity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative flex flex-col items-start bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Diagonal card background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl mb-6 ring-1 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105", iconBgClass, iconRingClass)}>
                    <feature.icon className={cn("h-5 w-5", iconColorClass)} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-slate-950">
        <div className={cn("absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] via-slate-950 to-slate-950", ctaGradientClass)} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] bg-primary/10 blur-3xl pointer-events-none" aria-hidden />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 leading-relaxed">{ctaSubtitle}</p>
          <div className="mt-10 flex justify-center">
            <Link 
              href="/signup" 
              className={cn(
                buttonVariants({ size: "lg" }), 
                "h-14 px-8 text-base bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all rounded-xl flex items-center gap-2"
              )}
            >
              Get Started for Free
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
