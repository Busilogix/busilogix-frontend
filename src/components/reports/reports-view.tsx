"use client";

import { BarChart3, Clock, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";

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

const LOAD_DELAY_MS = 600;

type ReportsData = ReturnType<typeof getReportsData>;

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="interactive-card overflow-hidden">
          <CardContent className="flex items-start justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {formatCurrency(data.totals.revenue, data.currency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Paid invoices only
              </p>
            </div>
            <span className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
              <BarChart3 className="size-5" />
            </span>
          </CardContent>
        </Card>
        <Card className="interactive-card overflow-hidden">
          <CardContent className="flex items-start justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {formatCurrency(data.totals.pending, data.currency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sent and overdue
              </p>
            </div>
            <span className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
              <Clock className="size-5" />
            </span>
          </CardContent>
        </Card>
        <Card className="interactive-card overflow-hidden">
          <CardContent className="flex items-start justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Invoices</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {data.totals.invoices}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total created
              </p>
            </div>
            <span className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
              <FileText className="size-5" />
            </span>
          </CardContent>
        </Card>
        <Card className="interactive-card overflow-hidden">
          <CardContent className="flex items-start justify-between pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {data.totals.customers}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Customer records
              </p>
            </div>
            <span className="rounded-2xl bg-blue-500/10 p-3 text-blue-600">
              <Users className="size-5" />
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Invoice status breakdown</CardTitle>
            <CardDescription>
              See how many invoices are draft, sent, paid, overdue, or
              cancelled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
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
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-primary to-primary/60"
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Top customers by paid revenue</CardTitle>
            <CardDescription>
              Customers ranked by invoices marked as paid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
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
                        {customer.invoiceCount} invoices
                      </p>
                    </div>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(customer.revenue, data.currency)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
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
