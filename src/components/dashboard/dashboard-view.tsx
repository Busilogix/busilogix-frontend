"use client";

import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard/stats";
import type { DashboardData } from "@/lib/dashboard/types";
import { getAllCustomers } from "@/lib/customers/mock-store";
import { formatCurrency, formatInvoiceDate } from "@/lib/invoices/format";
import { getAllInvoices, updateInvoiceStatus } from "@/lib/invoices/mock-store";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";
import { getStockAdjustmentLogs } from "@/lib/products/mock-store";
import { cn } from "@/lib/utils";

import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardWelcome } from "./dashboard-welcome";
import { GettingStartedCard } from "./getting-started-card";
import { MetricCard } from "./metric-card";
import { RecentCustomersTable } from "./recent-customers-table";
import { RecentInvoicesTable } from "./recent-invoices-table";

const LOAD_DELAY_MS = 500;

type ActivityEvent = {
  id: string;
  type:
    | "invoice_created"
    | "invoice_paid"
    | "customer_created"
    | "stock_adjusted";
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  color: string;
};

const quickActions = [
  {
    title: "Create invoice",
    description: "Bill a customer",
    href: "/invoices/new",
    icon: FileText,
    tone: "bg-violet-500/10 text-violet-600 ring-violet-500/15",
  },
  {
    title: "Add customer",
    description: "Save contact details",
    href: "/customers/new",
    icon: Users,
    tone: "bg-blue-500/10 text-blue-600 ring-blue-500/15",
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

function formatRelativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [outstandingInvoices, setOutstandingInvoices] = useState<
    InvoiceDetailRecord[]
  >([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(
    null,
  );
  const [revenueData, setRevenueData] = useState<
    { month: string; amount: number }[]
  >([]);
  const [maxRevenue, setMaxRevenue] = useState(1);

  const loadData = () => {
    const dashData = getDashboardData();
    setData(dashData);

    const allInvoices = getAllInvoices();
    const allCustomers = getAllCustomers();
    const stockLogs = getStockAdjustmentLogs();

    const outstanding = allInvoices
      .filter((inv) => inv.status === "sent" || inv.status === "overdue")
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 4);
    setOutstandingInvoices(outstanding);

    const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    const baseRevenues = [1500, 3200, 2400, 4800, 5600, 7200];
    const monthlyTotals = months.map((month, idx) => ({
      month,
      amount: baseRevenues[idx],
    }));

    allInvoices.forEach((inv) => {
      if (inv.status === "paid") {
        const date = new Date(inv.issue_date);
        const monthName = date.toLocaleString("default", { month: "short" });
        const match = monthlyTotals.find((m) => m.month === monthName);
        if (match) {
          match.amount += inv.total_amount;
        }
      }
    });
    setRevenueData(monthlyTotals);
    setMaxRevenue(Math.max(...monthlyTotals.map((m) => m.amount), 1));

    const events: ActivityEvent[] = [];

    allInvoices.forEach((inv) => {
      events.push({
        id: `act_inv_c_${inv.id}`,
        type: "invoice_created",
        title: "Invoice issued",
        description: `${inv.invoice_number} created for ${inv.customer_name}`,
        timestamp: inv.created_at,
        icon: FileText,
        color: "text-violet-600 bg-violet-500/10",
      });

      if (inv.status === "paid") {
        events.push({
          id: `act_inv_p_${inv.id}`,
          type: "invoice_paid",
          title: "Payment received",
          description: `Collected ${formatCurrency(inv.total_amount, inv.currency)} on ${inv.invoice_number}`,
          timestamp: inv.updated_at,
          icon: CheckCircle2,
          color: "text-emerald-600 bg-emerald-500/10",
        });
      }
    });

    allCustomers.forEach((cust) => {
      events.push({
        id: `act_cust_${cust.id}`,
        type: "customer_created",
        title: "Customer added",
        description: `${cust.name} joined the workspace`,
        timestamp: cust.created_at,
        icon: Users,
        color: "text-blue-600 bg-blue-500/10",
      });
    });

    stockLogs.forEach((log) => {
      events.push({
        id: `act_stock_${log.id}`,
        type: "stock_adjusted",
        title: "Inventory updated",
        description: `${log.product_name}: ${log.type === "in" ? "+" : log.type === "out" ? "-" : ""}${log.quantity} (${log.reason})`,
        timestamp: log.timestamp,
        icon: Boxes,
        color: "text-amber-600 bg-amber-500/10",
      });
    });

    setActivityFeed(
      events
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 6),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkAsPaid = (invoiceId: string) => {
    updateInvoiceStatus(invoiceId, "paid");
    loadData();
  };

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { metrics, recentInvoices, recentCustomers } = data;
  const currency = metrics.currency;
  const showGettingStarted =
    metrics.totalCustomers < 2 && metrics.totalInvoices < 2;

  const chartWidth = 400;
  const chartHeight = 120;
  const paddingX = 35;
  const paddingY = 15;

  const points = revenueData.map((d, idx) => {
    const x =
      paddingX + (idx / (revenueData.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      (d.amount / maxRevenue) * (chartHeight - paddingY * 2);
    return { x, y, month: d.month, amount: d.amount };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    <div className="space-y-6">
      <DashboardWelcome
        pendingAmount={metrics.pendingAmount}
        currency={currency}
      />

      {showGettingStarted ? <GettingStartedCard /> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/25 hover:bg-primary/5 hover:shadow-sm"
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg ring-1",
                action.tone,
              )}
            >
              <action.icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                {action.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total customers"
          value={metrics.totalCustomers.toLocaleString()}
          description="Active customer accounts"
          icon={Users}
          tone="blue"
        />
        <MetricCard
          title="Total invoices"
          value={metrics.totalInvoices.toLocaleString()}
          description="Draft, sent, and paid"
          icon={FileText}
          tone="violet"
        />
        <MetricCard
          title="Total revenue"
          value={formatCurrency(metrics.totalRevenue, currency)}
          description="From paid invoices"
          icon={CircleDollarSign}
          tone="emerald"
        />
        <MetricCard
          title="Pending amount"
          value={formatCurrency(metrics.pendingAmount, currency)}
          description="Sent and overdue balances"
          icon={Clock}
          tone="amber"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card size="sm" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4 text-emerald-600" />
                Revenue trends
              </CardTitle>
              <CardDescription>Monthly paid invoice trajectory</CardDescription>
            </div>
            {hoveredTrendIndex !== null ? (
              <span className="text-sm font-semibold tabular-nums text-emerald-600">
                {points[hoveredTrendIndex].month}:{" "}
                {formatCurrency(points[hoveredTrendIndex].amount, currency)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Hover chart for values
              </span>
            )}
          </CardHeader>
          <CardContent className="px-4 pt-3 pb-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-32 w-full overflow-visible"
            >
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.48 0.18 252)"
                    stopOpacity="0.18"
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.48 0.18 252)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="currentColor"
                className="text-border/20"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="currentColor"
                className="text-border/20"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="currentColor"
                className="text-border/40"
              />
              {areaPath ? <path d={areaPath} fill="url(#chart-grad)" /> : null}
              {linePath ? (
                <path
                  d={linePath}
                  fill="none"
                  stroke="oklch(0.48 0.18 252)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ) : null}
              {points.map((p, idx) => (
                <g key={p.month}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredTrendIndex === idx ? 5 : 3.5}
                    fill="var(--background)"
                    stroke="oklch(0.48 0.18 252)"
                    strokeWidth={hoveredTrendIndex === idx ? 3 : 2}
                    className="cursor-pointer transition-all duration-100"
                    onMouseEnter={() => setHoveredTrendIndex(idx)}
                    onMouseLeave={() => setHoveredTrendIndex(null)}
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 3}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px] font-medium tabular-nums"
                  >
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <div>
              <CardTitle className="text-sm">Outstanding payments</CardTitle>
              <CardDescription>Balances needing follow-up</CardDescription>
            </div>
            <Link
              href="/invoices"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              All
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            {outstandingInvoices.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                All invoices are settled.
              </div>
            ) : (
              <div className="space-y-3">
                {outstandingInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="font-mono text-sm font-semibold hover:text-primary hover:underline"
                        >
                          {inv.invoice_number}
                        </Link>
                        <span
                          className={cn(
                            "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase",
                            inv.status === "overdue"
                              ? "border-destructive/20 bg-destructive/5 text-destructive"
                              : "border-amber-500/20 bg-amber-500/5 text-amber-600",
                          )}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {inv.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        Due {formatInvoiceDate(inv.due_date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(inv.total_amount, inv.currency)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPaid(inv.id)}
                        className="h-7 border-emerald-500/20 px-2 text-xs font-medium text-emerald-600 hover:bg-emerald-500/5"
                      >
                        Mark paid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <RecentInvoicesTable invoices={recentInvoices} />
        </div>

        <Card size="sm" className="flex flex-col">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="size-4 text-primary" />
              Recent activity
            </CardTitle>
            <CardDescription>Latest workspace events</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            {activityFeed.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No activity logged yet.
              </div>
            ) : (
              <div className="space-y-4">
                {activityFeed.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        event.color,
                      )}
                    >
                      <event.icon className="size-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {event.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {formatRelativeTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <RecentCustomersTable customers={recentCustomers} />
      </section>
    </div>
  );
}
