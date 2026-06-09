"use client";

import { Edit2, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/invoices/format";
import { LOW_STOCK_THRESHOLD } from "@/lib/products/constants";
import type { ProductRecord } from "@/lib/products/types";
import { cn } from "@/lib/utils";

type ProductsTableProps = {
  products: ProductRecord[];
  totalItems: number;
  onEditProduct: (product: ProductRecord) => void;
  onStockAdjust?: (product: ProductRecord, newStock: number) => void;
};

export function ProductsTable({
  products,
  totalItems,
  onEditProduct,
  onStockAdjust,
}: ProductsTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <div className="border-b px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-foreground">Product catalog</p>
        <p className="text-xs text-muted-foreground">
          {totalItems} product{totalItems === 1 ? "" : "s"} in your workspace
        </p>
      </div>
      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Selling price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="text-left font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {product.name}
                    </button>
                    {product.description ? (
                      <p className="max-w-xs truncate text-xs text-muted-foreground md:max-w-sm">
                        {product.description}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold tabular-nums">
                    {formatCurrency(product.price, "INR")}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onStockAdjust?.(product, product.stock - 1)}
                        disabled={product.stock <= 0}
                        aria-label="Decrease stock"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span
                        className={cn(
                          "text-sm font-semibold tabular-nums min-w-[20px]",
                          isLowStock
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-foreground",
                        )}
                      >
                        {product.stock}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => onStockAdjust?.(product, product.stock + 1)}
                        aria-label="Increase stock"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    {isLowStock ? (
                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 animate-pulse">
                        Low stock
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {product.created_at
                      ? new Date(product.created_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => onEditProduct(product)}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="divide-y divide-border/40 sm:hidden">
        {products.map((product) => {
          const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
          return (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {product.sku}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                  onClick={() => onEditProduct(product)}
                  aria-label={`Edit ${product.name}`}
                >
                  <Edit2 className="size-3.5" />
                </Button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onEditProduct(product)}
                  className="text-left font-semibold text-sm text-foreground hover:text-primary hover:underline"
                >
                  {product.name}
                </button>
                {product.description ? (
                  <p className="max-w-xs truncate text-xs text-muted-foreground mt-0.5">
                    {product.description}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-between items-center pt-1">
                <p className="text-sm font-bold text-primary tabular-nums">
                  {formatCurrency(product.price, "INR")}
                </p>
                <div className="flex items-center gap-2">
                  {isLowStock ? (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                      Low
                    </span>
                  ) : null}
                  <div className="flex items-center gap-1 bg-muted/20 border rounded-lg p-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={() => onStockAdjust?.(product, product.stock - 1)}
                      disabled={product.stock <= 0}
                      aria-label="Decrease stock"
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 tabular-nums min-w-[24px] text-center",
                        isLowStock
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-foreground"
                      )}
                    >
                      {product.stock}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={() => onStockAdjust?.(product, product.stock + 1)}
                      aria-label="Increase stock"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
