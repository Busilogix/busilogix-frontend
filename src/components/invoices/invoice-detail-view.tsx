"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


import { toast } from "sonner";
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
import type { InvoiceDetailRecord } from "@/lib/invoices/types";

import { invoiceService } from "@/lib/api/invoice.service";
import type { BackendInvoice } from "@/lib/api/types/invoice.types";

import { downloadCsv } from "@/lib/export/csv";
import { triggerFileDownload } from "@/lib/utils";

import { InvoiceDetailSkeleton } from "./invoice-detail-skeleton";
import { InvoiceStatusBadge } from "./invoice-status-badge";

function mapApiInvoiceToDetailRecord(apiInvoice: BackendInvoice): InvoiceDetailRecord {
  const status = apiInvoice.status as any;
  const taxAmount =
    (apiInvoice.cgstAmount || 0) +
    (apiInvoice.sgstAmount || 0) +
    (apiInvoice.igstAmount || 0);

  return {
    id: apiInvoice.id,
    invoice_number: apiInvoice.invoiceNumber,
    customer_id: apiInvoice.customer?.id || "",
    customer_name: apiInvoice.customer?.name || "Walk-in Customer",
    customer_email: apiInvoice.customer?.email || "",
    customer_phone: apiInvoice.customer?.mobile || "",
    customer_address: apiInvoice.customer?.address,
    status,
    issue_date: apiInvoice.createdAt,
    due_date: apiInvoice.createdAt,
    currency: "INR",
    subtotal: apiInvoice.totalAmount,
    tax_amount: taxAmount,
    total_amount: apiInvoice.netAmount,
    notes: "",
    line_items: (apiInvoice.items || []).map((item) => ({
      id: item.id || Math.random().toString(),
      item_name: item.productName || "Unknown Item",
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_percentage: 0,
      line_subtotal: item.totalPrice,
      line_tax: 0,
      line_total: item.totalPrice,
    })),
    created_at: apiInvoice.createdAt,
    updated_at: apiInvoice.createdAt,
  };
}

const LOAD_DELAY_MS = 600;
const ACTION_DELAY_MS = 800;

type TaxBreakdown = {
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
};

type InvoiceDetailViewProps = {
  invoiceId: string;
};

