import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/invoices/format";
import type { InvoiceTotals } from "@/lib/invoices/calculations";
import { cn } from "@/lib/utils";

type InvoiceFormSummaryProps = {
  totals: InvoiceTotals;
  currency?: string;
  className?: string;
};

export function InvoiceFormSummary({
  totals,
  currency = "USD",
  className,
}: InvoiceFormSummaryProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(totals.subtotal, currency)}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Tax</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(totals.tax, currency)}
        </span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-semibold">Grand total</span>
        <span className="text-lg font-semibold tabular-nums text-primary">
          {formatCurrency(totals.grandTotal, currency)}
        </span>
      </div>
    </div>
  );
}
