"use client";

import {
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "./invoice-status-badge";

export type InvoiceAction =
  | "view"
  | "download"
  | "email"
  | "mark-paid"
  | "duplicate";

type InvoicesTableProps = {
  invoices: InvoiceListRecord[];
  totalItems: number;
  onAction: (action: InvoiceAction, invoice: InvoiceListRecord) => void;
  pendingActionId?: string | null;
};

export function InvoicesTable({
  invoices,
  totalItems,
  onAction,
  pendingActionId,
}: InvoicesTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <div className="border-b px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-foreground">
          Invoice directory
        </p>
        <p className="text-xs text-muted-foreground">
          {totalItems} record{totalItems === 1 ? "" : "s"} · use actions to
          send, download, or mark paid
        </p>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="hidden md:table-cell">Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Issue Date</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const isPending = pendingActionId === invoice.id;

              return (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {invoice.invoice_number}
                      </Link>
                      <span className="text-xs text-muted-foreground md:hidden">
                        {invoice.customer_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {invoice.customer_name}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatInvoiceDate(invoice.issue_date)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className={
                        invoice.status === "OVERDUE"
                          ? "font-medium text-destructive"
                          : "text-muted-foreground"
                      }
                    >
                      {formatInvoiceDate(invoice.due_date)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatCurrency(invoice.total_amount, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-transparent outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                        aria-label={`Actions for ${invoice.invoice_number}`}
                        disabled={isPending}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          render={<Link href={`/invoices/${invoice.id}`} />}
                        >
                          <Eye className="size-4" aria-hidden />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("download", invoice)}
                        >
                          <Download className="size-4" aria-hidden />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("duplicate", invoice)}
                        >
                          <Copy className="size-4" aria-hidden />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onAction("email", invoice)}
                        >
                          <Mail className="size-4" aria-hidden />
                          Send Email
                        </DropdownMenuItem>
                        {invoice.status !== "PAID" ? (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onAction("mark-paid", invoice)}
                            >
                              <CheckCircle2 className="size-4" aria-hidden />
                              Mark as Paid
                            </DropdownMenuItem>
                          </>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="divide-y divide-border/40 md:hidden">
        {invoices.map((invoice) => {
          const isPending = pendingActionId === invoice.id;
          return (
            <div key={invoice.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {invoice.invoice_number}
                </Link>
                <div className="flex items-center gap-2">
                  <InvoiceStatusBadge status={invoice.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-transparent outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                      aria-label={`Actions for ${invoice.invoice_number}`}
                      disabled={isPending}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        render={<Link href={`/invoices/${invoice.id}`} />}
                      >
                        <Eye className="size-4" aria-hidden />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAction("download", invoice)}
                      >
                        <Download className="size-4" aria-hidden />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAction("duplicate", invoice)}
                      >
                        <Copy className="size-4" aria-hidden />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onAction("email", invoice)}
                      >
                        <Mail className="size-4" aria-hidden />
                        Send Email
                      </DropdownMenuItem>
                      {invoice.status !== "PAID" ? (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onAction("mark-paid", invoice)}
                          >
                            <CheckCircle2 className="size-4" aria-hidden />
                            Mark as Paid
                          </DropdownMenuItem>
                        </>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{invoice.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Issued {formatInvoiceDate(invoice.issue_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-primary tabular-nums">
                    {formatCurrency(invoice.total_amount, invoice.currency)}
                  </p>
                  {invoice.status === "OVERDUE" && (
                    <p className="text-[10px] font-bold text-destructive mt-0.5">
                      Due {formatInvoiceDate(invoice.due_date)}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Action Toolbar */}
              <div className="flex gap-2 pt-2 border-t border-border/40">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-[10px] h-7 gap-1"
                  onClick={() => onAction("download", invoice)}
                  disabled={isPending}
                >
                  <Download className="size-3" />
                  PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-[10px] h-7 gap-1"
                  onClick={() => onAction("email", invoice)}
                  disabled={isPending}
                >
                  <Mail className="size-3" />
                  Email
                </Button>
                {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
                  <Button
                    size="sm"
                    className="flex-1 text-[10px] h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => onAction("mark-paid", invoice)}
                    disabled={isPending}
                  >
                    <CheckCircle2 className="size-3" />
                    Paid
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
