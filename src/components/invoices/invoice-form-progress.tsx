import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type InvoiceFormProgressProps = {
  customerComplete: boolean;
  itemsComplete: boolean;
  itemCount: number;
};

export function InvoiceFormProgress({
  customerComplete,
  itemsComplete,
  itemCount,
}: InvoiceFormProgressProps) {
  const steps = [
    { label: "Customer", complete: customerComplete },
    {
      label:
        itemCount > 0
          ? `${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Cart",
      complete: itemsComplete,
    },
    { label: "Bill", complete: customerComplete && itemsComplete },
  ];

  return (
    <div className="surface-card rounded-xl px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  step.complete
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {step.complete ? (
                  <Check className="size-3" aria-hidden />
                ) : (
                  <span className="size-3 rounded-full border border-current" />
                )}
                {step.label}
              </span>
              {index < steps.length - 1 ? (
                <span className="text-muted-foreground/50 text-xs">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Customer first · Tap product ·{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
            /
          </kbd>{" "}
          scan ·{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">
            ⌘/Ctrl + Enter
          </kbd>{" "}
          bill
        </p>
      </div>
    </div>
  );
}
