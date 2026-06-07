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
import { getCustomerById } from "@/lib/customers/mock-store";
import type { CustomerRecord } from "@/lib/customers/types";
import { formatCurrency, formatInvoiceDate } from "@/lib/invoices/format";
import { getAllInvoices } from "@/lib/invoices/mock-store";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";
import { cn } from "@/lib/utils";

const LOAD_DELAY_MS = 500;

type CustomerDetailViewProps = {
  customerId: string;
};

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDetailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const record = getCustomerById(customerId);
      setCustomer(record ?? null);
      setInvoices(
        getAllInvoices().filter(
          (invoice) => invoice.customer_id === customerId,
        ),
      );
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
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
        <CardContent className="relative grid gap-6 pt-7 lg:grid-cols-[1fr_auto] lg:items-start">
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="interactive-card">
          <CardContent className="pt-6">
            <FileText className="size-5 text-violet-600" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">Invoices</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {stats.invoiceCount}
            </p>
          </CardContent>
        </Card>
        <Card className="interactive-card">
          <CardContent className="pt-6">
            <Wallet className="size-5 text-emerald-600" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">Paid revenue</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCurrency(stats.paid, stats.currency)}
            </p>
          </CardContent>
        </Card>
        <Card className="interactive-card">
          <CardContent className="pt-6">
            <Receipt className="size-5 text-amber-600" aria-hidden />
            <p className="mt-3 text-sm text-muted-foreground">Pending</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
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
            <Table>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
