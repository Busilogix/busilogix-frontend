import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/invoices/format";
import type { CreateInvoiceTotals } from "@/lib/invoices/create-calculations";
import { cn } from "@/lib/utils";

type CreateInvoiceSummaryProps = {
  totals: CreateInvoiceTotals;
  taxType: "INTRA_STATE" | "INTER_STATE";
  taxPercentage: number;
  className?: string;
};

export function CreateInvoiceSummary({
  totals,
  taxType,
  taxPercentage,
  className,
}: CreateInvoiceSummaryProps) {
  const taxLabel =
    taxType === "INTRA_STATE"
      ? `GST (${taxPercentage}% — CGST + SGST)`
      : `IGST (${taxPercentage}%)`;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(totals.subtotal, "INR")}
        </span>
      </div>
      {totals.discountAmount > 0 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span className="font-medium tabular-nums text-rose-600">
            -{formatCurrency(totals.discountAmount, "INR")}
          </span>
        </div>
      ) : null}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{taxLabel}</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(totals.tax, "INR")}
        </span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-semibold">Estimated total</span>
        <span className="text-lg font-semibold tabular-nums text-primary">
          {formatCurrency(totals.grandTotal, "INR")}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Final amounts are calculated by the server when the invoice is created.
      </p>
    </div>
  );
}
