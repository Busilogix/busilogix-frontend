import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductRecord } from "@/lib/products/types";
import { cn } from "@/lib/utils";

type ProductsTableProps = {
  products: ProductRecord[];
  onDeleteProduct: (product: ProductRecord) => void;
};

export function ProductsTable({ products, onDeleteProduct }: ProductsTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">SKU</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock Level</TableHead>
            <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.stock <= product.min_stock_level;
            return (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                  {product.sku}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{product.name}</div>
                  <div className="truncate max-w-[240px] text-xs text-muted-foreground md:max-w-xs">
                    {product.description}
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell text-xs">
                  {product.category}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        "font-semibold tabular-nums text-sm",
                        isLowStock ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                      )}
                    >
                      {product.stock}
                    </span>
                    {isLowStock ? (
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        Low stock ({product.min_stock_level})
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Min: {product.min_stock_level}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  <Badge
                    variant={product.status === "active" ? "outline" : "secondary"}
                    className={cn(
                      product.status === "active" &&
                        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    )}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-7 text-muted-foreground hover:text-foreground"
                      )}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 className="size-3.5" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteProduct(product)}
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
