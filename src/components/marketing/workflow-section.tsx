import { Store, ShoppingBag, Send, TrendingUp } from "lucide-react";

const steps = [
  {
    id: 1,
    name: "Setup Your Workspace",
    description: "Create your account and register your business details. Set up your logo, address, and taxation credentials in seconds.",
    icon: Store,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: 2,
    name: "Add Your Products",
    description: "Import or manually add your inventory. Track prices, stock levels, and SKUs to ensure you never run out of top sellers.",
    icon: ShoppingBag,
    gradient: "from-blue-500 to-teal-500",
  },
  {
    id: 3,
    name: "Bill Your Customers",
    description: "Create professional invoices for your clients. Add line items, apply discounts, and instantly generate PDFs or email receipts.",
    icon: Send,
    gradient: "from-teal-500 to-purple-500",
  },
  {
    id: 4,
    name: "Track Revenue",
    description: "Watch your business grow. Access real-time dashboards to see outstanding balances, paid invoices, and revenue analytics.",
    icon: TrendingUp,
    gradient: "from-purple-500 to-indigo-500",
  },
];

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white relative">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Streamlined Workflow</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From zero to operational in minutes
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We've eliminated the setup friction. Follow four simple steps to get your entire commercial operation running on Busilogix.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl lg:mt-24 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-16 right-16 h-0.5 bg-slate-100" aria-hidden="true">
            <div className="h-full bg-gradient-to-r from-indigo-500/20 via-teal-500/20 to-purple-500/20 w-full" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center text-center group bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="mb-6 relative">
                  {/* Outer glowing ring */}
                  <div className="absolute inset-0 rounded-full bg-slate-100/40 blur-md group-hover:blur-lg transition-all" />
                  
                  {/* Step icon container */}
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-300">
                    <step.icon className="h-8 w-8 text-indigo-600" />
                    
                    {/* Step number badge with gradient */}
                    <div className={`absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold shadow-md ring-2 ring-white bg-gradient-to-tr ${step.gradient}`}>
                      {step.id}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
