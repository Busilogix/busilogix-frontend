"use client";

import { FileText, Mail, Pencil, Phone, Receipt, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/layout/empty-state";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { customerService } from "@/lib/api/customer.service";
import { invoiceService } from "@/lib/api/invoice.service";
import { mapApiCustomerToRecord } from "@/lib/customers/map-api-customer";
import type { CustomerRecord } from "@/lib/customers/types";
import { formatCurrency, formatInvoiceDate } from "@/lib/invoices/format";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";
import { cn } from "@/lib/utils";

type CustomerDetailViewProps = {
  customerId: string;
};

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDetailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCustomerAndInvoices() {
      setIsLoading(true);
      try {
        const apiCustomer = await customerService.getById(customerId);
        if (!active) return;
        setCustomer(mapApiCustomerToRecord(apiCustomer));

        const res = await invoiceService.list({ size: 200 });
        if (!active) return;

        const customerInvoices = res.items.filter(
          (inv) => inv.customer?.id === customerId,
        );

        const mappedInvoices = customerInvoices.map(
          (inv): InvoiceDetailRecord => ({
            id: inv.id,
            invoice_number: inv.invoiceNumber,
            customer_id: customerId,
            customer_name: inv.customer?.name || "",
            customer_email: inv.customer?.email || "",
            customer_phone: inv.customer?.mobile || "",
            status: inv.status as any,
            issue_date: inv.createdAt,
            due_date: inv.createdAt,
            currency: "INR",
            subtotal: inv.totalAmount,
            tax_amount:
              (inv.cgstAmount || 0) +
              (inv.sgstAmount || 0) +
              (inv.igstAmount || 0),
            total_amount: inv.netAmount,
            notes: "",
            line_items: [],
            created_at: inv.createdAt,
            updated_at: inv.createdAt,
          }),
        );

        setInvoices(mappedInvoices);
      } catch (err) {
        console.error("Failed to load customer profile details:", err);
        if (active) {
          setCustomer(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCustomerAndInvoices();

    return () => {
      active = false;
    };
  }, [customerId]);

  const stats = useMemo(() => {
    const paid = invoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + invoice.total_amount, 0);
    const pending = invoices
      .filter(
        (invoice) => invoice.status === "OVERDUE",
      )
      .reduce((sum, invoice) => sum + invoice.total_amount, 0);

    return {
      paid,
      pending,
      invoiceCount: invoices.length,
      currency: invoices[0]?.currency ?? "USD",
    };
  }, [invoices]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading customer profile...
      </div>
    );
  }

  if (!customer) {
    return (
      <EmptyState
        title="Customer not found"
        description="This customer may have been deleted or the link is invalid."
        action={{ label: "Back to customers", href: "/customers" }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="relative grid gap-4 p-4 pt-6 sm:p-6 sm:pt-7 lg:grid-cols-[1fr_auto] lg:items-start">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/30 to-transparent"
            aria-hidden
          />
          <div>
            <p className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Customer profile
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {customer.name}
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary" aria-hidden />
                {customer.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-primary" aria-hidden />
                {customer.phone}
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {customer.address}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Link
              href={`/customers/${customer.id}/edit`}
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              <Pencil className="size-4" aria-hidden />
              Edit customer
            </Link>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/invoices/new" />}
            >
              <Receipt className="size-4" aria-hidden />
              Create invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="interactive-card">
          <CardContent className="p-3 sm:p-6 text-center sm:text-left">
            <FileText className="inline-block size-4 text-violet-600 sm:block sm:size-5" aria-hidden />
            <p className="mt-2 truncate text-[10px] text-muted-foreground sm:text-sm">Invoices</p>
            <p className="mt-0.5 text-base font-bold tabular-nums tracking-tight sm:text-2xl">
              {stats.invoiceCount}
            </p>
          </CardContent>
        </Card>
        <Card className="interactive-card">
          <CardContent className="p-3 sm:p-6 text-center sm:text-left">
            <Wallet className="inline-block size-4 text-emerald-600 sm:block sm:size-5" aria-hidden />
            <p className="mt-2 truncate text-[10px] text-muted-foreground sm:text-sm">Paid revenue</p>
            <p className="mt-0.5 truncate text-base font-bold tabular-nums tracking-tight sm:text-2xl">
              {formatCurrency(stats.paid, stats.currency)}
            </p>
          </CardContent>
        </Card>
        <Card className="interactive-card">
          <CardContent className="p-3 sm:p-6 text-center sm:text-left">
            <Receipt className="inline-block size-4 text-amber-600 sm:block sm:size-5" aria-hidden />
            <p className="mt-2 truncate text-[10px] text-muted-foreground sm:text-sm">Pending</p>
            <p className="mt-0.5 truncate text-base font-bold tabular-nums tracking-tight sm:text-2xl">
              {formatCurrency(stats.pending, stats.currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Customer invoices</CardTitle>
          <CardDescription>
            Invoice history connected to this customer record.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={FileText}
                title="No invoices for this customer"
                description="Create an invoice and select this customer to see it here."
                action={{ label: "Create invoice", href: "/invoices/new" }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto w-full min-w-0">
              <Table className="min-w-[500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Issue Date</TableHead>
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
                          className="font-mono font-medium hover:text-primary hover:underline"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatInvoiceDate(invoice.issue_date)}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
