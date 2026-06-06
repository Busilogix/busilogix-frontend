"use client";

import { ListPageHeader } from "@/components/layout/list-page-header";
import type { ProductCatalogStats } from "@/lib/api/types/product.types";
import type { ProductStockFilter } from "@/lib/products/constants";

import { ProductsOverviewCards } from "./products-overview-cards";

type ProductsPageHeaderProps = {
  stats: ProductCatalogStats | null;
  isStatsLoading: boolean;
  isFiltered: boolean;
  matchingCount: number;
  search: string;
  stockFilter: ProductStockFilter;
  onStockFilterChange: (filter: ProductStockFilter) => void;
};

export function ProductsPageHeader({
  stats,
  isStatsLoading,
  isFiltered,
  matchingCount,
  search,
  stockFilter,
  onStockFilterChange,
}: ProductsPageHeaderProps) {
  return (
    <div className="space-y-4">
      <ListPageHeader
        title="Products"
        description="Create and organize your product catalog, SKU details, and customer-facing pricing."
      />
      <ProductsOverviewCards
        stats={stats}
        isStatsLoading={isStatsLoading}
        isFiltered={isFiltered}
        matchingCount={matchingCount}
        search={search}
        stockFilter={stockFilter}
        onStockFilterChange={onStockFilterChange}
      />
    </div>
  );
}
