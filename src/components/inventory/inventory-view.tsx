"use client";

import { AlertTriangle, Boxes, Plus, Minus, ArrowUpRight, ArrowDownRight, RefreshCw, ClipboardList, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getAllProducts,
  adjustStock,
  getStockAdjustmentLogs,
} from "@/lib/products/mock-store";
import type { ProductRecord, StockAdjustmentLog } from "@/lib/products/types";
import { cn } from "@/lib/utils";

export function InventoryView() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [logs, setLogs] = useState<StockAdjustmentLog[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [adjustType, setAdjustType] = useState<"in" | "out" | "adjustment">("in");
  const [adjustQty, setAdjustQty] = useState<number | "">("");
  const [adjustReason, setAdjustReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    setProducts(getAllProducts());
    setLogs(getStockAdjustmentLogs());
  }, []);

  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.min_stock_level);
  const totalProductsCount = products.length;

  function handleAdjustStock(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!selectedProductId) {
      setMsg({ text: "Please select a product.", type: "error" });
      return;
    }
    if (adjustQty === "" || adjustQty <= 0) {
      setMsg({ text: "Quantity must be greater than zero.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const prod = products.find((p) => p.id === selectedProductId);
      if (!prod) {
        setMsg({ text: "Product not found.", type: "error" });
        setIsSubmitting(false);
        return;
      }

      if (adjustType === "out" && prod.stock < adjustQty) {
        setMsg({
          text: `Insufficient stock. Current stock is ${prod.stock}, cannot deduct ${adjustQty}.`,
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const updated = adjustStock(
        selectedProductId,
        Number(adjustQty),
        adjustType,
        adjustReason || `Manual stock adjustment (${adjustType})`
      );

      if (updated) {
        setProducts(getAllProducts());
        setLogs(getStockAdjustmentLogs());
        setAdjustQty("");
        setAdjustReason("");
        setMsg({
          text: `Successfully adjusted stock for ${updated.name}.`,
          type: "success",
        });
      } else {
        setMsg({ text: "Failed to adjust stock. Try again.", type: "error" });
      }
      setIsSubmitting(false);
    }, 400);
  }

  return (
    <div className="space-y-4">
      {/* Mini-Stats cards */}
      <div className="grid gap-3 grid-cols-3">
        <Card size="sm" className="interactive-card">
          <CardContent className="flex items-center gap-3 p-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Boxes className="size-4.5" />
            </span>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total stock</p>
              <p className="text-base font-bold tabular-nums leading-none mt-1">{totalStockItems.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm" className="interactive-card">
          <CardContent className="flex items-center gap-3 p-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="size-4.5" />
            </span>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Low stock items</p>
              <p className="text-base font-bold tabular-nums leading-none mt-1 text-amber-600 dark:text-amber-400">
                {lowStockProducts.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm" className="interactive-card">
          <CardContent className="flex items-center gap-3 p-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <ClipboardList className="size-4.5" />
            </span>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Total catalog items</p>
              <p className="text-base font-bold tabular-nums leading-none mt-1">{totalProductsCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main inventory list */}
        <div className="lg:col-span-2 space-y-4">
          <Card size="sm">
            <CardHeader className="border-b py-2 px-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-semibold">Current Stock Levels</CardTitle>
                <CardDescription className="text-[10px]">Real-time physical stock audit details</CardDescription>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                <RefreshCw className="size-2.5 animate-spin-slow" /> Auto-sync active
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {products.length === 0 ? (
                <p className="text-center py-8 text-xs text-muted-foreground">No products in catalog. Add products first.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs py-1 px-3">SKU</TableHead>
                      <TableHead className="text-xs py-1">Name</TableHead>
                      <TableHead className="text-center text-xs py-1">Stock</TableHead>
                      <TableHead className="text-center text-xs py-1">Threshold</TableHead>
                      <TableHead className="text-center text-xs py-1">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => {
                      const isLow = p.stock <= p.min_stock_level;
                      return (
                        <TableRow key={p.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs py-2 px-3 text-muted-foreground">{p.sku}</TableCell>
                          <TableCell className="py-2">
                            <div className="font-medium text-xs">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground">{p.category}</div>
                          </TableCell>
                          <TableCell className="text-center py-2">
                            <span
                              className={cn(
                                "font-semibold tabular-nums text-xs",
                                isLow ? "text-amber-600 dark:text-amber-400 font-bold" : "text-foreground"
                              )}
                            >
                              {p.stock}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-2 text-[11px] text-muted-foreground tabular-nums">
                            {p.min_stock_level}
                          </TableCell>
                          <TableCell className="text-center py-2">
                            {isLow ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] px-1 py-0 h-4">
                                Low stock
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] px-1 py-0 h-4">
                                Healthy
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar adjustment & alerts */}
        <div className="space-y-4">
          {/* Quick adjust widget */}
          <Card size="sm" className="shadow-sm">
            <CardHeader className="border-b py-2 px-3">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <PlusCircle className="size-3.5 text-primary" /> Adjust Inventory Level
              </CardTitle>
              <CardDescription className="text-[10px]">Quick stock intake or deduction handler</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <form onSubmit={handleAdjustStock} className="space-y-3">
                {msg ? (
                  <p
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[11px] font-medium leading-tight",
                      msg.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                        : "border-destructive/30 bg-destructive/5 text-destructive"
                    )}
                  >
                    {msg.text}
                  </p>
                ) : null}

                <div className="space-y-1">
                  <label htmlFor="prod-select" className="text-[10px] font-medium text-muted-foreground">Select Product</label>
                  <select
                    id="prod-select"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-background/50 px-2 py-1 text-xs shadow-inner outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">-- Choose item --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Current: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType("in")}
                    className={cn(
                      "flex h-8 items-center justify-center gap-1 rounded-md border text-xs font-medium transition-all",
                      adjustType === "in"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Plus className="size-3" /> In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("out")}
                    className={cn(
                      "flex h-8 items-center justify-center gap-1 rounded-md border text-xs font-medium transition-all",
                      adjustType === "out"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Minus className="size-3" /> Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType("adjustment")}
                    className={cn(
                      "flex h-8 items-center justify-center gap-1 rounded-md border text-xs font-medium transition-all",
                      adjustType === "adjustment"
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1">
                    <label htmlFor="adjust-qty" className="text-[10px] font-medium text-muted-foreground">Qty</label>
                    <Input
                      id="adjust-qty"
                      type="number"
                      placeholder="e.g. 5"
                      value={adjustQty}
                      onChange={(e) => setAdjustQty(e.target.value === "" ? "" : Number(e.target.value))}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label htmlFor="adjust-reason" className="text-[10px] font-medium text-muted-foreground">Reason</label>
                    <Input
                      id="adjust-reason"
                      placeholder="e.g. Received shipment"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                </div>

                <Button type="submit" size="sm" className="w-full h-8 text-xs font-semibold mt-1" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Execute Adjustment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Low Stock Warning box */}
          {lowStockProducts.length > 0 ? (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                <AlertTriangle className="size-3.5" />
                <span>Attention Required: Low Stock</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {lowStockProducts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{p.name} <code className="text-[9px] font-mono">({p.sku})</code></span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                      {p.stock} left (Min {p.min_stock_level})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Ledger history list */}
          <Card size="sm">
            <CardHeader className="border-b py-2 px-3">
              <CardTitle className="text-xs font-semibold">Stock Adjustment Ledger</CardTitle>
              <CardDescription className="text-[10px]">Chronological warehouse records</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <p className="text-center py-4 text-[11px] text-muted-foreground">No logs recorded yet.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="border-b pb-2 last:border-b-0 last:pb-0 text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground truncate max-w-[120px]">{log.product_name}</span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5 font-semibold text-[10px] tabular-nums",
                            log.type === "in"
                              ? "text-emerald-600"
                              : log.type === "out"
                              ? "text-amber-600"
                              : "text-primary"
                          )}
                        >
                          {log.type === "in" ? (
                            <ArrowUpRight className="size-2.5" />
                          ) : log.type === "out" ? (
                            <ArrowDownRight className="size-2.5" />
                          ) : null}
                          {log.type === "in" ? "+" : log.type === "out" ? "-" : ""}
                          {log.quantity}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic truncate leading-normal">“{log.reason}”</p>
                      <p className="text-[9px] text-muted-foreground/80 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
