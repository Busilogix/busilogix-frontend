"use client";

import { FileText, Mail, MapPin, Pencil, Phone, Receipt, Users, Wallet } from "lucide-react";
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
            customer_name: inv.customer?.name || "Walk-in Customer",
            customer_email: inv.customer?.email || "No Email",
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Hero Card */}
        <Card className="overflow-hidden border border-border/60 shadow-sm relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-row items-center gap-3 min-w-0 w-full sm:w-auto">
              {/* Avatar Circle */}
              <div className="size-10 sm:size-12 md:size-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm sm:text-base md:text-lg font-bold flex items-center justify-center shadow-md shrink-0">
                {getInitials(customer.name || "Walk-in Customer") || "?"}
              </div>
              
              <div className="text-left min-w-0">
                <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground truncate">
                  {customer.name || "Walk-in Customer"}
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  Record: #{customer.id.slice(0, 8)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-1 sm:mt-0 justify-center">
              <Link
                href={`/customers/${customer.id}/edit`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 sm:h-8 md:h-9 text-xs md:text-sm gap-1.5 flex-1 sm:flex-none justify-center")}
              >
                <Pencil className="size-3 sm:size-3.5 md:size-4" aria-hidden />
                Edit Info
              </Link>
              <Link
                href="/invoices/new"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "h-7 sm:h-8 md:h-9 text-xs md:text-sm gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground border-none shadow-sm flex-1 sm:flex-none justify-center")}
              >
                <Receipt className="size-3 sm:size-3.5 md:size-4" aria-hidden />
                Create Invoice
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Invoices Stat */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-primary/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardContent className="p-2 sm:p-3 flex flex-col items-start text-left gap-1.5 w-full min-w-0">
              <div className="p-1 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                <FileText className="size-3.5 sm:size-4" aria-hidden />
              </div>
              <div className="space-y-0.5 min-w-0 w-full">
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">Invoices</p>
                <p className="text-xs sm:text-base font-black text-foreground tabular-nums tracking-tight truncate">
                  {stats.invoiceCount}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Paid Revenue Stat */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-500/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <CardContent className="p-2 sm:p-3 flex flex-col items-start text-left gap-1.5 w-full min-w-0">
              <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 transition-colors shrink-0">
                <Wallet className="size-3.5 sm:size-4" aria-hidden />
              </div>
              <div className="space-y-0.5 min-w-0 w-full">
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">Paid</p>
                <p className="text-xs sm:text-base font-black text-foreground tabular-nums tracking-tight truncate">
                  {formatCurrency(stats.paid, stats.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Stat */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-amber-500/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardContent className="p-2 sm:p-3 flex flex-col items-start text-left gap-1.5 w-full min-w-0">
              <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20 transition-colors shrink-0">
                <Receipt className="size-3.5 sm:size-4" aria-hidden />
              </div>
              <div className="space-y-0.5 min-w-0 w-full">
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">Pending</p>
                <p className="text-xs sm:text-base font-black text-foreground tabular-nums tracking-tight truncate">
                  {formatCurrency(stats.pending, stats.currency)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice History Card */}
        <Card className="border border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="p-3 sm:p-4 border-b bg-muted/10">
            <CardTitle className="text-base font-semibold">Invoice history</CardTitle>
            <CardDescription className="text-xs">
              All records of invoices associated with this customer
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {invoices.length === 0 ? (
              <div className="p-6 text-center">
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
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-9 px-3 py-2 text-xs">Invoice</TableHead>
                      <TableHead className="h-9 px-3 py-2 text-xs">Issue Date</TableHead>
                      <TableHead className="h-9 px-3 py-2 text-xs">Status</TableHead>
                      <TableHead className="h-9 px-3 py-2 text-xs text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="px-3 py-2 text-xs sm:text-sm font-medium">
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {invoice.invoice_number}
                          </Link>
                        </TableCell>
                        <TableCell className="px-3 py-2 text-muted-foreground text-xs sm:text-sm">
                          {formatInvoiceDate(invoice.issue_date)}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <InvoiceStatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right font-semibold tabular-nums text-foreground text-xs sm:text-sm">
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

      {/* Right Sidebar Column */}
      <div className="space-y-6">
        {/* Contact Info Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="p-3 border-b bg-muted/10">
            <CardTitle className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/80">
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4.5 space-y-3">
            {/* Email row */}
            <div className="flex gap-2.5 items-start">
              <div className="size-7 sm:size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="size-3.5 sm:size-4" aria-hidden />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-semibold">Email address</p>
                {customer.email ? (
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-xs sm:text-sm font-medium text-foreground hover:text-blue-600 hover:underline break-all transition-colors"
                  >
                    {customer.email}
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground/60 italic">No Email</p>
                )}
              </div>
            </div>

            {/* Phone row */}
            <div className="flex gap-2.5 items-start">
              <div className="size-7 sm:size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="size-3.5 sm:size-4" aria-hidden />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-semibold">Phone number</p>
                {customer.phone ? (
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-xs sm:text-sm font-medium text-foreground hover:text-emerald-600 hover:underline break-all transition-colors"
                  >
                    {customer.phone}
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground/60 italic">No Phone</p>
                )}
              </div>
            </div>

            {/* Address row */}
            <div className="flex gap-2.5 items-start">
              <div className="size-7 sm:size-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <MapPin className="size-3.5 sm:size-4" aria-hidden />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-semibold">Billing address</p>
                {customer.address ? (
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                    {customer.address}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground/60 italic">No Address</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="p-3 border-b bg-muted/10">
            <CardTitle className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/80">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-2.5 space-y-0.5">
            <Link
              href="/invoices/new"
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted text-xs sm:text-sm font-medium transition-colors text-foreground"
            >
              <Receipt className="size-3.5 text-indigo-500 shrink-0" />
              <span>Create new invoice</span>
            </Link>
            <Link
              href={`/customers/${customer.id}/edit`}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted text-xs sm:text-sm font-medium transition-colors text-foreground"
            >
              <Pencil className="size-3.5 text-purple-500 shrink-0" />
              <span>Edit customer profile</span>
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted text-xs sm:text-sm font-medium transition-colors text-foreground"
            >
              <Users className="size-3.5 text-slate-500 shrink-0" />
              <span>Back to directory</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
