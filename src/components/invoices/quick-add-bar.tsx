"use client";

import { Barcode } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiProduct } from "@/lib/api/types/product.types";
import { formatCurrency } from "@/lib/invoices/format";
import { getApiProductStock } from "@/lib/products/map-api-product";
import {
  findBestProductMatch,
  findProductsByQuery,
} from "@/lib/invoices/quick-add-product";
import { cn } from "@/lib/utils";

const QTY_PRESETS = [1, 2, 5, 10] as const;

type QuickAddBarProps = {
  products: ApiProduct[];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
  onAdd: (productId: string, quantity: number) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function QuickAddBar({
  products,
  quantity,
  onQuantityChange,
  disabled = false,
  onAdd,
  inputRef,
}: QuickAddBarProps) {
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);
  const internalInputRef = useRef<HTMLInputElement | null>(null);
  const autoAddTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedInputRef = inputRef ?? internalInputRef;

  const suggestions = useMemo(
    () => findProductsByQuery(products, query),
    [products, query],
  );

  const trimmedQuery = query.trim();

  useEffect(() => {
    setHighlightIndex(0);
  }, [trimmedQuery]);

  useEffect(() => {
    return () => {
      if (autoAddTimerRef.current) {
        clearTimeout(autoAddTimerRef.current);
      }
    };
  }, []);

  function commitAdd(productId?: string) {
    const targetProductId =
      productId ??
      suggestions[highlightIndex]?.id ??
      findBestProductMatch(products, query)?.id;

    if (!targetProductId) {
      return false;
    }

    onAdd(targetProductId, quantity);
    setQuery("");
    setIsListOpen(false);
    resolvedInputRef.current?.focus();
    return true;
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setIsListOpen(true);

    if (autoAddTimerRef.current) {
      clearTimeout(autoAddTimerRef.current);
    }

    const normalizedQuery = nextQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return;
    }

    const exactSkuMatch = products.find(
      (product) => product.sku.toLowerCase() === normalizedQuery,
    );

    if (!exactSkuMatch) {
      return;
    }

    autoAddTimerRef.current = setTimeout(() => {
      onAdd(exactSkuMatch.id, quantity);
      setQuery("");
      setIsListOpen(false);
      resolvedInputRef.current?.focus();
    }, 80);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsListOpen(true);
      setHighlightIndex((current) =>
        suggestions.length === 0
          ? 0
          : Math.min(current + 1, suggestions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (autoAddTimerRef.current) {
        clearTimeout(autoAddTimerRef.current);
      }

      commitAdd();
      return;
    }

    if (event.key === "Escape") {
      setIsListOpen(false);
    }
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Barcode className="size-4 text-primary" aria-hidden />
        <p className="text-sm font-medium">Scan or search</p>
        <div className="ml-auto flex items-center gap-1">
          {QTY_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              size="sm"
              variant={quantity === preset ? "default" : "outline"}
              className="h-9 min-w-9 px-2.5"
              disabled={disabled}
              onClick={() => onQuantityChange(preset)}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Input
          ref={resolvedInputRef}
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => setIsListOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsListOpen(false), 120);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="SKU or product name — Enter adds"
          disabled={disabled}
          className="h-12 bg-background text-base"
          autoComplete="off"
        />

        {isListOpen && trimmedQuery && suggestions.length > 0 ? (
          <div className="absolute top-[calc(100%+4px)] z-20 max-h-56 w-full overflow-y-auto rounded-lg border bg-popover p-1 shadow-md">
            {suggestions.map((product, index) => {
              const stock = getApiProductStock(product);

              return (
                <button
                  key={product.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commitAdd(product.id)}
                  className={cn(
                    "flex min-h-12 w-full items-start gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted active:bg-primary/10",
                    index === highlightIndex && "bg-muted",
                  )}
                >
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
            })}
          </div>
        ) : null}

        {isListOpen && trimmedQuery && suggestions.length === 0 ? (
          <div className="absolute top-[calc(100%+4px)] z-20 w-full rounded-lg border bg-popover px-3 py-4 text-sm text-muted-foreground shadow-md">
            No product found for &ldquo;{trimmedQuery}&rdquo;
          </div>
        ) : null}
      </div>
    </div>
  );
}
