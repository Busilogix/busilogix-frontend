"use client";

import {
  CircleDollarSign,
  Clock,
  FileText,
  Users,
  Plus,
  Package,
  Boxes,
  TrendingUp,
  CheckCircle2,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getDashboardData } from "@/lib/dashboard/stats";
import type { DashboardData } from "@/lib/dashboard/types";
import { formatCurrency, formatInvoiceDate } from "@/lib/invoices/format";
import {
  getAllInvoices,
  updateInvoiceStatus,
} from "@/lib/invoices/mock-store";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";
import { getAllCustomers } from "@/lib/customers/mock-store";
import { getStockAdjustmentLogs } from "@/lib/products/mock-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { DashboardSkeleton } from "./dashboard-skeleton";
import { MetricCard } from "./metric-card";
import { RecentCustomersTable } from "./recent-customers-table";
import { RecentInvoicesTable } from "./recent-invoices-table";

const LOAD_DELAY_MS = 500;

type ActivityEvent = {
  id: string;
  type: "invoice_created" | "invoice_paid" | "customer_created" | "stock_adjusted";
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
};

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [outstandingInvoices, setOutstandingInvoices] = useState<InvoiceDetailRecord[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // Revenue chart calculations
  const [revenueData, setRevenueData] = useState<{ month: string; amount: number }[]>([]);
  const [maxRevenue, setMaxRevenue] = useState(1);

  const loadData = () => {
    const dashData = getDashboardData();
    setData(dashData);

    const allInvoices = getAllInvoices();
    const allCustomers = getAllCustomers();
    const stockLogs = getStockAdjustmentLogs();

    // 1. Outstanding Payments: sent or overdue invoices, sorted by amount desc
    const outstanding = allInvoices
      .filter((inv) => inv.status === "sent" || inv.status === "overdue")
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 4);
    setOutstandingInvoices(outstanding);

    // 2. Revenue Trends grouping (last 6 months)
    const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    const baseRevenues = [1500, 3200, 2400, 4800, 5600, 7200];
    const monthlyTotals = months.map((month, idx) => ({
      month,
      amount: baseRevenues[idx],
    }));

    // Add actual paid invoice amounts to corresponding months
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

    // 3. Compile Recent Activity Feed
    const events: ActivityEvent[] = [];

    // Invoice events
    allInvoices.forEach((inv) => {
      events.push({
        id: `act_inv_c_${inv.id}`,
        type: "invoice_created",
        title: "Invoice Issued",
        description: `${inv.invoice_number} created for ${inv.customer_name}`,
        timestamp: inv.created_at,
        icon: FileText,
        color: "text-violet-600 bg-violet-500/10",
      });

      if (inv.status === "paid") {
        events.push({
          id: `act_inv_p_${inv.id}`,
          type: "invoice_paid",
          title: "Payment Received",
          description: `Collected ${formatCurrency(inv.total_amount, inv.currency)} on ${inv.invoice_number}`,
          timestamp: inv.updated_at,
          icon: CheckCircle2,
          color: "text-emerald-600 bg-emerald-500/10",
        });
      }
    });

    // Customer events
    allCustomers.forEach((cust) => {
      events.push({
        id: `act_cust_${cust.id}`,
        type: "customer_created",
        title: "New Customer Registered",
        description: `${cust.name} added to workspace`,
        timestamp: cust.created_at,
        icon: Users,
        color: "text-blue-600 bg-blue-500/10",
      });
    });

    // Stock events
    stockLogs.forEach((log) => {
      events.push({
        id: `act_stock_${log.id}`,
        type: "stock_adjusted",
        title: "Inventory Adjusted",
        description: `${log.product_name} stock: ${log.type === "in" ? "+" : log.type === "out" ? "-" : ""}${log.quantity} (${log.reason})`,
        timestamp: log.timestamp,
        icon: Boxes,
        color: "text-amber-600 bg-amber-500/10",
      });
    });

    // Sort events descending
    const sortedEvents = events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    setActivityFeed(sortedEvents);
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
    loadData(); // reload stats dynamically
  };

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { metrics, recentInvoices, recentCustomers } = data;
  const currency = metrics.currency;

  // SVG Chart Coordinates mapping
  const chartWidth = 400;
  const chartHeight = 110;
  const paddingX = 35;
  const paddingY = 15;

  const points = revenueData.map((d, idx) => {
    const x = paddingX + (idx / (revenueData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.amount / maxRevenue) * (chartHeight - paddingY * 2);
    return { x, y, month: d.month, amount: d.amount };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    <div className="space-y-4">
      {/* Quick Actions Panel */}
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <Link
          href="/invoices/new"
          className="flex items-center gap-2 rounded-lg border bg-card/60 p-2.5 transition-all hover:bg-primary/5 hover:border-primary/20 text-xs font-semibold"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-600">
            <Plus className="size-4" />
          </span>
          <span>Create Invoice</span>
        </Link>
        <Link
          href="/customers/new"
          className="flex items-center gap-2 rounded-lg border bg-card/60 p-2.5 transition-all hover:bg-primary/5 hover:border-primary/20 text-xs font-semibold"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
            <Plus className="size-4" />
          </span>
          <span>Add Customer</span>
        </Link>
        <Link
          href="/products/new"
          className="flex items-center gap-2 rounded-lg border bg-card/60 p-2.5 transition-all hover:bg-primary/5 hover:border-primary/20 text-xs font-semibold"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
            <Plus className="size-4" />
          </span>
          <span>Add Product</span>
        </Link>
        <Link
          href="/inventory"
          className="flex items-center gap-2 rounded-lg border bg-card/60 p-2.5 transition-all hover:bg-primary/5 hover:border-primary/20 text-xs font-semibold"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-600">
            <Boxes className="size-4" />
          </span>
          <span>Adjust Stock</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          description="Draft, sent, & paid list"
          icon={FileText}
          tone="violet"
        />
        <MetricCard
          title="Total revenue"
          value={formatCurrency(metrics.totalRevenue, currency)}
          description="From cleared invoices"
          icon={CircleDollarSign}
          tone="emerald"
        />
        <MetricCard
          title="Pending amount"
          value={formatCurrency(metrics.pendingAmount, currency)}
          description="Overdue & sent balances"
          icon={Clock}
          tone="amber"
        />
      </div>

      {/* Primary Workflows: Revenue trends & Outstanding Payments */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue trends (Custom SVG sparkline) */}
        <Card size="sm" className="lg:col-span-2">
          <CardHeader className="border-b py-2 px-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="size-3.5 text-emerald-600" /> Revenue Trends
              </CardTitle>
              <CardDescription className="text-[10px]">Monthly paid invoice trajectory</CardDescription>
            </div>
            {hoveredTrendIndex !== null ? (
              <span className="text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {points[hoveredTrendIndex].month}: {formatCurrency(points[hoveredTrendIndex].amount, currency)}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground">Hover nodes for values</span>
            )}
          </CardHeader>
          <CardContent className="pt-2 px-3 pb-1">
            <div className="w-full relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28 overflow-visible">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.48 0.18 252)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="oklch(0.48 0.18 252)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" className="text-border/20" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="currentColor" className="text-border/20" strokeDasharray="3 3" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" className="text-border/40" />

                {/* Shaded Area */}
                {areaPath && <path d={areaPath} fill="url(#chart-grad)" />}

                {/* Line */}
                {linePath && <path d={linePath} fill="none" stroke="oklch(0.48 0.18 252)" strokeWidth="2.5" strokeLinecap="round" />}

                {/* Interactive Points */}
                {points.map((p, idx) => (
                  <g key={idx}>
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
                      className="text-[9px] fill-muted-foreground font-medium tabular-nums"
                    >
                      {p.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding payments fast action panel */}
        <Card size="sm">
          <CardHeader className="border-b py-2 px-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs font-semibold">Outstanding Payments</CardTitle>
              <CardDescription className="text-[10px]">Unpaid balances requiring attention</CardDescription>
            </div>
            <Link
              href="/invoices"
              className="text-[10px] font-medium text-primary hover:underline flex items-center gap-0.5"
            >
              All <ArrowRight className="size-2.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-3">
            {outstandingInvoices.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                All invoices settled! No outstanding bills.
              </div>
            ) : (
              <div className="space-y-2">
                {outstandingInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/invoices/${inv.id}`} className="font-mono text-[11px] font-bold text-foreground hover:underline">
                          {inv.invoice_number}
                        </Link>
                        <span className={cn(
                          "px-1 text-[9px] font-medium rounded border",
                          inv.status === "overdue"
                            ? "bg-destructive/5 text-destructive border-destructive/20"
                            : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                        )}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{inv.customer_name}</p>
                      <p className="text-[9px] text-muted-foreground/80">Due {formatInvoiceDate(inv.due_date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        {formatCurrency(inv.total_amount, inv.currency)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPaid(inv.id)}
                        className="h-6 text-[10px] px-1.5 font-medium border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5"
                      >
                        Mark Paid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Tables & Recent Activity Feed */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Recent Invoices Table */}
        <div className="xl:col-span-2 space-y-4">
          <RecentInvoicesTable invoices={recentInvoices} />
        </div>

        {/* Unified Recent Activity Feed */}
        <Card size="sm" className="flex flex-col">
          <CardHeader className="border-b py-2 px-3">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
              <Activity className="size-3.5 text-primary" /> Recent Workspace Activity
            </CardTitle>
            <CardDescription className="text-[10px]">Real-time operational records</CardDescription>
          </CardHeader>
          <CardContent className="p-3 flex-1">
            {activityFeed.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No activity logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {activityFeed.map((event) => (
                  <div key={event.id} className="flex gap-2.5 text-[11px] leading-tight">
                    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold", event.color)}>
                      <event.icon className="size-3" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-semibold text-foreground">{event.title}</p>
                      <p className="text-muted-foreground text-[10px] leading-normal">{event.description}</p>
                      <p className="text-[9px] text-muted-foreground/80 tabular-nums">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Customers row */}
      <div className="grid gap-4">
        <RecentCustomersTable customers={recentCustomers} />
      </div>
    </div>
  );
}
