"use client";

import { Edit2 } from "lucide-react";

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
};

export function ProductsTable({
  products,
  totalItems,
  onEditProduct,
}: ProductsTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <div className="border-b px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-foreground">Product catalog</p>
        <p className="text-xs text-muted-foreground">
          {totalItems} product{totalItems === 1 ? "" : "s"} in your workspace
        </p>
      </div>
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
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      isLowStock
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-foreground",
                    )}
                  >
                    {product.stock}
                  </span>
                  {isLowStock ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
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
  );
}
