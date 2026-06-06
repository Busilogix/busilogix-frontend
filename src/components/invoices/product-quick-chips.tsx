"use client";

import type { ApiProduct } from "@/lib/api/types/product.types";
import { formatCurrency } from "@/lib/invoices/format";
import { getApiProductStock } from "@/lib/products/map-api-product";
import { cn } from "@/lib/utils";

type ProductQuickChipsProps = {
  products: ApiProduct[];
  recentProductIds: string[];
  quantity: number;
  disabled?: boolean;
  onAdd: (productId: string, quantity: number) => void;
};

function resolveQuickProducts(
  products: ApiProduct[],
  recentProductIds: string[],
  limit = 10,
): ApiProduct[] {
  const inStock = products.filter((product) => getApiProductStock(product) > 0);
  const byId = new Map(inStock.map((product) => [product.id, product]));
  const resolved: ApiProduct[] = [];

  for (const productId of recentProductIds) {
    const product = byId.get(productId);

    if (product) {
      resolved.push(product);
      byId.delete(productId);
    }
  }

  for (const product of inStock) {
    if (resolved.length >= limit) {
      break;
    }

    if (!resolved.some((entry) => entry.id === product.id)) {
      resolved.push(product);
    }
  }

  return resolved.slice(0, limit);
}

export function ProductQuickChips({
  products,
  recentProductIds,
  quantity,
  disabled = false,
  onAdd,
}: ProductQuickChipsProps) {
  const quickProducts = resolveQuickProducts(products, recentProductIds);

  if (quickProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Tap to add{quantity > 1 ? ` (${quantity} each)` : ""}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            disabled={disabled}
            onClick={() => onAdd(product.id, quantity)}
            className={cn(
              "flex min-h-14 min-w-[7.5rem] shrink-0 flex-col items-start justify-center rounded-xl border bg-background px-3 py-2 text-left transition-colors",
              "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <span className="line-clamp-1 text-sm font-medium">
              {product.name}
            </span>
            <span className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {formatCurrency(product.sellingPrice, "INR")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
