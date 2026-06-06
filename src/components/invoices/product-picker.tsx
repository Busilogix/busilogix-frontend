"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency } from "@/lib/invoices/format";
import type { ApiProduct } from "@/lib/api/types/product.types";
import { getApiProductStock } from "@/lib/products/map-api-product";
import { cn } from "@/lib/utils";

type ProductPickerProps = {
  value: string;
  onChange: (productId: string) => void;
  products: ApiProduct[];
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
};

export function ProductPicker({
  value,
  onChange,
  products,
  disabled = false,
  invalid = false,
  placeholder = "Search product by name or SKU",
}: ProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedProduct = products.find((product) => product.id === value);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery),
    );
  }, [products, query]);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setQuery("");
        }
      }}
    >
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-between bg-background/80 font-normal",
              invalid && "border-destructive",
            )}
            aria-invalid={invalid}
          />
        }
      >
        <span className="truncate">
          {selectedProduct
            ? `${selectedProduct.name} (${selectedProduct.sku})`
            : placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[min(24rem,var(--anchor-width))] p-0"
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type name or SKU..."
              className="h-9 border-0 bg-muted/40 pl-8 shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1">
          {filteredProducts.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No products match your search.
            </p>
          ) : (
            filteredProducts.map((product) => {
              const stock = getApiProductStock(product);
              const isSelected = product.id === value;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onChange(product.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                    isSelected && "bg-primary/10",
                  )}
                >
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {product.sku} ·{" "}
                      {formatCurrency(product.sellingPrice, "INR")} · {stock} in
                      stock
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
