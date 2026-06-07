"use client";

import { BarChart3, FileText, ShoppingBag, TrendingUp, DollarSign, Percent, Boxes, ArrowUpRight, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import Link from "next/link";

import { ListPageHeader } from "@/components/layout/list-page-header";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";
import { formatCurrency } from "@/lib/invoices/format";
import { salesService, productReportService, gstReportService, inventoryReportService } from "@/lib/api";
import type { SalesReportData, ProductReportData, GstReportData, InventoryReportData } from "@/lib/api";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

type TabType = "sales" | "products" | "taxes" | "inventory";

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="h-12 w-full max-w-md rounded-xl bg-muted/60" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[350px] rounded-2xl" />
    </div>
  );
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ReportsView() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("sales");
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sales report specific states
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: subDays(today, 19),
      to: today,
    };
  });
  const [groupBy, setGroupBy] = useState<"DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR">("DAY");
  const [salesData, setSalesData] = useState<SalesReportData | null>(null);
  const [isSalesLoading, setIsSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  // Product report specific states
  const [productData, setProductData] = useState<ProductReportData | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  // GST report specific states
  const [gstData, setGstData] = useState<GstReportData | null>(null);
  const [isGstLoading, setIsGstLoading] = useState(true);
  const [gstError, setGstError] = useState<string | null>(null);

  // Inventory report specific states
  const [inventoryData, setInventoryData] = useState<InventoryReportData | null>(null);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "CSV" | "PDF") => {
    if (!dateRange?.from || !dateRange?.to && activeTab !== "inventory") return;
    setIsExporting(true);
    try {
      let blob: Blob;
      let filename = `report-${activeTab}-${formatDateToYYYYMMDD(new Date())}`;

      const startDateStr = dateRange?.from ? formatDateToYYYYMMDD(dateRange.from) : "";
      const endDateStr = dateRange?.to ? formatDateToYYYYMMDD(dateRange.to) : "";

      if (activeTab === "sales") {
        blob = await salesService.exportSalesReport({
          startDate: startDateStr,
          endDate: endDateStr,
          groupBy,
          format,
        });
        filename = `sales-report-${startDateStr}-to-${endDateStr}`;
      } else if (activeTab === "products") {
        blob = await productReportService.exportProductReport({
          startDate: startDateStr,
          endDate: endDateStr,
          limit,
          format,
        });
        filename = `products-report-${startDateStr}-to-${endDateStr}`;
      } else if (activeTab === "taxes") {
        blob = await gstReportService.exportGstReport({
          startDate: startDateStr,
          endDate: endDateStr,
          format,
        });
        filename = `gst-report-${startDateStr}-to-${endDateStr}`;
      } else {
        blob = await inventoryReportService.exportInventoryReport({
          limit,
          format,
        });
        filename = `inventory-report`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileExt = format.toLowerCase();
      link.setAttribute("download", `${filename}.${fileExt}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to export ${activeTab} report:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchSalesReport = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    setIsSalesLoading(true);
    setSalesError(null);
    try {
      const report = await salesService.getSalesReport({
        startDate: formatDateToYYYYMMDD(dateRange.from),
        endDate: formatDateToYYYYMMDD(dateRange.to),
        groupBy,
      });
      setSalesData(report);
    } catch (error) {
      setSalesError(isApiError(error) ? error.message : "Failed to load sales report.");
    } finally {
      setIsSalesLoading(false);
    }
  }, [dateRange, groupBy]);

  const fetchProductReport = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    setIsProductLoading(true);
    setProductError(null);
    try {
      const report = await productReportService.getProductReport({
        startDate: formatDateToYYYYMMDD(dateRange.from),
        endDate: formatDateToYYYYMMDD(dateRange.to),
        limit,
      });
      setProductData(report);
    } catch (error) {
      setProductError(isApiError(error) ? error.message : "Failed to load product report.");
    } finally {
      setIsProductLoading(false);
    }
  }, [dateRange, limit]);

  const fetchGstReport = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    setIsGstLoading(true);
    setGstError(null);
    try {
      const report = await gstReportService.getGstReport({
        startDate: formatDateToYYYYMMDD(dateRange.from),
        endDate: formatDateToYYYYMMDD(dateRange.to),
      });
      setGstData(report);
    } catch (error) {
      setGstError(isApiError(error) ? error.message : "Failed to load GST tax report.");
    } finally {
      setIsGstLoading(false);
    }
  }, [dateRange]);

  const fetchInventoryReport = useCallback(async () => {
    setIsInventoryLoading(true);
    setInventoryError(null);
    try {
      const report = await inventoryReportService.getInventoryReport({ limit });
      setInventoryData(report);
    } catch (error) {
      setInventoryError(isApiError(error) ? error.message : "Failed to load inventory report.");
    } finally {
      setIsInventoryLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchSalesReport();
    void fetchProductReport();
    void fetchGstReport();
    void fetchInventoryReport();
  }, [fetchSalesReport, fetchProductReport, fetchGstReport, fetchInventoryReport]);

  const isInitialLoading = isSalesLoading && isProductLoading && isGstLoading && isInventoryLoading;

  if (!mounted || isInitialLoading) {
    return <ReportsSkeleton />;
  }

  // Chart helpers
  const chartWidth = 650;
  const chartHeight = 240;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const intervals = salesData?.data || [];
  const maxVal = Math.max(...intervals.map((d) => Math.max(d.grossSales, d.netRevenue)), 1);
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const barWidth = Math.max(2, Math.min(22, (plotWidth / Math.max(1, intervals.length)) * 0.35));

  const maxProductSales = Math.max(...(productData?.products.map(p => p.grossSales) || []), 1);

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Reports & Analytics"
        description="Monitor sales performance, tax collection metrics, product demand, and catalog inventory health."
      />

      {/* Tab Selector & Controls Panel */}
      <div className="space-y-4">
        {/* Premium Tab Bar Navigation */}
        <div className="flex border-b border-border/80 pb-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-full">
          <div className="flex gap-2">
            {[
              { id: "sales", label: "Sales Performance", icon: TrendingUp, activeColor: "border-blue-600 text-blue-600 dark:text-blue-400", activeBg: "bg-blue-500/5", dotColor: "bg-blue-500" },
              { id: "products", label: "Product Insights", icon: ShoppingBag, activeColor: "border-emerald-600 text-emerald-600 dark:text-emerald-400", activeBg: "bg-emerald-500/5", dotColor: "bg-emerald-500" },
              { id: "taxes", label: "GST & Tax Summary", icon: Percent, activeColor: "border-violet-600 text-violet-600 dark:text-violet-400", activeBg: "bg-violet-500/5", dotColor: "bg-violet-500" },
              { id: "inventory", label: "Inventory Alerts", icon: Boxes, activeColor: "border-amber-600 text-amber-600 dark:text-amber-400", activeBg: "bg-amber-500/5", dotColor: "bg-amber-500" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 rounded-t-xl transition-all duration-300 cursor-pointer shrink-0 whitespace-nowrap -mb-[2px]",
                  activeTab === tab.id
                    ? `${tab.activeColor} ${tab.activeBg} border-current scale-[1.02]`
                    : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                )}
              >
                <tab.icon className="size-3.5 shrink-0" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className={cn("size-1.5 rounded-full shrink-0 animate-pulse", tab.dotColor)} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Export Action Strip */}
        <div className="surface-card rounded-2xl border border-primary/10 bg-gradient-to-br from-card via-card to-primary/[0.01] p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Controls / Filters (Left Aligned) */}
          <div className="flex flex-wrap items-center gap-4">
            {activeTab !== "inventory" && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Period:</span>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
            )}
            
            {activeTab === "sales" && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Group By:</span>
                <div className="flex rounded-lg border border-border/60 bg-muted/40 p-0.5 shadow-inner">
                  {(["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"] as const).map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setGroupBy(group)}
                      className={cn(
                        "rounded px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 cursor-pointer",
                        groupBy === group
                          ? "bg-background text-foreground shadow-sm scale-100"
                          : "text-muted-foreground hover:bg-background/40",
                      )}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "products" || activeTab === "inventory") && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Limit:</span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-foreground"
                >
                  {[5, 10, 15, 20, 30, 50].map((val) => (
                    <option key={val} value={val}>
                      {val} items
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Export Actions (Right Aligned) */}
          <div className="flex items-center gap-2 border-t pt-3 sm:border-t-0 sm:pt-0 border-border/60">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">Export:</span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => void handleExport("CSV")}
              disabled={
                isExporting ||
                (activeTab === "sales" && (isSalesLoading || !salesData)) ||
                (activeTab === "products" && (isProductLoading || !productData)) ||
                (activeTab === "taxes" && (isGstLoading || !gstData)) ||
                (activeTab === "inventory" && (isInventoryLoading || !inventoryData))
              }
              className="h-8 gap-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
            >
              <Download className="size-3" aria-hidden />
              CSV
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => void handleExport("PDF")}
              disabled={
                isExporting ||
                (activeTab === "sales" && (isSalesLoading || !salesData)) ||
                (activeTab === "products" && (isProductLoading || !productData)) ||
                (activeTab === "taxes" && (isGstLoading || !gstData)) ||
                (activeTab === "inventory" && (isInventoryLoading || !inventoryData))
              }
              className="h-8 gap-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
            >
              <Download className="size-3" aria-hidden />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Render errors if any */}
      {(salesError || productError || gstError || inventoryError) && (
        <div className="space-y-2">
          {salesError && activeTab === "sales" && <FormMessage type="error" title="Sales Report Error" message={salesError} />}
          {productError && activeTab === "products" && <FormMessage type="error" title="Product Report Error" message={productError} />}
          {gstError && activeTab === "taxes" && <FormMessage type="error" title="GST Report Error" message={gstError} />}
          {inventoryError && activeTab === "inventory" && <FormMessage type="error" title="Inventory Report Error" message={inventoryError} />}
        </div>
      )}

      {/* TAB CONTENT: SALES */}
      {activeTab === "sales" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sales Period Metrics */}
          {isSalesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          ) : salesData ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {/* Gross Sales Card */}
              <div className="surface-card group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-card via-card to-emerald-500/[0.02] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 h-[3px] w-full bg-emerald-500" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gross Sales</span>
                  <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                    <ShoppingBag className="size-4 shrink-0" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black tracking-tight text-foreground tabular-nums">
                    {formatCurrency(salesData.grossSales, "INR")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground/80">Total invoicing volume before adjustments</p>
                </div>
              </div>

              {/* Net Revenue Card */}
              <div className="surface-card group relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-card via-card to-blue-500/[0.02] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 h-[3px] w-full bg-blue-500" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Revenue</span>
                  <span className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="size-4 shrink-0" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black tracking-tight text-foreground tabular-nums">
                    {formatCurrency(salesData.netRevenue, "INR")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground/80">Earnings after tax and discount deductions</p>
                </div>
              </div>

              {/* Invoices Issued Card */}
              <div className="surface-card group relative overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-br from-card via-card to-violet-500/[0.02] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 h-[3px] w-full bg-violet-500" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoices Issued</span>
                  <span className="rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
                    <FileText className="size-4 shrink-0" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black tracking-tight text-foreground tabular-nums">
                    {salesData.totalInvoices.toLocaleString()}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground/80">Count of all active transactions in range</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Sales Visualization & Breakdown Grid */}
          {isSalesLoading ? (
            <Skeleton className="h-80 rounded-2xl" />
          ) : salesData ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Sales Chart Card */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm xl:col-span-2 overflow-hidden">
                <CardHeader className="border-b px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-muted/10">
                  <div>
                    <CardTitle className="text-sm font-bold">Sales Trend Analytics</CardTitle>
                    <CardDescription>Visual correlation of gross vs net reporting metrics</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {hoveredBarIndex !== null && intervals[hoveredBarIndex] ? (
                      <div className="text-[11px] font-semibold text-primary bg-primary/5 border border-primary/10 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 transition-all">
                        <span className="font-mono text-muted-foreground">{intervals[hoveredBarIndex].label}:</span>
                        <span className="text-emerald-600">Gross: {formatCurrency(intervals[hoveredBarIndex].grossSales, "INR")}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">Net: {formatCurrency(intervals[hoveredBarIndex].netRevenue, "INR")}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded bg-[oklch(0.627_0.265_150.136)]" />
                          <span className="text-muted-foreground font-normal text-[10px]">Gross Sales</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded bg-[oklch(0.48_0.18_252)]" />
                          <span className="text-muted-foreground font-normal text-[10px]">Net Revenue</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  {intervals.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">No sales data.</div>
                  ) : (
                    <div className="w-full overflow-x-auto">
                      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-60 w-full min-w-[520px] overflow-visible">
                        <defs>
                          <linearGradient id="grossSalesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.627 0.265 150.136)" stopOpacity="1" />
                            <stop offset="100%" stopColor="oklch(0.627 0.265 150.136)" stopOpacity="0.25" />
                          </linearGradient>
                          <linearGradient id="netRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.48 0.18 252)" stopOpacity="1" />
                            <stop offset="100%" stopColor="oklch(0.48 0.18 252)" stopOpacity="0.25" />
                          </linearGradient>
                        </defs>
                        {Array.from({ length: 4 }).map((_, idx) => {
                          const ratio = idx / 3;
                          const yVal = maxVal * ratio;
                          const yPos = chartHeight - paddingBottom - ratio * plotHeight;
                          return (
                            <g key={idx}>
                              <line x1={paddingLeft} y1={yPos} x2={chartWidth - paddingRight} y2={yPos} stroke="currentColor" className="text-border/20" strokeDasharray={idx > 0 ? "3 3" : undefined} />
                              <text x={paddingLeft - 8} y={yPos + 3} textAnchor="end" className="fill-muted-foreground text-[10px] font-medium tabular-nums">{formatCurrency(yVal, "INR")}</text>
                            </g>
                          );
                        })}
                        {intervals.map((item, i) => {
                          const centerX = paddingLeft + (i + 0.5) * (plotWidth / Math.max(1, intervals.length));
                          const xGross = centerX - barWidth - 1.5;
                          const xNet = centerX + 1.5;
                          const hGross = (item.grossSales / maxVal) * plotHeight;
                          const hNet = (item.netRevenue / maxVal) * plotHeight;
                          const yGross = chartHeight - paddingBottom - hGross;
                          const yNet = chartHeight - paddingBottom - hNet;
                          const isHovered = hoveredBarIndex === i;

                          return (
                            <g key={item.label} className="cursor-pointer" onMouseEnter={() => setHoveredBarIndex(i)} onMouseLeave={() => setHoveredBarIndex(null)}>
                              <rect x={centerX - (plotWidth / intervals.length) * 0.48} y={paddingTop} width={(plotWidth / intervals.length) * 0.96} height={plotHeight} fill="currentColor" className={cn("text-primary/5 transition-opacity", isHovered ? "opacity-100" : "opacity-0")} rx={4} />
                              {hGross > 0 && <rect x={xGross} y={yGross} width={barWidth} height={hGross} rx={3} fill="url(#grossSalesGrad)" className={cn("transition-all duration-300", isHovered ? "brightness-110 filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.4)]" : "opacity-90")} />}
                              {hNet > 0 && <rect x={xNet} y={yNet} width={barWidth} height={hNet} rx={3} fill="url(#netRevenueGrad)" className={cn("transition-all duration-300", isHovered ? "brightness-110 filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.4)]" : "opacity-90")} />}
                              <text x={centerX} y={chartHeight - 15} textAnchor="middle" className={cn("text-[9px] transition-colors font-medium", isHovered ? "fill-foreground font-semibold" : "fill-muted-foreground")}>
                                {item.label.length > 10 ? item.label.substring(5) : item.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mini sales stats overview card */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm p-5 space-y-4 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-2xl -z-10" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Sales Margin Insights</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Key indicators for the selected period.</p>
                </div>
                {intervals.length > 0 ? (
                  <div className="space-y-4 my-auto">
                    <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                      <span className="text-muted-foreground font-semibold">Avg. Ticket Value</span>
                      <span className="font-bold text-foreground tabular-nums">
                        {formatCurrency(salesData.totalInvoices > 0 ? salesData.netRevenue / salesData.totalInvoices : 0, "INR")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                      <span className="text-muted-foreground font-semibold">Peak Invoiced Amount</span>
                      <span className="font-bold text-emerald-600 tabular-nums">
                        {formatCurrency(Math.max(...intervals.map(i => i.grossSales)), "INR")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Conversion Margin</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {salesData.grossSales > 0 ? `${((salesData.netRevenue / salesData.grossSales) * 100).toFixed(1)}%` : "0%"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-6 text-center">No trend details.</p>
                )}
                <div className="pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex justify-between items-center bg-muted/5 -mx-5 -mb-5 px-5 py-3">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-time active
                  </span>
                  <Link href="/invoices" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                    View Invoices <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </Card>
            </div>
          ) : null}

          {/* Detailed Breakdown Table */}
          {salesData && (
            <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm overflow-hidden">
              <CardHeader className="border-b px-5 py-4 bg-muted/10">
                <CardTitle className="text-sm font-bold">Sales Interval Breakdown</CardTitle>
                <CardDescription>Metrics aggregated per interval step</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="pl-5 font-bold">Interval Step</TableHead>
                      <TableHead className="text-right font-bold">Transactions</TableHead>
                      <TableHead className="text-right font-bold">Gross Invoiced</TableHead>
                      <TableHead className="text-right pr-5 font-bold">Net Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {intervals.map((item) => (
                      <TableRow key={item.label} className="hover:bg-muted/40 transition-colors duration-150">
                        <TableCell className="font-mono text-xs pl-5 font-semibold text-foreground">{item.label}</TableCell>
                        <TableCell className="text-right font-semibold text-xs text-muted-foreground tabular-nums">{item.invoiceCount}</TableCell>
                        <TableCell className="text-right font-semibold text-xs text-emerald-600 tabular-nums">{formatCurrency(item.grossSales, "INR")}</TableCell>
                        <TableCell className="text-right font-bold text-xs text-indigo-600 dark:text-indigo-400 pr-5 tabular-nums">{formatCurrency(item.netRevenue, "INR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {isProductLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : productData ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Top Selling Products List with visual share bars */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm lg:col-span-2 overflow-hidden">
                <CardHeader className="border-b px-5 py-4 bg-muted/10">
                  <CardTitle className="text-base font-bold">Product Catalog Performance</CardTitle>
                  <CardDescription>Visual sales share breakdown of items sold</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {productData.products.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">No product sales.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="pl-5 font-bold">Product Item</TableHead>
                          <TableHead className="text-right font-bold">Units Sold</TableHead>
                          <TableHead className="text-right font-bold">Relative Share</TableHead>
                          <TableHead className="text-right pr-5 font-bold">Gross Billing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productData.products.map((p, idx) => {
                          const percentage = Math.min(100, Math.round((p.grossSales / maxProductSales) * 100));
                          const letterCode = p.productName.substring(0, 2).toUpperCase();
                          const initialsColors = [
                            "bg-blue-500/10 text-blue-500 border-blue-500/20",
                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                            "bg-violet-500/10 text-violet-500 border-violet-500/20",
                            "bg-amber-500/10 text-amber-500 border-amber-500/20",
                          ];
                          const bgStyle = initialsColors[idx % initialsColors.length];

                          return (
                            <TableRow key={p.productId} className="hover:bg-muted/40 transition-colors duration-150">
                              <TableCell className="font-semibold text-xs text-foreground pl-5">
                                <div className="flex items-center gap-3">
                                  <span className={cn("flex size-7 items-center justify-center rounded-lg border text-[10px] font-black tracking-wider", bgStyle)}>
                                    {letterCode}
                                  </span>
                                  <span className="truncate max-w-[200px]">{p.productName}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-bold text-xs text-foreground tabular-nums">{p.quantitySold}</TableCell>
                              <TableCell className="text-right min-w-[150px]">
                                <div className="flex items-center justify-end gap-2.5">
                                  <div className="h-2 w-16 bg-muted rounded-full overflow-hidden hidden sm:block shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${percentage}%` }} />
                                  </div>
                                  <span className="text-[10px] font-black text-muted-foreground/80">{percentage}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-bold text-xs text-emerald-600 pr-5 tabular-nums">{formatCurrency(p.grossSales, "INR")}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Product Period Metrics Card */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm p-5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 size-24 bg-emerald-500/5 rounded-full blur-2xl -z-10" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Performance Summary</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Consolidated catalog metrics.</p>
                </div>
                <div className="space-y-6 my-auto py-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Units Dispatched</p>
                    <p className="text-3xl font-black text-foreground tabular-nums">{productData.totalProductsSold.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aggregate Sales Value</p>
                    <p className="text-3xl font-black text-emerald-600 tabular-nums">{formatCurrency(productData.totalSales, "INR")}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex justify-between items-center bg-muted/5 -mx-5 -mb-5 px-5 py-3">
                  <span>Data is refreshed in real-time</span>
                  <Link href="/products" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                    View Catalog <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB CONTENT: TAXES */}
      {activeTab === "taxes" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {isGstLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : gstData ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Detailed GST breakdown cards */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm lg:col-span-2 p-5 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-foreground">GST Taxes Collected</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Breakdown of Central (CGST), State (SGST), and Integrated (IGST) tax elements.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="border border-border/60 bg-gradient-to-b from-muted/30 to-muted/10 p-4 rounded-xl space-y-1 hover:shadow-sm transition-all duration-300">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CGST (Central)</p>
                    <p className="text-xl font-extrabold text-foreground tabular-nums">{formatCurrency(gstData.totalCgst, "INR")}</p>
                  </div>
                  <div className="border border-border/60 bg-gradient-to-b from-muted/30 to-muted/10 p-4 rounded-xl space-y-1 hover:shadow-sm transition-all duration-300">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SGST (State)</p>
                    <p className="text-xl font-extrabold text-foreground tabular-nums">{formatCurrency(gstData.totalSgst, "INR")}</p>
                  </div>
                  <div className="border border-border/60 bg-gradient-to-b from-muted/30 to-muted/10 p-4 rounded-xl space-y-1 hover:shadow-sm transition-all duration-300">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">IGST (Integrated)</p>
                    <p className="text-xl font-extrabold text-foreground tabular-nums">{formatCurrency(gstData.totalIgst, "INR")}</p>
                  </div>
                </div>

                {/* Tax Share Distribution Bar */}
                {gstData.totalTax > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Tax Distribution Share</span>
                      <span className="text-xs text-muted-foreground font-medium">Total: {formatCurrency(gstData.totalTax, "INR")}</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(gstData.totalCgst / gstData.totalTax) * 100}%` }} title="CGST" />
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(gstData.totalSgst / gstData.totalTax) * 100}%` }} title="SGST" />
                      <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${(gstData.totalIgst / gstData.totalTax) * 100}%` }} title="IGST" />
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded bg-blue-500" />
                        <span>CGST: {((gstData.totalCgst / gstData.totalTax) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded bg-emerald-500" />
                        <span>SGST: {((gstData.totalSgst / gstData.totalTax) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded bg-violet-500" />
                        <span>IGST: {((gstData.totalIgst / gstData.totalTax) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Taxable Base Amount</p>
                    <p className="text-lg font-bold text-foreground tabular-nums">{formatCurrency(gstData.taxableAmount, "INR")}</p>
                  </div>
                  <div className="space-y-1 text-left sm:text-right">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Aggregate Tax liability</p>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{formatCurrency(gstData.totalTax, "INR")}</p>
                  </div>
                </div>
              </Card>

              {/* Tax to sales ratio visual gauge */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm p-5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 size-24 bg-violet-500/5 rounded-full blur-2xl -z-10" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Tax-to-Sales Ratio</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Proportion of taxes to overall base revenue.</p>
                </div>
                {gstData.taxableAmount > 0 ? (
                  <div className="space-y-4 my-auto py-6">
                    <div className="flex items-end justify-center gap-1.5">
                      <span className="text-4xl font-black text-primary tabular-nums">
                        {((gstData.totalTax / gstData.taxableAmount) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground font-bold mb-1.5">tax ratio</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full" style={{ width: `${Math.min(100, (gstData.totalTax / gstData.taxableAmount) * 100)}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center font-medium leading-relaxed">Tax contributions calculated against billing base.</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-6 text-center">No taxable amount recorded.</p>
                )}
                <div className="pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex justify-between items-center bg-muted/5 -mx-5 -mb-5 px-5 py-3">
                  <span className="font-semibold">Standard corporate GST rates applied</span>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB CONTENT: INVENTORY */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {isInventoryLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : inventoryData ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Product Alerts and Inventory Health logs */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm lg:col-span-2 overflow-hidden">
                <CardHeader className="border-b px-5 py-4 bg-muted/10">
                  <CardTitle className="text-base font-bold">Stock warning alerts</CardTitle>
                  <CardDescription>Catalog items needing restock operations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {inventoryData.products.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3">
                      <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="size-8" />
                      </div>
                      <p className="font-bold text-foreground text-base">All Items Stocked</p>
                      <p className="text-xs max-w-xs text-muted-foreground/80 font-medium">There are no low stock or out-of-stock items in your catalog today.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="pl-5 font-bold">Product Item</TableHead>
                          <TableHead className="text-right font-bold">Qty Available</TableHead>
                          <TableHead className="text-right pr-5 font-bold">Stock Alert Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventoryData.products.map((item) => (
                          <TableRow key={item.productId} className="hover:bg-muted/40 transition-colors duration-150">
                            <TableCell className="font-semibold text-xs text-foreground pl-5">
                              <div className="flex items-center gap-2.5">
                                {item.status === "OUT_OF_STOCK" ? (
                                  <span className="size-2 rounded-full bg-destructive animate-pulse" />
                                ) : (
                                  <span className="size-2 rounded-full bg-amber-500" />
                                )}
                                <span className="truncate max-w-[220px]">{item.productName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-xs text-foreground tabular-nums">{item.stock}</TableCell>
                            <TableCell className="text-right pr-5">
                              <span className={cn(
                                "rounded-lg px-2.5 py-1 text-[9px] font-black uppercase border tracking-wider",
                                item.status === "LOW_STOCK" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                                item.status === "OUT_OF_STOCK" ? "bg-destructive/5 text-destructive border-destructive/20" :
                                "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                              )}>
                                {item.status.replace("_", " ")}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Status summary counts */}
              <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm p-5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 size-24 bg-amber-500/5 rounded-full blur-2xl -z-10" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Inventory Breakdown</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Summary of catalog items grouped by stock levels.</p>
                </div>
                
                <div className="space-y-4 my-auto py-4">
                  {[
                    { label: "In Stock Products", count: inventoryData.inStockProducts, color: "bg-emerald-500", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                    { label: "Low Stock Products", count: inventoryData.lowStockProducts, color: "bg-amber-500", bg: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                    { label: "Out of Stock Products", count: inventoryData.outOfStockProducts, color: "bg-destructive", bg: "bg-destructive/10 text-destructive border-destructive/20" },
                  ].map((group, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-muted-foreground font-semibold">{group.label}</span>
                      <div className="flex items-center gap-2.5">
                        <span className={cn("size-2 rounded-full", group.color)} />
                        <span className="font-extrabold text-foreground text-sm tabular-nums">{group.count}</span>
                      </div>
                    </div>
                  ))}

                  {inventoryData.lowStockProducts + inventoryData.outOfStockProducts > 0 && (
                    <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 p-3.5 mt-4">
                      <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
                        {inventoryData.lowStockProducts + inventoryData.outOfStockProducts} catalog items require a restock check to prevent sales downtime.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border/60 text-[10px] text-muted-foreground flex justify-between items-center bg-muted/5 -mx-5 -mb-5 px-5 py-3">
                  <span>Data is refreshed in real-time</span>
                  <Link href="/inventory" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
                    Manage Stock <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Simple custom component to prevent jsx warnings
function ValueHead({ children }: { children: React.ReactNode }) {
  return <TableHead className="pl-5">{children}</TableHead>;
}
