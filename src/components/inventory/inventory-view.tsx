"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Minus,
  PlusCircle,
  Search,
  Activity,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import { ListPageHeader } from "@/components/layout/list-page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockAdjustmentLog } from "@/lib/products/types";
import { cn } from "@/lib/utils";
import { inventoryService, type InventorySummaryData, type BulkUploadAudit } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type InventoryAction } from "@/lib/api/types/inventory.types";
import { InventorySkeleton } from "./inventory-skeleton";
import { InventoryPagination } from "./inventory-pagination";
import { Skeleton } from "@/components/ui/skeleton";

type MappedStockAdjustmentLog = StockAdjustmentLog & {
  stockAfterAction?: number;
  action: string;
};

// Custom action style helper to display the action type tag next to the variance.
function getActionBadgeStyle(action: string) {
  switch (action) {
    case "PRODUCT_CREATED":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
    case "STOCK_ADDED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "STOCK_SOLD":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case "STOCK_ADJUSTED":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "PRICE_UPDATED":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "PRODUCT_DELETED":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "BULK_IMPORTED":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
}

function formatActionLabel(action: string) {
  return action.replace(/_/g, " ");
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function InventoryView() {
  const [logs, setLogs] = useState<MappedStockAdjustmentLog[]>([]);
  const [summary, setSummary] = useState<InventorySummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tabs state
  const [activeTab, setActiveTab] = useState<"ledger" | "uploads">("ledger");

  // Pagination states for Ledger Logs
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  // Pagination states for Bulk Upload Audits
  const [uploads, setUploads] = useState<BulkUploadAudit[]>([]);
  const [isUploadsLoading, setIsUploadsLoading] = useState(false);
  const [uploadsPage, setUploadsPage] = useState(1);
  const [uploadsPageSize, setUploadsPageSize] = useState(10);
  const [uploadsTotalPages, setUploadsTotalPages] = useState(1);
  const [uploadsTotalItems, setUploadsTotalItems] = useState(0);

  // Client-side search and filters
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<InventoryAction | "ALL">("ALL");

  const fetchLogs = useCallback(async (targetPage: number, targetPageSize: number, selectedAction?: InventoryAction) => {
    setIsLogsLoading(true);
    try {
      const result = await inventoryService.getLogs({
        page: targetPage,
        size: targetPageSize,
        action: selectedAction,
      });
      const mappedLogs: MappedStockAdjustmentLog[] = result.items.map((apiLog) => {
        const type =
          apiLog.quantityChange > 0
            ? "in"
            : apiLog.quantityChange < 0
              ? "out"
              : "adjustment";
        return {
          id: apiLog.id,
          product_id: apiLog.productId,
          product_name: apiLog.productName,
          sku: apiLog.productSku,
          type,
          quantity: Math.abs(apiLog.quantityChange),
          reason: apiLog.remarks || apiLog.action,
          timestamp: apiLog.createdAt,
          stockAfterAction: apiLog.stockAfterAction,
          action: apiLog.action,
        };
      });
      setLogs(mappedLogs);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    } catch (err) {
      console.error("Failed to fetch inventory logs from backend:", err);
      setLogs([]);
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  const fetchUploads = useCallback(async (targetPage: number, targetPageSize: number) => {
    setIsUploadsLoading(true);
    try {
      const result = await inventoryService.getUploadAudits({
        page: targetPage,
        size: targetPageSize,
      });
      setUploads(result.items);
      setUploadsTotalPages(result.totalPages);
      setUploadsTotalItems(result.totalItems);
    } catch (err) {
      console.error("Failed to fetch upload audits:", err);
      setUploads([]);
    } finally {
      setIsUploadsLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const result = await inventoryService.getSummary();
      setSummary(result);
    } catch (err) {
      console.error("Failed to fetch inventory summary from backend:", err);
    }
  }, []);

  const isMounted = useRef(false);

  // Initial load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchLogs(1, pageSize, actionFilter === "ALL" ? undefined : actionFilter),
          fetchSummary(),
          fetchUploads(1, uploadsPageSize)
        ]);
      } catch (err) {
        console.error("Failed to load inventory logs data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch logs when page/pageSize/actionFilter changes after initial mount
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (activeTab === "ledger") {
      fetchLogs(page, pageSize, actionFilter === "ALL" ? undefined : actionFilter);
    }
  }, [page, pageSize, actionFilter, activeTab, fetchLogs]);

  // Fetch uploads when uploadsPage/uploadsPageSize changes after initial mount
  useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    if (activeTab === "uploads") {
      fetchUploads(uploadsPage, uploadsPageSize);
    }
  }, [uploadsPage, uploadsPageSize, activeTab, fetchUploads]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // Client-side filtering of logs
  const filteredAndSearchedLogs = useMemo(() => {
    if (!logSearchQuery.trim()) return logs;
    const query = logSearchQuery.toLowerCase();
    return logs.filter((log) => {
      const matchesName = log.product_name.toLowerCase().includes(query);
      const matchesSku = log.sku.toLowerCase().includes(query);
      const matchesReason = log.reason.toLowerCase().includes(query);
      const matchesAction = log.action.toLowerCase().includes(query);
      return matchesName || matchesSku || matchesReason || matchesAction;
    });
  }, [logs, logSearchQuery]);

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Inventory Logs"
        description="Monitor real-time stock intake, outflow, modifications, and system ledger movements."
      />

      {isLoading ? (
        <InventorySkeleton />
      ) : (
        <>
          {/* Summary KPI Panel */}
          {summary && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="surface-card rounded-xl border border-blue-500/10 bg-gradient-to-br from-card via-card to-blue-500/[0.02] p-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 size-16 bg-blue-500/5 rounded-full blur-xl -z-10" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total Movements</span>
                  <span className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                    <ClipboardList className="size-4 animate-pulse" />
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-2xl font-black tracking-tight text-foreground tabular-nums">
                    {summary.totalLogsCount.toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Across {summary.affectedProducts} product{summary.affectedProducts === 1 ? "" : "s"}
                  </p>
                </div>
              </Card>

              <Card className="surface-card rounded-xl border border-emerald-500/10 bg-gradient-to-br from-card via-card to-emerald-500/[0.02] p-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 size-16 bg-emerald-500/5 rounded-full blur-xl -z-10" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Stock Intake</span>
                  <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                    <PlusCircle className="size-4" />
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{summary.totalQuantityAdded.toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Total units added</p>
                </div>
              </Card>

              <Card className="surface-card rounded-xl border border-rose-500/10 bg-gradient-to-br from-card via-card to-rose-500/[0.02] p-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 size-16 bg-rose-500/5 rounded-full blur-xl -z-10" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">Stock Outflow</span>
                  <span className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                    <Minus className="size-4" />
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
                    -{summary.totalQuantityRemoved.toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Total units removed</p>
                </div>
              </Card>

              <Card className={cn(
                "surface-card rounded-xl border p-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                summary.netQuantityChange >= 0 ? "border-emerald-500/10 bg-gradient-to-br from-card via-card to-emerald-500/[0.02]" : "border-destructive/10 bg-gradient-to-br from-card via-card to-destructive/[0.02]"
              )}>
                <div className="absolute top-0 right-0 size-16 rounded-full blur-xl -z-10" style={{ backgroundColor: summary.netQuantityChange >= 0 ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Net Variance</span>
                  <span className={cn(
                    "rounded-lg p-2",
                    summary.netQuantityChange >= 0
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                  )}>
                    <Boxes className="size-4" />
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className={cn(
                    "text-2xl font-black tracking-tight tabular-nums",
                    summary.netQuantityChange >= 0 ? "text-emerald-600" : "text-destructive"
                  )}>
                    {summary.netQuantityChange >= 0 ? "+" : ""}{summary.netQuantityChange.toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Net stock difference</p>
                </div>
              </Card>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Ledger Logs Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-border/40 space-x-6 mb-2">
                <button
                  onClick={() => setActiveTab("ledger")}
                  className={cn(
                    "pb-3 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2",
                    activeTab === "ledger"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Ledger Logs
                </button>
                <button
                  onClick={() => setActiveTab("uploads")}
                  className={cn(
                    "pb-3 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2",
                    activeTab === "uploads"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Bulk Upload Audits
                </button>
              </div>

              {activeTab === "ledger" ? (
                <>
                  <Card className="surface-card rounded-2xl border border-primary/5 bg-gradient-to-br from-card via-card to-primary/[0.005] shadow-sm hover:border-primary/10 hover:shadow-md hover:shadow-primary/[0.01] transition-all duration-300">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 px-5 py-4 bg-muted/5">
                      <div>
                        <CardTitle className="text-sm font-black tracking-tight text-foreground flex items-center gap-2">
                          <ClipboardList className="size-4 text-primary animate-pulse" />
                          Inventory Adjustment Logs
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">
                          Real-time ledger recording product stock modifications and inventory events
                        </CardDescription>
                      </div>

                      {/* Log Filter Dropdown */}
                      <div className="w-full sm:w-auto">
                        <Select
                          value={actionFilter}
                          onValueChange={(value) => {
                            setActionFilter(value as InventoryAction | "ALL");
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-9 w-full sm:w-44 bg-background">
                            <SelectValue placeholder="Filter by action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">All Actions</SelectItem>
                            <SelectItem value="PRODUCT_CREATED">Product Created</SelectItem>
                            <SelectItem value="STOCK_ADDED">Stock Added</SelectItem>
                            <SelectItem value="STOCK_SOLD">Stock Sold</SelectItem>
                            <SelectItem value="STOCK_ADJUSTED">Stock Adjusted</SelectItem>
                            <SelectItem value="PRICE_UPDATED">Price Updated</SelectItem>
                            <SelectItem value="PRODUCT_DELETED">Product Deleted</SelectItem>
                            <SelectItem value="BULK_IMPORTED">Bulk Imported</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>

                    <div className="px-5 pt-4">
                      {/* Search Input Bar */}
                      <div className="relative w-full">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/60" />
                        <Input
                          type="search"
                          placeholder="Search log by product name, SKU, or remarks..."
                          value={logSearchQuery}
                          onChange={(e) => setLogSearchQuery(e.target.value)}
                          className="pl-9 h-10 w-full bg-background border-border"
                        />
                      </div>
                    </div>

                    <CardContent className="p-0 pt-4">
                      {isLogsLoading ? (
                        <div className="divide-y divide-border/40">
                          {Array.from({ length: pageSize }).map((_, index) => (
                            <div key={index} className="p-4 flex items-center justify-between">
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3.5 w-24" />
                              </div>
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          ))}
                        </div>
                      ) : filteredAndSearchedLogs.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground space-y-2">
                          <ClipboardList className="size-8 text-muted-foreground/45 mx-auto" />
                          <p className="font-bold">No logs available</p>
                          <p className="text-xs max-w-xs mx-auto text-muted-foreground/75">No stock adjustments have been recorded in the system ledger yet.</p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table View */}
                          <div className="hidden md:block [&_[data-slot=table-container]]:overflow-x-hidden">
                            <Table>
                              <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent">
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-5">Date & Time</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3">Product Details</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Action</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Variance</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Stock After</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-4">Remarks / Reason</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredAndSearchedLogs.map((log) => (
                                  <TableRow key={log.id} className="hover:bg-muted/30 transition-colors duration-150 border-b border-border/40 last:border-b-0">
                                    <TableCell className="py-3 px-5 text-xs text-foreground font-medium tabular-nums">
                                      <span className="font-semibold block">{new Date(log.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                      <span className="text-[10px] text-muted-foreground/75 block mt-0.5">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 whitespace-normal">
                                      <div className="font-bold text-xs text-foreground tracking-tight">{log.product_name}</div>
                                      <div className="text-[9px] text-muted-foreground font-mono mt-0.5 tracking-wider">{log.sku}</div>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 text-center">
                                      <Badge
                                        className={cn(
                                          "text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm select-none uppercase tracking-wide",
                                          getActionBadgeStyle(log.action)
                                        )}
                                        variant="outline"
                                      >
                                        {formatActionLabel(log.action)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 text-center">
                                      <span
                                        className={cn(
                                          "inline-flex items-center gap-1 font-black text-[10px] px-2.5 py-0.5 rounded-full border shadow-inner tabular-nums tracking-wide",
                                          log.type === "in"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                            : log.type === "out"
                                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                              : "bg-primary/10 text-primary border-primary/20"
                                        )}
                                      >
                                        {log.type === "in" ? (
                                          <ArrowUpRight className="size-3" />
                                        ) : log.type === "out" ? (
                                          <ArrowDownRight className="size-3" />
                                        ) : null}
                                        {log.type === "in" ? "+" : log.type === "out" ? "-" : ""}
                                        {log.quantity}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 text-center">
                                      <span className="text-xs font-black tabular-nums text-foreground">
                                        {log.stockAfterAction !== undefined ? log.stockAfterAction : "-"}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-xs text-muted-foreground/90 italic font-medium whitespace-normal max-w-[160px] truncate" title={log.reason}>
                                      {log.reason ? `“${log.reason}”` : <span className="text-muted-foreground/30 italic">No remarks</span>}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Card List View */}
                          <div className="divide-y divide-border/40 md:hidden">
                            {filteredAndSearchedLogs.map((log) => (
                              <div key={log.id} className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground font-semibold">
                                    {new Date(log.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  <Badge
                                    className={cn(
                                      "text-[8px] font-bold px-1.5 py-0 rounded-full border shadow-sm uppercase tracking-wide",
                                      getActionBadgeStyle(log.action)
                                    )}
                                    variant="outline"
                                  >
                                    {formatActionLabel(log.action)}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-foreground tracking-tight">{log.product_name}</p>
                                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{log.sku}</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/20">
                                  <span className="flex items-center gap-1">
                                    Var:
                                    <strong className={cn(
                                      "font-black text-[10px] px-1 py-0.5 rounded border shadow-sm",
                                      log.type === "in"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : log.type === "out"
                                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                          : "bg-primary/10 text-primary border-primary/20"
                                    )}>
                                      {log.type === "in" ? "+" : log.type === "out" ? "-" : ""}{log.quantity}
                                    </strong>
                                  </span>
                                  <span>Stock after: <strong className="text-foreground">{log.stockAfterAction !== undefined ? log.stockAfterAction : "-"}</strong></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {totalItems > 0 && (
                    <InventoryPagination
                      page={page}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      pageSize={pageSize}
                      onPageChange={setPage}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  )}
                </>
              ) : (
                <>
                  <Card className="surface-card rounded-2xl border border-primary/5 bg-gradient-to-br from-card via-card to-primary/[0.005] shadow-sm hover:border-primary/10 hover:shadow-md hover:shadow-primary/[0.01] transition-all duration-300">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 px-5 py-4 bg-muted/5">
                      <div>
                        <CardTitle className="text-sm font-black tracking-tight text-foreground flex items-center gap-2">
                          <UploadCloud className="size-4 text-primary animate-pulse" />
                          Bulk Upload Audits
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-0.5">
                          Audit log of bulk product catalog uploads and processing results
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      {isUploadsLoading ? (
                        <div className="divide-y divide-border/40">
                          {Array.from({ length: uploadsPageSize }).map((_, index) => (
                            <div key={index} className="p-4 flex items-center justify-between">
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3.5 w-24" />
                              </div>
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          ))}
                        </div>
                      ) : uploads.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground space-y-2">
                          <UploadCloud className="size-8 text-muted-foreground/45 mx-auto" />
                          <p className="font-bold">No uploads available</p>
                          <p className="text-xs max-w-xs mx-auto text-muted-foreground/75">No bulk upload operations have been recorded yet.</p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table View */}
                          <div className="hidden md:block [&_[data-slot=table-container]]:overflow-x-hidden">
                            <Table>
                              <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent">
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-5">Date & Time</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3">File Info</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Status</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Processed</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3">Uploaded By</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-4">Remarks / Error</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {uploads.map((audit) => (
                                  <TableRow key={audit.id} className="hover:bg-muted/30 transition-colors duration-150 border-b border-border/40 last:border-b-0">
                                    <TableCell className="py-3 px-5 text-xs text-foreground font-medium tabular-nums">
                                      <span className="font-semibold block">{new Date(audit.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                      <span className="text-[10px] text-muted-foreground/75 block mt-0.5">
                                        {new Date(audit.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 whitespace-normal">
                                      <div className="font-bold text-xs text-foreground tracking-tight flex items-center gap-1.5">
                                        <FileText className="size-3.5 text-muted-foreground flex-shrink-0" />
                                        {audit.filename}
                                      </div>
                                      <div className="text-[9px] text-muted-foreground font-mono mt-0.5 tracking-wider">
                                        {formatFileSize(audit.fileSize)}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 text-center">
                                      <Badge
                                        className={cn(
                                          "text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm select-none uppercase tracking-wide inline-flex items-center gap-1",
                                          audit.status === "SUCCESS"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                        )}
                                        variant="outline"
                                      >
                                        {audit.status === "SUCCESS" ? (
                                          <CheckCircle2 className="size-3" />
                                        ) : (
                                          <XCircle className="size-3" />
                                        )}
                                        {audit.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 text-center">
                                      <span className="text-xs font-black tabular-nums text-foreground">
                                        {audit.processedCount}
                                      </span>
                                    </TableCell>
                                    <TableCell className="py-3 px-3 text-xs font-medium text-foreground">
                                      {audit.uploadedBy}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-xs text-muted-foreground/90 italic font-medium whitespace-normal max-w-[200px]" title={audit.errorMessage || ""}>
                                      {audit.status === "SUCCESS" ? (
                                        <span className="text-emerald-500 dark:text-emerald-400">Processed successfully</span>
                                      ) : (
                                        <span className="text-rose-500 dark:text-rose-400 font-semibold flex items-start gap-1">
                                          <AlertCircle className="size-3.5 mt-0.5 flex-shrink-0" />
                                          {audit.errorMessage || "Unknown error"}
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Card List View */}
                          <div className="divide-y divide-border/40 md:hidden">
                            {uploads.map((audit) => (
                              <div key={audit.id} className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground font-semibold">
                                    {new Date(audit.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {new Date(audit.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  <Badge
                                    className={cn(
                                      "text-[8px] font-bold px-1.5 py-0 rounded-full border shadow-sm uppercase tracking-wide inline-flex items-center gap-0.5",
                                      audit.status === "SUCCESS"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                    )}
                                    variant="outline"
                                  >
                                    {audit.status}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-foreground tracking-tight flex items-center gap-1">
                                    <FileText className="size-3 text-muted-foreground" />
                                    {audit.filename}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground mt-0.5">{formatFileSize(audit.fileSize)}</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/20">
                                  <span>Uploaded by: <strong className="text-foreground">{audit.uploadedBy}</strong></span>
                                  <span>Processed: <strong className="text-foreground">{audit.processedCount}</strong></span>
                                </div>
                                {audit.errorMessage && (
                                  <div className="text-[9px] text-rose-500 bg-rose-500/5 border border-rose-500/10 rounded p-1.5 mt-1">
                                    <strong>Error:</strong> {audit.errorMessage}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {uploadsTotalItems > 0 && (
                    <InventoryPagination
                      page={uploadsPage}
                      totalPages={uploadsTotalPages}
                      totalItems={uploadsTotalItems}
                      pageSize={uploadsPageSize}
                      onPageChange={setUploadsPage}
                      onPageSizeChange={(newSize) => {
                        setUploadsPageSize(newSize);
                        setUploadsPage(1);
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-6">
              {/* Most Active Items (Visual Progress) */}
              {summary && summary.mostActiveProducts && summary.mostActiveProducts.length > 0 && (
                <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-violet-500/[0.01]">
                  <CardHeader className="border-b border-border/40 px-4 py-3 bg-muted/5">
                    <CardTitle className="text-xs font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
                      <Activity className="size-4 text-violet-500" />
                      Most active items
                    </CardTitle>
                    <CardDescription className="text-[10px] text-muted-foreground">
                      Products with the highest modification frequency
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {summary.mostActiveProducts.map((p) => {
                      const maxCount = Math.max(...summary.mostActiveProducts.map(x => x.movementCount), 1);
                      const progressPct = Math.round((p.movementCount / maxCount) * 100);
                      return (
                        <div key={p.productSku} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="font-bold text-foreground truncate text-[11px]">{p.productName}</p>
                              <p className="text-[9px] text-muted-foreground font-mono truncate">{p.productSku}</p>
                            </div>
                            <span className="text-[9px] font-black bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full px-2 py-0.5 whitespace-nowrap">
                              {p.movementCount} movement{p.movementCount === 1 ? "" : "s"}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}


            </div>
          </div>
        </>
      )}
    </div>
  );
}
