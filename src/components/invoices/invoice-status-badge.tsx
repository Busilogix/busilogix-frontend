import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/invoices/types";

const statusConfig: Record<
  InvoiceStatus,
  {
    label: string;
    className: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  DRAFT: {
    label: "Draft",
    variant: "secondary",
    className: "",
  },
  PAID: {
    label: "Paid",
    variant: "outline",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  OVERDUE: {
    label: "Overdue",
    variant: "destructive",
    className: "",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "outline",
    className: "text-muted-foreground",
  },
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
  className?: string;
};

export function InvoiceStatusBadge({
  status,
  className,
}: InvoiceStatusBadgeProps) {
  const normalizedStatus = (status || "").toUpperCase() as InvoiceStatus;
  const config = statusConfig[normalizedStatus] || statusConfig.DRAFT;

  return (
    <Badge
      variant={config.variant}
      className={cn("capitalize", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
