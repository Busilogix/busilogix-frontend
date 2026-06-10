"use client";

import {
  Boxes,
  CircleDollarSign,
  FileText,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

import { FormMessage } from "@/components/auth/form-message";
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
import { dashboardService } from "@/lib/api";
import type { ApiDashboardData } from "@/lib/api";
import { isApiError } from "@/lib/api/errors";
import { formatCurrency } from "@/lib/invoices/format";
import type { InvoiceListRecord } from "@/lib/invoices/types";
import { cn } from "@/lib/utils";

import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardWelcome } from "./dashboard-welcome";
import { GettingStartedCard } from "./getting-started-card";
import { MetricCard } from "./metric-card";
import { RecentInvoicesTable } from "./recent-invoices-table";

const quickActions = [
  {
    title: "Create invoice",
    description: "Bill a customer",
    href: "/invoices/new",
    icon: FileText,
    tone: "bg-violet-500/10 text-violet-600 ring-violet-500/15",
  },
  {
    title: "Add product",
    description: "Expand your catalog",
    href: "/products/new",
    icon: Plus,
    tone: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15",
  },
  {
    title: "Adjust stock",
    description: "Update inventory",
    href: "/inventory",
    icon: Boxes,
    tone: "bg-amber-500/10 text-amber-600 ring-amber-500/15",
  },
] as const;

