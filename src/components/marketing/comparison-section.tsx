import { XCircle, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const legacyPainPoints = [
  "Manual data entry prone to typo errors",
  "Fragmented file versions (which sheet is the latest?)",
  "Broken formulas and no historical audit trail",
  "No client portal or professional customer facing links",
  "Blind spots in inventory levels and stock counts",
];

const busilogixSolutions = [
  "Automatic tax, totals, and invoice calculation",
  "Single secure source of truth synced in real-time",
  "Type-safe databases with automatic audit history",
  "Interactive shareable invoice links and PDF generation",
  "Automated low-stock alerts and tracking history",
];

export function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32 bg-slate-50/60 relative overflow-hidden">
      {/* Decorative background grid */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{ 
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", 
          backgroundSize: "32px 32px" 
        }} 
      />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
            <AlertTriangle className="size-3 text-indigo-600" />
            The Alternative
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ditch the spreadsheet chaos
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl mx-auto">
            Spreadsheets are great for calculators, but poor for running a multi-channel operation. Here is how Busilogix upgrades your workflow.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          {/* Spreadsheets pain */}
          <div className="relative rounded-2xl border border-red-100 bg-white/80 p-8 shadow-sm flex flex-col justify-between hover:border-red-200 transition-all duration-300">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <XCircle className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">Legacy Spreadsheets</h3>
                  <p className="text-[10px] text-slate-500">Manual, fragile, and disconnected</p>
                </div>
              </div>

              <ul className="space-y-4">
                {legacyPainPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-xs text-slate-600 font-medium">
                    <XCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <span className="text-[10px] font-bold text-red-500 bg-red-50 rounded-full px-3 py-1">
                Fragile for business scaling
              </span>
            </div>
          </div>

          {/* Busilogix value */}
          <div className="relative rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/20 p-8 shadow-md flex flex-col justify-between hover:border-indigo-200 transition-all duration-300 ring-2 ring-indigo-500/10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                    Busilogix Workspace
                  </h3>
                  <p className="text-[10px] text-indigo-600 font-semibold">Structured, automated, and central</p>
                </div>
              </div>

              <ul className="space-y-4">
                {busilogixSolutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3 text-xs text-slate-800 font-semibold">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">
                Optimized for growth
              </span>
              <Link
                href="/signup"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
              >
                Try for free
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
