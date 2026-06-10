"use client";

import {
  AlertTriangle,
  Boxes,
  Package,
  PackageCheck,
  PackageX,
  Search,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductCatalogStats } from "@/lib/api/types/product.types";
import {
  LOW_STOCK_THRESHOLD,
  type ProductStockFilter,
} from "@/lib/products/constants";
import { cn } from "@/lib/utils";

type ProductsOverviewCardsProps = {
  stats: ProductCatalogStats | null;
  isStatsLoading: boolean;
  isFiltered: boolean;
  matchingCount: number;
  search: string;
  stockFilter: ProductStockFilter;
  onStockFilterChange?: (filter: ProductStockFilter) => void;
};

const STOCK_FILTER_LABELS: Record<ProductStockFilter, string> = {
  all: "All stock levels",
  in_stock: "In stock",
  low_stock: `Low stock (≤ ${LOW_STOCK_THRESHOLD})`,
  out_of_stock: "Out of stock",
};

type SnapshotStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone?: "default" | "emerald" | "amber" | "rose";
  onClick?: () => void;
  isActive?: boolean;
};

function SnapshotStat({
  icon,
  label,
  value,
  description,
  tone = "default",
  onClick,
  isActive,
}: SnapshotStatProps) {
  const toneClasses = {
    default: "bg-muted text-muted-foreground",
    emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15",
    amber: "bg-amber-500/10 text-amber-600 ring-amber-500/15",
    rose: "bg-rose-500/10 text-rose-600 ring-rose-500/15",
  };

  const content = (
    <>
      <span
        className={cn(
          "flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg ring-1",
          toneClasses[tone],
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground truncate">{label}</p>
        <p className="mt-0.5 text-base sm:text-2xl font-bold tabular-nums tracking-tight text-foreground leading-none sm:leading-normal">
          {value}
        </p>
        <p className="mt-0.5 text-[10px] sm:text-xs leading-snug text-muted-foreground hidden sm:block">
          {description}
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex min-w-0 items-start gap-2 sm:gap-3 rounded-xl border p-2.5 sm:p-3 text-left transition-colors w-full",
          isActive
            ? "border-primary/30 bg-primary/5 shadow-sm"
            : "border-transparent bg-muted/20 hover:border-border hover:bg-muted/40",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex min-w-0 items-start gap-2 sm:gap-3 rounded-xl border border-transparent bg-muted/20 p-2.5 sm:p-3">
      {content}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <Card className="surface-card overflow-hidden rounded-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 border-t pt-4 sm:pt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 sm:h-24 rounded-xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsOverviewCards({
  stats,
  isStatsLoading,
  isFiltered,
  matchingCount,
  search,
  stockFilter,
  onStockFilterChange,
}: ProductsOverviewCardsProps) {
  if (isStatsLoading && !stats) {
    return <OverviewSkeleton />;
  }

  const catalog = stats ?? {
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  };

  const headlineValue = isFiltered
    ? matchingCount.toLocaleString()
    : catalog.total.toLocaleString();

  const headlineTitle = isFiltered ? "Matching products" : "Catalog size";
  const headlineDescription = isFiltered
    ? [
        search.trim() ? `Search: “${search.trim()}”` : null,
        stockFilter !== "all" ? STOCK_FILTER_LABELS[stockFilter] : null,
      ]
        .filter(Boolean)
        .join(" · ") || "Filters applied to the catalog"
    : "Products saved in your workspace";

  return (
    <Card className="surface-card overflow-hidden rounded-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                {isFiltered ? (
                  <Search className="size-4" aria-hidden />
                ) : (
                  <Boxes className="size-4" aria-hidden />
                )}
              </span>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-semibold tracking-tight text-foreground">
                  {isFiltered ? "Filtered catalog view" : "Catalog snapshot"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {headlineDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 border-t pt-4 sm:pt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          <SnapshotStat
            icon={<Package className="size-4" aria-hidden />}
            label="Total products"
            value={catalog.total.toLocaleString()}
            description="All SKUs in your catalog"
            onClick={
              onStockFilterChange ? () => onStockFilterChange("all") : undefined
            }
            isActive={!isFiltered && stockFilter === "all"}
          />
          <SnapshotStat
            icon={<PackageCheck className="size-4" aria-hidden />}
            label="In stock"
            value={catalog.inStock.toLocaleString()}
            description="Available quantity is 1 or more"
            tone="emerald"
            onClick={
              onStockFilterChange
                ? () => onStockFilterChange("in_stock")
                : undefined
            }
            isActive={stockFilter === "in_stock"}
          />
          <SnapshotStat
            icon={<AlertTriangle className="size-4" aria-hidden />}
            label="Low stock"
            value={catalog.lowStock.toLocaleString()}
            description={`${LOW_STOCK_THRESHOLD} units or fewer on hand`}
            tone="amber"
            onClick={
              onStockFilterChange
                ? () => onStockFilterChange("low_stock")
                : undefined
            }
            isActive={stockFilter === "low_stock"}
          />
          <SnapshotStat
            icon={<PackageX className="size-4" aria-hidden />}
            label="Out of stock"
            value={catalog.outOfStock.toLocaleString()}
            description="Needs restocking before invoicing"
            tone="rose"
            onClick={
              onStockFilterChange
                ? () => onStockFilterChange("out_of_stock")
                : undefined
            }
            isActive={stockFilter === "out_of_stock"}
          />
        </div>
      </CardContent>
    </Card>
  );
}
