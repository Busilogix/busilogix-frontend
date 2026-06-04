"use client";

import { CheckCircle2, Copy, Download, Mail, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatInvoiceDate } from "@/lib/invoices/format";
import {
  duplicateInvoice,
  getInvoiceById,
  updateInvoiceStatus,
} from "@/lib/invoices/mock-store";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/export/csv";

import { InvoiceDetailSkeleton } from "./invoice-detail-skeleton";
import { InvoiceStatusBadge } from "./invoice-status-badge";

const LOAD_DELAY_MS = 600;
const ACTION_DELAY_MS = 800;

type InvoiceDetailViewProps = {
  invoiceId: string;
};

type ActionFeedback = {
  type: "success" | "error";
  title: string;
  message: string;
};

export function InvoiceDetailView({ invoiceId }: InvoiceDetailViewProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetailRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(
    null,
  );

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      const record = getInvoiceById(invoiceId);
      if (!record) {
        setNotFound(true);
        setInvoice(null);
      } else {
        setInvoice(record);
      }
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [invoiceId]);

  async function runAction(
    action: "download" | "email" | "mark-paid" | "duplicate",
    label: string,
    message: string,
  ) {
    if (!invoice) {
      return;
    }

    setActionFeedback(null);
    setPendingAction(action);

    try {
      await new Promise((resolve) => setTimeout(resolve, ACTION_DELAY_MS));

      if (action === "mark-paid") {
        const updated = updateInvoiceStatus(invoice.id, "paid");
        if (updated) {
          setInvoice(updated);
        }
      }

      if (action === "duplicate") {
        const copy = duplicateInvoice(invoice.id);
        if (copy) {
          router.push(`/invoices/${copy.id}/edit`);
          return;
        }
      }

      setActionFeedback({ type: "success", title: label, message });
    } catch {
      setActionFeedback({
        type: "error",
        title: "Action failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setPendingAction(null);
    }
  }

  function exportInvoiceCsv() {
    if (!invoice) {
      return;
    }

    downloadCsv(
      `${invoice.invoice_number}.csv`,
      invoice.line_items.map((item) => ({
        invoice_number: invoice.invoice_number,
        customer_name: invoice.customer_name,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_percentage: item.tax_percentage,
        line_total: item.line_total,
      })),
    );
  }

  if (isLoading) {
    return <InvoiceDetailSkeleton />;
  }

  if (notFound || !invoice) {
    return (
      <EmptyState
        title="Invoice not found"
        description="This invoice may have been deleted or the link is invalid."
        action={{ label: "Back to invoices", href: "/invoices" }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {actionFeedback ? (
        <FormMessage
          type={actionFeedback.type}
          title={actionFeedback.title}
          message={actionFeedback.message}
        />
      ) : null}

      <div className="surface-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-mono text-2xl font-semibold tracking-tight">
              {invoice.invoice_number}
            </h2>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Issued {formatInvoiceDate(invoice.issue_date)} · Due{" "}
            {formatInvoiceDate(invoice.due_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={pendingAction !== null}
            onClick={exportInvoiceCsv}
          >
            <Download className="size-4" aria-hidden />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pendingAction !== null}
            onClick={() =>
              runAction(
                "email",
                "Email sent (preview)",
                `Invoice ${invoice.invoice_number} would be emailed to ${invoice.customer_email}. API integration pending.`,
              )
            }
          >
            <Mail className="size-4" aria-hidden />
            Send Email
          </Button>
          {invoice.status !== "paid" ? (
            <Button
              variant="outline"
              size="sm"
              disabled={pendingAction !== null}
              onClick={() =>
                runAction(
                  "mark-paid",
                  "Invoice marked as paid",
                  `${invoice.invoice_number} is now counted as revenue.`,
                )
              }
            >
              <CheckCircle2 className="size-4" aria-hidden />
              Mark Paid
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            disabled={pendingAction !== null}
            onClick={() =>
              runAction(
                "duplicate",
                "Invoice duplicated",
                "A draft copy was created.",
              )
            }
          >
            <Copy className="size-4" aria-hidden />
            Duplicate
          </Button>
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            <Pencil className="size-4" aria-hidden />
            Edit Invoice
          </Link>
        </div>
      </div>

      <article className="overflow-hidden rounded-3xl border bg-card shadow-sm shadow-slate-950/5">
        <div className="border-b bg-gradient-to-br from-muted/50 to-background px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Invoice summary
              </p>
              <p className="mt-2 text-lg font-semibold">Busilogix</p>
              <p className="text-sm text-muted-foreground">
                Professional invoicing &amp; business management
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-muted-foreground">Amount due</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-primary">
                {formatCurrency(invoice.total_amount, invoice.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 px-6 py-8 sm:px-8">
          <section className="rounded-2xl border bg-background/60 p-5">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Customer information
            </h3>
            <div className="rounded-xl bg-muted/30 p-5">
              <p className="font-medium text-foreground">
                {invoice.customer_name}
              </p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{invoice.customer_email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>{invoice.customer_phone}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-2xl border bg-background/60 p-5">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Invoice items
            </h3>
            <div className="overflow-hidden rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Tax %</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.line_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.item_name}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(item.unit_price, invoice.currency)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.tax_percentage}%
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(item.line_total, invoice.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="flex justify-end">
            <div className="w-full max-w-sm space-y-4 rounded-2xl border bg-primary/5 p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Payment summary
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Grand total</span>
                <span className="text-lg font-semibold tabular-nums text-primary">
                  {formatCurrency(invoice.total_amount, invoice.currency)}
                </span>
              </div>
              {invoice.notes ? (
                <p className="border-t pt-3 text-xs text-muted-foreground">
                  {invoice.notes}
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
