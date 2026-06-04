import { FileText } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatInvoiceDate } from "@/lib/invoices/format";
import type { InvoiceListRecord } from "@/lib/invoices/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RecentInvoicesTableProps = {
  invoices: InvoiceListRecord[];
};

export function RecentInvoicesTable({ invoices }: RecentInvoicesTableProps) {
  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b space-y-0">
        <div>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>Latest billing activity</CardDescription>
        </div>
        <Link
          href="/invoices"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {invoices.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Create your first invoice to see activity here."
              action={{ label: "Create invoice", href: "/invoices/new" }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-mono text-sm font-medium hover:text-primary hover:underline"
                    >
                      {invoice.invoice_number}
                    </Link>
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {invoice.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatInvoiceDate(invoice.issue_date)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {invoice.customer_name}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(invoice.total_amount, invoice.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
