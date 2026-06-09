"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  Minus,
  Plus,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { ListPageHeader } from "@/components/layout/list-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { mapApiProductToRecord } from "@/lib/products/map-api-product";
import { LOW_STOCK_THRESHOLD } from "@/lib/products/constants";
import type { ProductRecord, StockAdjustmentLog } from "@/lib/products/types";
import { cn } from "@/lib/utils";
import { inventoryService, productService, isApiError, type InventorySummaryData } from "@/lib/api";
import { InventorySkeleton } from "./inventory-skeleton";

type MappedStockAdjustmentLog = StockAdjustmentLog & {
  stockAfterAction?: number;
};

export function InventoryView() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [logs, setLogs] = useState<MappedStockAdjustmentLog[]>([]);
  const [summary, setSummary] = useState<InventorySummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.list({ page: 0, size: 100 });
      const mapped = response.items.map(mapApiProductToRecord);
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products from backend:", err);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const result = await inventoryService.getLogs({ page: 1, size: 50 });
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
        };
      });
      setLogs(mappedLogs);
    } catch (err) {
      console.error("Failed to fetch inventory logs from backend:", err);
      setLogs([]);
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

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        await Promise.all([fetchProducts(), fetchLogs(), fetchSummary()]);
      } catch (err) {
        console.error("Failed to load inventory logs data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [fetchProducts, fetchLogs, fetchSummary]);

  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const catalogItems = products.length;
  const lowStock = products.filter(
    (p) => p.stock <= (p.min_stock_level ?? LOW_STOCK_THRESHOLD),
  ).length;

  const lowStockProducts = products.filter(
    (p) => p.stock <= (p.min_stock_level ?? LOW_STOCK_THRESHOLD),
  );

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Inventory Logs"
        description="Track real-time stock intake, outflow, modifications, and ledger movements."
      />

      {isLoading ? (
        <InventorySkeleton />
      ) : (
        <>
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

          <Card className="surface-card rounded-xl border border-amber-500/10 bg-gradient-to-br from-card via-card to-amber-500/[0.02] p-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 size-16 bg-amber-500/5 rounded-full blur-xl -z-10" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Stock Outflow</span>
              <span className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                <Minus className="size-4" />
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column: Inventory Logs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="surface-card rounded-2xl border border-primary/5 bg-gradient-to-br from-card via-card to-primary/[0.005] shadow-sm hover:border-primary/10 hover:shadow-md hover:shadow-primary/[0.01] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 px-5 py-4 bg-muted/5">
              <div>
                <CardTitle className="text-sm font-black tracking-tight text-foreground flex items-center gap-2">
                  <ClipboardList className="size-4 text-primary animate-pulse" />
                  Inventory Adjustment Logs
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Real-time ledger recording product stock modifications and inventory events
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {logs.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground space-y-2">
                  <ClipboardList className="size-8 text-muted-foreground/45 mx-auto" />
                  <p className="font-bold">No logs available</p>
                  <p className="text-xs max-w-xs mx-auto text-muted-foreground/75">No stock adjustments have been recorded in the system ledger yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-5">Date & Time</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3">Product Details</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Variance</TableHead>
                          <TableHead className="hidden sm:table-cell text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-3 text-center">Stock After</TableHead>
                          <TableHead className="hidden md:table-cell text-[10px] font-black uppercase tracking-wider text-muted-foreground py-3 px-4">Remarks / Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {logs.map((log) => (
                          <TableRow key={log.id} className="hover:bg-muted/30 transition-colors duration-150 border-b border-border/40 last:border-b-0">
                            <TableCell className="py-3 px-5 text-xs text-foreground font-medium tabular-nums">
                              <span className="font-semibold block">{new Date(log.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                              <span className="text-[10px] text-muted-foreground/75 block mt-0.5">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-3">
                              <div className="font-bold text-xs text-foreground tracking-tight">{log.product_name}</div>
                              <div className="text-[9px] text-muted-foreground font-mono mt-0.5 tracking-wider">{log.sku}</div>
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
                            <TableCell className="hidden sm:table-cell py-3 px-3 text-center">
                              <span className="text-xs font-black tabular-nums text-foreground">
                                {log.stockAfterAction !== undefined ? log.stockAfterAction : "-"}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell py-3 px-4 text-xs text-muted-foreground/90 italic font-medium max-w-[160px] truncate" title={log.reason}>
                              “{log.reason}”
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="divide-y divide-border/40 md:hidden">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {new Date(log.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 font-black text-[10px] px-2.5 py-0.5 rounded-full border shadow-inner",
                              log.type === "in"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : log.type === "out"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                  : "bg-primary/10 text-primary border-primary/20"
                            )}
                          >
                            {log.type === "in" ? "+" : log.type === "out" ? "-" : ""}
                            {log.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground tracking-tight">{log.product_name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{log.sku}</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/20">
                          <span>Stock after: <strong className="text-foreground">{log.stockAfterAction !== undefined ? log.stockAfterAction : "-"}</strong></span>
                          {log.reason && (
                            <span className="italic truncate max-w-[150px]">“{log.reason}”</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar adjustment & alerts */}
        <div className="space-y-6">


          {/* Most Active Items card */}
          {summary && summary.mostActiveProducts && summary.mostActiveProducts.length > 0 && (
            <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-violet-500/[0.01]">
              <CardHeader className="border-b border-border/40 px-4 py-3 bg-muted/5">
                <CardTitle className="text-xs font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
                  <Boxes className="size-4 text-violet-500" />
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

          {/* Current Stock Levels Snapshot Card */}
          <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-primary/[0.005]">
            <CardHeader className="border-b border-border/40 px-4 py-3 bg-muted/5">
              <CardTitle className="text-xs font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
                <Boxes className="size-4 text-primary animate-pulse" />
                Current stock levels
              </CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground">
                Snapshot of active product availability
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted">
                {products.length === 0 ? (
                  <p className="text-center py-6 text-xs text-muted-foreground">
                    No products in catalog.
                  </p>
                ) : (
                  products.map((p) => {
                    const minStock = p.min_stock_level ?? LOW_STOCK_THRESHOLD;
                    const isLow = p.stock <= minStock;
                    return (
                      <div key={p.id} className="flex items-center justify-between text-xs border-b border-border/40 pb-2 last:border-0 last:pb-0 hover:bg-muted/10 p-1 rounded transition-colors duration-150">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-bold text-foreground truncate text-[11px]">{p.name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono truncate">{p.sku}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-black tabular-nums text-xs",
                              isLow ? "text-amber-500 font-extrabold" : "text-foreground"
                            )}
                          >
                            {p.stock}
                          </span>
                          {isLow ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[8px] px-1 py-0 h-3.5"
                            >
                              Low
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[8px] px-1 py-0 h-3.5"
                            >
                              OK
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