export function DashboardView() {
  const [data, setData] = useState<ApiDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to load dashboard data. Please try again.";
      setFetchError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (fetchError || !data) {
    return (
      <div className="space-y-6">
        <FormMessage
          type="error"
          title="Unable to load dashboard"
          message={fetchError || "Something went wrong while fetching dashboard metrics."}
        />
      </div>
    );
  }

  const {
    totalProducts,
    lowStockProducts,
    totalInvoices,
    grossSales,
    netRevenue,
    recentInvoices,
    topProducts,
  } = data;

  const showGettingStarted = totalProducts === 0 && totalInvoices === 0;

  // Map backend recent invoices (ApiRecentInvoice) to InvoiceListRecord shape expected by RecentInvoicesTable
  const mappedInvoices: InvoiceListRecord[] = recentInvoices.map((inv) => ({
    id: inv.invoiceId,
    invoice_number: inv.invoiceNumber,
    customer_id: "",
    customer_name: inv.customerName,
    status: "PAID" as const, // Default status for display mapping since api only has netAmount
    issue_date: inv.createdAt,
    due_date: inv.createdAt,
    currency: "INR",
    total_amount: inv.netAmount,
    created_at: inv.createdAt,
    updated_at: inv.createdAt,
  }));

  return (
    <div className="space-y-6">
      <DashboardWelcome
        pendingAmount={0}
        currency="INR"
      />

      {showGettingStarted ? <GettingStartedCard /> : null}

      <section className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex flex-col xs:flex-row items-center xs:items-start gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border border-primary/5 bg-gradient-to-br from-card to-muted/10 p-2.5 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5"
          >
            <span
              className={cn(
                "flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-lg ring-1 transition-all duration-300 group-hover:scale-105",
                action.tone,
              )}
            >
              <action.icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 text-center xs:text-left">
              <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate w-full">
                {action.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium hidden sm:block">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Premium KPI Metrics Section */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {/* Gross Sales */}
        <div className="surface-card group relative overflow-hidden rounded-xl sm:rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-card via-card to-emerald-500/[0.02] p-3.5 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-[3px] w-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Gross Sales</span>
            <span className="rounded-lg bg-emerald-500/10 p-1.5 sm:p-2 text-emerald-600 dark:text-emerald-400">
              <CircleDollarSign className="size-3.5 sm:size-4 shrink-0" />
            </span>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <h3 className="text-base sm:text-2xl font-black tracking-tight text-foreground tabular-nums leading-none sm:leading-normal">
              {formatCurrency(grossSales, "INR")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground/80 hidden sm:block">Billing volume before deductions</p>
          </div>
        </div>

        {/* Net Revenue */}
        <div className="surface-card group relative overflow-hidden rounded-xl sm:rounded-2xl border border-blue-500/10 bg-gradient-to-br from-card via-card to-blue-500/[0.02] p-3.5 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-[3px] w-full bg-blue-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Revenue</span>
            <span className="rounded-lg bg-blue-500/10 p-1.5 sm:p-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="size-3.5 sm:size-4 shrink-0" />
            </span>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <h3 className="text-base sm:text-2xl font-black tracking-tight text-foreground tabular-nums leading-none sm:leading-normal">
              {formatCurrency(netRevenue, "INR")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground/80 hidden sm:block">Earnings after tax and discounts</p>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="surface-card group relative overflow-hidden rounded-xl sm:rounded-2xl border border-violet-500/10 bg-gradient-to-br from-card via-card to-violet-500/[0.02] p-3.5 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-[3px] w-full bg-violet-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoices</span>
            <span className="rounded-lg bg-violet-500/10 p-1.5 sm:p-2 text-violet-600 dark:text-violet-400">
              <FileText className="size-3.5 sm:size-4 shrink-0" />
            </span>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <h3 className="text-base sm:text-2xl font-black tracking-tight text-foreground tabular-nums leading-none sm:leading-normal">
              {totalInvoices.toLocaleString()}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground/80 hidden sm:block">Issued invoice transactions count</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="surface-card group relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-500/10 bg-gradient-to-br from-card via-card to-amber-500/[0.02] p-3.5 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <div className="absolute top-0 left-0 h-[3px] w-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">Low Stock</span>
            <span className="rounded-lg bg-amber-500/10 p-1.5 sm:p-2 text-amber-600 dark:text-amber-400">
              <Boxes className="size-3.5 sm:size-4 shrink-0" />
            </span>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <h3 className="text-base sm:text-2xl font-black tracking-tight text-foreground tabular-nums leading-none sm:leading-normal">
              {lowStockProducts.toString()}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground/80 hidden sm:block">Out of {totalProducts} total catalog items</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 min-w-0">
          <RecentInvoicesTable invoices={mappedInvoices} />
        </div>

        {/* Styled Top Selling Products Widget */}
        <Card size="sm" className="surface-card rounded-2xl border border-primary/5 shadow-sm flex flex-col overflow-hidden min-w-0">
          <CardHeader className="border-b px-5 py-4 bg-muted/10">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <ShoppingBag className="size-4 text-primary" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Most popular items by quantity sold</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No product sales logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto w-full min-w-0">
                <Table className="min-w-[400px]">
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="pl-5 font-bold">Product Item</TableHead>
                      <TableHead className="text-right pr-5 font-bold">Qty Sold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const maxQty = Math.max(...topProducts.map(p => p.quantitySold), 1);
                      return topProducts.map((product, idx) => {
                        const percentage = Math.min(100, Math.round((product.quantitySold / maxQty) * 100));
                        const letterCode = product.productName.substring(0, 2).toUpperCase();
                        const initialsColors = [
                          "bg-blue-500/10 text-blue-500 border-blue-500/20",
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          "bg-violet-500/10 text-violet-500 border-violet-500/20",
                          "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        ];
                        const bgStyle = initialsColors[idx % initialsColors.length];

                        return (
                          <TableRow key={product.productId} className="hover:bg-muted/40 transition-colors duration-150">
                            <TableCell className="font-semibold text-xs text-foreground pl-5 py-3">
                              <div className="flex items-center gap-3">
                                <span className={cn("flex size-7 items-center justify-center rounded-lg border text-[10px] font-black tracking-wider", bgStyle)}>
                                  {letterCode}
                                </span>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="whitespace-nowrap font-bold">{product.productName}</span>
                                  <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden shadow-inner mt-1">
                                    <div className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full" style={{ width: `${percentage}%` }} />
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-xs text-foreground pr-5 tabular-nums py-3">
                              {product.quantitySold}
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })()}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
