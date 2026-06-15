import { XCircle, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const legacyPainPoints = [
  "Manual data entry prone to typo errors",
  "Fragmented file versions (which sheet is the latest?)",
  "Broken formulas and no historical audit trail",
  "No client portal or professional customer-facing links",
  "Blind spots in inventory levels and stock counts",
];

const busilogixSolutions = [
  "Automatic tax, totals, and invoice calculation",
  "Single secure source of truth, synced in real-time",
  "Type-safe databases with automatic audit history",
  "Interactive shareable invoice links and PDF generation",
  "Automated low-stock alerts and full tracking history",
];

export function ComparisonSection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-white">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="pointer-events-none absolute -bottom-20 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1.5 text-xs font-bold text-amber-700 mb-5">
            <AlertTriangle className="size-3.5" />
            The Alternative
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.1]">
            Ditch the spreadsheet chaos
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-500">
            Spreadsheets are great for calculators — terrible for running a multi-channel business. Here's how Busilogix upgrades your workflow.
          </p>
        </div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">

          {/* Spreadsheets pain */}
          <div className="relative rounded-3xl border border-red-100 bg-red-50/30 p-8 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-7">
                <span className="flex size-10 items-center justify-center rounded-xl bg-red-100 text-red-500 border border-red-200">
                  <XCircle className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Legacy Spreadsheets</h3>
                  <p className="text-[11px] text-slate-500">Manual, fragile, and disconnected</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {legacyPainPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-600">
                    <XCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative z-10 mt-8 pt-5 border-t border-red-100/80">
              <span className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                ⚠ Fragile for business scaling
              </span>
            </div>
          </div>

          {/* Busilogix value */}
          <div className="relative rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-white p-8 flex flex-col justify-between overflow-hidden shadow-lg shadow-indigo-500/8 ring-1 ring-indigo-500/10">
            <div className="absolute top-0 right-0 w-52 h-52 bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-7">
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Busilogix Workspace</h3>
                  <p className="text-[11px] text-indigo-600 font-semibold">Structured, automated, and central</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {busilogixSolutions.map((solution) => (
                  <li key={solution} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative z-10 mt-8 pt-5 border-t border-indigo-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                ✓ Optimized for growth
              </span>
              <Link
                href="/signup"
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 group"
              >
                Join the beta
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
