"use client";

import { BarChart3, Clock, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { ListPageHeader } from "@/components/layout/list-page-header";
import { EmptyState } from "@/components/layout/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/invoices/format";
import { getReportsData } from "@/lib/reports/stats";

const LOAD_DELAY_MS = 500;

type ReportsData = ReturnType<typeof getReportsData>;

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

export function ReportsView() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(getReportsData());
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !data) {
    return <ReportsSkeleton />;
  }

  const statusEntries = Object.entries(data.statusCounts);
  const maxStatusCount = Math.max(
    ...statusEntries.map(([, count]) => count),
    1,
  );
  const maxCustomerRevenue = Math.max(
    ...data.customerTotals.map((customer) => customer.revenue),
    1,
  );

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Reports"
        description="Understand revenue, pending payments, invoice status, and top customers at a glance."
        metrics={[
          {
            title: "Revenue",
            value: formatCurrency(data.totals.revenue, data.currency),
            description: "Paid invoices only",
            icon: BarChart3,
            tone: "emerald",
          },
          {
            title: "Pending",
            value: formatCurrency(data.totals.pending, data.currency),
            description: "Sent and overdue",
            icon: Clock,
            tone: "amber",
          },
          {
            title: "Invoices",
            value: data.totals.invoices.toLocaleString(),
            description: "Total created",
            icon: FileText,
            tone: "violet",
          },
          {
            title: "Customers",
            value: data.totals.customers.toLocaleString(),
            description: "Customer records",
            icon: Users,
            tone: "blue",
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-card rounded-xl">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-sm">Invoice status breakdown</CardTitle>
            <CardDescription>
              Draft, sent, paid, overdue, and cancelled counts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-5">
            {statusEntries.length === 0 ? (
              <EmptyState
                title="No invoice status yet"
                description="Create invoices to start seeing status reports."
              />
            ) : (
              statusEntries.map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-muted-foreground">
                      {status}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/60"
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="surface-card rounded-xl">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-sm">Top customers by revenue</CardTitle>
            <CardDescription>Ranked by invoices marked as paid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-5">
            {data.customerTotals.length === 0 ? (
              <EmptyState
                title="No customer revenue yet"
                description="Mark invoices as paid to build this report."
              />
            ) : (
              data.customerTotals.map((customer) => (
                <div key={customer.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.invoiceCount} invoice
                        {customer.invoiceCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(customer.revenue, data.currency)}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{
                        width: `${(customer.revenue / maxCustomerRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
