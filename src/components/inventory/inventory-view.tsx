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
import { useState, useEffect } from "react";

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
import {
  adjustStock,
  getAllProducts,
  getInventoryStats,
  getStockAdjustmentLogs,
} from "@/lib/products/mock-store";
import { LOW_STOCK_THRESHOLD } from "@/lib/products/constants";
import type { ProductRecord, StockAdjustmentLog } from "@/lib/products/types";
import { cn } from "@/lib/utils";

export function InventoryView() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [logs, setLogs] = useState<StockAdjustmentLog[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [adjustType, setAdjustType] = useState<"in" | "out" | "adjustment">(
    "in",
  );
  const [adjustQty, setAdjustQty] = useState<number | "">("");
  const [adjustReason, setAdjustReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    setProducts(getAllProducts());
    setLogs(getStockAdjustmentLogs());
  }, []);

  const inventoryStats = getInventoryStats();
  const lowStockProducts = products.filter(
    (p) => p.stock <= (p.min_stock_level ?? LOW_STOCK_THRESHOLD),
  );

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
        adjustReason || `Manual stock adjustment (${adjustType})`,
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
    <div className="space-y-6">
      <ListPageHeader
        title="Inventory"
        description="Monitor stock levels, handle adjustments, and stay ahead of low-stock alerts."
        action={{ label: "Add product", href: "/products/new", icon: Plus }}
        metrics={[
          {
            title: "Total units",
            value: inventoryStats.totalUnits.toLocaleString(),
            description: "Units across all products",
            icon: Boxes,
            tone: "blue",
          },
          {
            title: "Catalog items",
            value: inventoryStats.catalogItems.toLocaleString(),
            description: "Products being tracked",
            icon: ClipboardList,
            tone: "violet",
          },
          {
            title: "Low stock",
            value: inventoryStats.lowStock.toLocaleString(),
            description: "Need replenishment",
            icon: AlertTriangle,
            tone: "amber",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main inventory list */}
        <div className="lg:col-span-2 space-y-4">
          <Card size="sm" className="surface-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
              <div>
                <CardTitle className="text-sm">Current stock levels</CardTitle>
                <CardDescription>
                  {products.length} product{products.length === 1 ? "" : "s"} in
                  catalog
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {products.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No products in catalog.{" "}
                  <Link
                    href="/products/new"
                    className="font-medium text-primary hover:underline"
                  >
                    Add a product
                  </Link>{" "}
                  first.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs py-1 px-3">SKU</TableHead>
                      <TableHead className="text-xs py-1">Name</TableHead>
                      <TableHead className="text-center text-xs py-1">
                        Stock
                      </TableHead>
                      <TableHead className="text-center text-xs py-1">
                        Threshold
                      </TableHead>
                      <TableHead className="text-center text-xs py-1">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => {
                      const minStock = p.min_stock_level ?? LOW_STOCK_THRESHOLD;
                      const isLow = p.stock <= minStock;
                      return (
                        <TableRow key={p.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs py-2 px-3 text-muted-foreground">
                            {p.sku}
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="font-medium text-xs">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {p.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2">
                            <span
                              className={cn(
                                "font-semibold tabular-nums text-xs",
                                isLow
                                  ? "text-amber-600 dark:text-amber-400 font-bold"
                                  : "text-foreground",
                              )}
                            >
                              {p.stock}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-2 text-[11px] text-muted-foreground tabular-nums">
                            {minStock}
                          </TableCell>
                          <TableCell className="text-center py-2">
                            {isLow ? (
                              <Badge
                                variant="outline"
                                className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px] px-1 py-0 h-4"
                              >
                                Low stock
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] px-1 py-0 h-4"
                              >
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
          <Card size="sm" className="surface-card rounded-xl">
            <CardHeader className="border-b px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <PlusCircle className="size-4 text-primary" />
                Adjust inventory
              </CardTitle>
              <CardDescription>
                Record stock intake, deductions, or corrections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleAdjustStock} className="space-y-3">
                {msg ? (
                  <p
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[11px] font-medium leading-tight",
                      msg.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                        : "border-destructive/30 bg-destructive/5 text-destructive",
                    )}
                  >
                    {msg.text}
                  </p>
                ) : null}

                <div className="space-y-1">
                  <label
                    htmlFor="prod-select"
                    className="text-[10px] font-medium text-muted-foreground"
                  >
                    Select Product
                  </label>
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
                        : "bg-background text-muted-foreground hover:text-foreground",
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
                        : "bg-background text-muted-foreground hover:text-foreground",
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
                        : "bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1">
                    <label
                      htmlFor="adjust-qty"
                      className="text-[10px] font-medium text-muted-foreground"
                    >
                      Qty
                    </label>
                    <Input
                      id="adjust-qty"
                      type="number"
                      placeholder="e.g. 5"
                      value={adjustQty}
                      onChange={(e) =>
                        setAdjustQty(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="h-8 text-xs px-2"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label
                      htmlFor="adjust-reason"
                      className="text-[10px] font-medium text-muted-foreground"
                    >
                      Reason
                    </label>
                    <Input
                      id="adjust-reason"
                      placeholder="e.g. Received shipment"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="w-full h-8 text-xs font-semibold mt-1"
                  disabled={isSubmitting}
                >
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
                  <li
                    key={p.id}
                    className="flex items-center justify-between text-[11px] text-muted-foreground"
                  >
                    <span>
                      {p.name}{" "}
                      <code className="text-[9px] font-mono">({p.sku})</code>
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                      {p.stock} left (Min{" "}
                      {p.min_stock_level ?? LOW_STOCK_THRESHOLD})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Ledger history list */}
          <Card size="sm" className="surface-card rounded-xl">
            <CardHeader className="border-b px-4 py-3">
              <CardTitle className="text-sm">Adjustment ledger</CardTitle>
              <CardDescription>
                {inventoryStats.adjustmentCount} logged movement
                {inventoryStats.adjustmentCount === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <p className="text-center py-4 text-[11px] text-muted-foreground">
                    No logs recorded yet.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="border-b pb-2 last:border-b-0 last:pb-0 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground truncate max-w-[120px]">
                          {log.product_name}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5 font-semibold text-[10px] tabular-nums",
                            log.type === "in"
                              ? "text-emerald-600"
                              : log.type === "out"
                                ? "text-amber-600"
                                : "text-primary",
                          )}
                        >
                          {log.type === "in" ? (
                            <ArrowUpRight className="size-2.5" />
                          ) : log.type === "out" ? (
                            <ArrowDownRight className="size-2.5" />
                          ) : null}
                          {log.type === "in"
                            ? "+"
                            : log.type === "out"
                              ? "-"
                              : ""}
                          {log.quantity}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic truncate leading-normal">
                        “{log.reason}”
                      </p>
                      <p className="text-[9px] text-muted-foreground/80 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
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