function useInvoiceDetail(invoiceId: string) {
  const [invoice, setInvoice] = useState<InvoiceDetailRecord | null>(null);
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown>({ cgst: 0, sgst: 0, igst: 0, discount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setNotFound(false);

    async function loadInvoice() {
      if (!invoiceId) {
        console.warn("Invoice ID is missing");
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      try {
        const data = await invoiceService.getById(invoiceId);
        if (active) {
          setInvoice(mapApiInvoiceToDetailRecord(data));
          setTaxBreakdown({
            cgst: data.cgstAmount || 0,
            sgst: data.sgstAmount || 0,
            igst: data.igstAmount || 0,
            discount: data.discountAmount || 0,
          });
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Backend fetch failed:", err);
        if (err?.statusCode === 404 || err?.status === 404) {
          if (active) {
            setNotFound(true);
            setIsLoading(false);
          }
          return;
        }
        toast.error("Failed to fetch invoice from server.");
        if (active) {
          setInvoice(null);
          setIsLoading(false);
        }
      }
    }

    void loadInvoice();

    return () => {
      active = false;
    };
  }, [invoiceId]);

  return {
    invoice,
    setInvoice,
    taxBreakdown,
    setTaxBreakdown,
    isLoading,
    notFound,
  };
}

function useInvoiceActions(
  invoice: InvoiceDetailRecord | null,
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceDetailRecord | null>>,
  setTaxBreakdown: React.Dispatch<React.SetStateAction<TaxBreakdown>>,
) {
  const [pendingAction, setPendingAction] = useState<"download" | "email" | "mark-paid" | "cancel" | null>(null);

  async function performAction(
    actionName: "download" | "email" | "mark-paid" | "cancel",
    actionFn: () => Promise<void>,
    successTitle: string,
    successDescription: string,
  ) {
    setPendingAction(actionName);
    try {
      await actionFn();
      toast.success(successTitle, { description: successDescription });
    } catch (err: unknown) {
      console.error(`Action ${actionName} failed:`, err);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Action failed", { description: msg });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDownloadPdf() {
    if (!invoice) return;
    await performAction(
      "download",
      async () => {
        const blob = await invoiceService.downloadPdf(invoice.id);
        triggerFileDownload(blob, `${invoice.invoice_number}.pdf`);
      },
      "PDF downloaded",
      `${invoice.invoice_number}.pdf downloaded.`
    );
  }

  async function handleEmailAction() {
    if (!invoice) return;
    if (!invoice.customer_email) {
      toast.error("Missing Email", { description: "Customer does not have a registered email address." });
      return;
    }
    await performAction(
      "email",
      async () => {
        await invoiceService.send(invoice.id);
      },
      "Email sent successfully",
      `Invoice ${invoice.invoice_number} has been sent to ${invoice.customer_email}.`
    );
  }

  async function handleMarkPaid() {
    if (!invoice) return;
    await performAction(
      "mark-paid",
      async () => {
        const updated = await invoiceService.markAsPaid(invoice.id);
        setInvoice(mapApiInvoiceToDetailRecord(updated));
        setTaxBreakdown({
          cgst: updated.cgstAmount || 0,
          sgst: updated.sgstAmount || 0,
          igst: updated.igstAmount || 0,
          discount: updated.discountAmount || 0,
        });
      },
      "Invoice marked as paid",
      `${invoice.invoice_number} is now counted as revenue.`
    );
  }

  async function handleCancel() {
    if (!invoice) return;
    await performAction(
      "cancel",
      async () => {
        const updated = await invoiceService.cancel(invoice.id);
        setInvoice(mapApiInvoiceToDetailRecord(updated));
        setTaxBreakdown({
          cgst: updated.cgstAmount || 0,
          sgst: updated.sgstAmount || 0,
          igst: updated.igstAmount || 0,
          discount: updated.discountAmount || 0,
        });
      },
      "Invoice cancelled",
      `${invoice.invoice_number} has been cancelled.`
    );
  }

  return {
    pendingAction,
    busy: pendingAction !== null,
    handleDownloadPdf,
    handleEmailAction,
    handleMarkPaid,
    handleCancel,
  };
}

export function InvoiceDetailView({ invoiceId }: InvoiceDetailViewProps) {
  const { invoice, setInvoice, taxBreakdown, setTaxBreakdown, isLoading, notFound } = useInvoiceDetail(invoiceId);
  const {
    busy,
    handleDownloadPdf,
    handleEmailAction,
    handleMarkPaid,
    handleCancel,
  } = useInvoiceActions(invoice, setInvoice, setTaxBreakdown);

  function exportInvoiceCsv() {
    if (!invoice) return;
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

  if (isLoading) return <InvoiceDetailSkeleton />;

  if (notFound || !invoice) {
    return (
      <EmptyState
        title="Invoice not found"
        description="This invoice may have been deleted or the link is invalid."
        action={{ label: "Back to invoices", href: "/invoices" }}
      />
    );
  }

  const canMarkPaid = invoice.status !== "PAID" && invoice.status !== "CANCELLED";

  return (
    <div className="space-y-4">
      {/* ── Header + Actions card ── */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/invoices"
              className="inline-flex items-center justify-center size-8 rounded-lg border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Back to Invoices"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-mono text-lg font-bold tracking-tight sm:text-xl">
                  <Link href={`/invoices/${invoice.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {invoice.invoice_number}
                  </Link>
                </h1>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Issued {formatInvoiceDate(invoice.issue_date)} · Due {formatInvoiceDate(invoice.due_date)}
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold tabular-nums text-primary sm:text-3xl">
            {formatCurrency(invoice.total_amount, invoice.currency)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t bg-muted/20 px-4 py-3 sm:px-5">
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none" disabled={busy} onClick={handleDownloadPdf}>
            <Download className="size-4" aria-hidden />
            PDF
          </Button>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none" disabled={busy} onClick={exportInvoiceCsv}>
            <Download className="size-4" aria-hidden />
            CSV
          </Button>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none" disabled={busy} onClick={handleEmailAction}>
            <Mail className="size-4" aria-hidden />
            Email
          </Button>
          {canMarkPaid && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
              disabled={busy}
              onClick={handleMarkPaid}
            >
              <CheckCircle2 className="size-4" aria-hidden />
              Mark Paid
            </Button>
          )}
          {invoice.status !== "CANCELLED" && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none sm:ml-auto text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              disabled={busy}
              onClick={handleCancel}
            >
              <XCircle className="size-4" aria-hidden />
              Cancel Invoice
            </Button>
          )}
        </div>
      </div>

      {/* ── Content grid ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* ── Left: line items (2 cols) ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <FileText className="size-4 text-muted-foreground" aria-hidden />
              <h2 className="text-sm font-semibold">Line Items</h2>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {invoice.line_items.length}
              </span>
            </div>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="pl-4">Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right pr-4">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.line_items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/15 transition-colors">
                      <TableCell className="pl-4 font-medium">{item.item_name}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{formatCurrency(item.unit_price, invoice.currency)}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold pr-4">{formatCurrency(item.line_total, invoice.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Totals */}
            <div className="border-t bg-muted/15 px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {taxBreakdown.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="tabular-nums">− {formatCurrency(taxBreakdown.discount, invoice.currency)}</span>
                </div>
              )}
              {taxBreakdown.cgst > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>CGST</span>
                  <span className="tabular-nums">{formatCurrency(taxBreakdown.cgst, invoice.currency)}</span>
                </div>
              )}
              {taxBreakdown.sgst > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>SGST</span>
                  <span className="tabular-nums">{formatCurrency(taxBreakdown.sgst, invoice.currency)}</span>
                </div>
              )}
              {taxBreakdown.igst > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IGST</span>
                  <span className="tabular-nums">{formatCurrency(taxBreakdown.igst, invoice.currency)}</span>
                </div>
              )}
              {taxBreakdown.cgst === 0 && taxBreakdown.sgst === 0 && taxBreakdown.igst === 0 && invoice.tax_amount > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span className="tabular-nums">{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span className="tabular-nums text-primary">{formatCurrency(invoice.total_amount, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">


          {/* Customer */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
              <User className="size-3.5 text-muted-foreground" aria-hidden />
              <h2 className="text-sm font-semibold">Customer</h2>
            </div>

            {/* Customer Info Section */}
            <div className="p-4 space-y-3.5">
              <div>
                <p className="font-semibold text-base text-foreground leading-tight">{invoice.customer_name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm text-muted-foreground pt-2.5 border-t border-muted/50">
                {/* Contact Column */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 block mb-1">Contact</span>
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 shrink-0 text-muted-foreground/70" aria-hidden />
                    <span className="break-all font-medium text-foreground/90">{invoice.customer_email || "No Email"}</span>
                  </div>
                  {invoice.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 shrink-0 text-muted-foreground/70" aria-hidden />
                      <span className="font-medium text-foreground/90">{invoice.customer_phone}</span>
                    </div>
                  )}
                </div>

                {/* Address Column */}
                <div className="space-y-2 sm:border-l sm:pl-4 lg:border-l-0 lg:pl-0 xl:border-l xl:pl-4 border-muted/50 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 block mb-1">Address</span>
                  {invoice.customer_address ? (() => {
                    const line1Text = [
                      invoice.customer_address.line1,
                      invoice.customer_address.line2,
                    ].filter(Boolean).join(", ");
                    const line2Text = `${invoice.customer_address.city}, ${invoice.customer_address.state} ${invoice.customer_address.pincode}`;

                    return (
                      <div className="relative min-w-0 group cursor-pointer">
                        {/* Default state: Truncated two lines */}
                        <div className="flex items-start gap-2 group-hover:hidden min-w-0">
                          <MapPin className="size-3.5 mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
                          <div className="text-foreground/90 text-sm text-left leading-tight truncate w-full min-w-0">
                            <p className="font-medium truncate">{line1Text}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{line2Text}</p>
                          </div>
                        </div>
                        {/* Hover state: Full wrapped multi-line */}
                        <div className="hidden group-hover:flex items-start gap-2 min-w-0">
                          <MapPin className="size-3.5 mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
                          <div className="space-y-0.5 text-foreground/90 text-sm leading-relaxed text-left break-words">
                            <p className="font-semibold">{invoice.customer_address.line1}</p>
                            {invoice.customer_address.line2 && <p className="font-medium">{invoice.customer_address.line2}</p>}
                            <p className="font-medium">{invoice.customer_address.city}, {invoice.customer_address.state} {invoice.customer_address.pincode}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" aria-hidden />
                      <span className="font-medium text-foreground/90">No Address</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="rounded-xl border bg-card shadow-sm p-4">
              <h2 className="mb-1.5 text-sm font-semibold">Notes</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
