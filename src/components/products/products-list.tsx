"use client";

import { Package, Plus, Search, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";

import { FormMessage } from "@/components/auth/form-message";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/lib/api/errors";
import { productService } from "@/lib/api/product.service";
import type {
  ProductCatalogStats,
  ProductListResult,
} from "@/lib/api/types/product.types";
import { isValidStockRange } from "@/lib/api/utils/product-query";
import { downloadCsv } from "@/lib/export/csv";
import {
  PRODUCTS_PAGE_SIZE,
  type ProductStockFilter,
  stockFilterToQuery,
} from "@/lib/products/constants";
import { mapApiProductToRecord } from "@/lib/products/map-api-product";
import { cn } from "@/lib/utils";

import { CreateProductModal } from "./create-product-modal";
import { EditProductModal } from "./edit-product-modal";
import { UploadProductsModal } from "./upload-products-modal";

import { ProductsPageHeader } from "./products-page-header";
import { ProductsPagination } from "./products-pagination";
import { ProductsTable } from "./products-table";
import { ProductsTableSkeleton } from "./products-table-skeleton";

const DEBOUNCE_MS = 300;

const STOCK_FILTER_OPTIONS: { value: ProductStockFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

const emptyResult: ProductListResult = {
  items: [],
  page: 1,
  pageSize: PRODUCTS_PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

export function ProductsList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<ProductStockFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PRODUCTS_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductListResult>(emptyResult);
  const [catalogStats, setCatalogStats] = useState<ProductCatalogStats | null>(
    null,
  );
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);


  const stockQuery = useMemo(
    () => stockFilterToQuery(stockFilter),
    [stockFilter],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [stockFilter]);

  const fetchProducts = useCallback(async () => {
    if (
      !isValidStockRange(
        stockQuery.minStockQuantity,
        stockQuery.maxStockQuantity,
      )
    ) {
      setFetchError(
        "Maximum stock quantity must be greater than or equal to minimum stock quantity.",
      );
      setResult({ ...emptyResult, pageSize });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await productService.list({
        page: page - 1,
        size: pageSize,
        search: debouncedSearch,
        ...stockQuery,
      });

      setResult(response);
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to load products. Please try again.";
      setFetchError(message);
      setResult({ ...emptyResult, pageSize });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, pageSize, stockQuery]);

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const isFiltered = debouncedSearch.trim().length > 0 || stockFilter !== "all";

  const refreshCatalogStats = useCallback(async () => {
    setIsStatsLoading(true);

    try {
      const stats = await productService.getStats();
      setCatalogStats(stats);
    } catch {
      setCatalogStats(null);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalogStats();
  }, [refreshCatalogStats]);

  useEffect(() => {
    if (isFiltered) {
      return;
    }

    void refreshCatalogStats();
  }, [isFiltered, result.totalItems, refreshCatalogStats]);

  const products = useMemo(
    () => result.items.map(mapApiProductToRecord),
    [result.items],
  );

  const hasProducts = result.totalItems > 0;
  const isEmptySearch = isFiltered && !hasProducts;
  const isEmptyDatabase = !isFiltered && !hasProducts;

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStockFilter("all");
    setPage(1);
  }

  async function handleExportProducts() {
    try {
      const exportResult = await productService.list({
        page: 0,
        size: result.totalItems || pageSize,
        search: debouncedSearch,
        ...stockQuery,
      });

      const rows = exportResult.items.map(mapApiProductToRecord);

      downloadCsv(
        "busilogix-products.csv",
        rows.map((product) => ({
          sku: product.sku,
          name: product.name,
          description: product.description,
          selling_price: product.price,
          stock: product.stock,
          created_at: product.created_at,
        })),
      );
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to export products. Please try again.";
      setFetchError(message);
    }
  }

  const stockUpdateTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const stockPendingValues = useRef<Record<string, number>>({});

  useEffect(() => {
    const timeouts = stockUpdateTimeouts.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  async function handleStockAdjust(product: any, newStock: number) {
    if (newStock < 0) return;

    // 1. Optimistically update local UI state immediately
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === product.id ? { ...item, stock: newStock, stockQuantity: newStock } : item
        ),
      };
    });

    // 2. Track the pending final stock quantity
    stockPendingValues.current[product.id] = newStock;

    // 3. Clear existing debounce timer for this product
    if (stockUpdateTimeouts.current[product.id]) {
      clearTimeout(stockUpdateTimeouts.current[product.id]);
    }

    // 4. Schedule a single API call after the debounce period (800ms)
    stockUpdateTimeouts.current[product.id] = setTimeout(async () => {
      const finalStock = stockPendingValues.current[product.id];
      if (finalStock === undefined) return;

      // Clean up tracking references
      delete stockPendingValues.current[product.id];
      delete stockUpdateTimeouts.current[product.id];

      try {
        await productService.update(product.id, {
          name: product.name,
          sku: product.sku,
          sellingPrice: product.price,
          stockQuantity: finalStock,
          description: product.description || undefined,
        });
        toast.success("Stock updated", {
          description: `${product.name} stock adjusted to ${finalStock}.`,
        });
        void refreshCatalogStats();
      } catch (error) {
        toast.error("Failed to update stock", {
          description: `Unable to adjust stock for ${product.name}.`,
        });
        // Revert to database state on failure
        void fetchProducts();
      }
    }, 800);
  }

  const headerActions = (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsUploadModalOpen(true)}
        className="shadow-sm"
      >
        <Upload className="size-4" aria-hidden />
        Import CSV/XLSX
      </Button>
      <Button
        size="sm"
        className="shadow-sm"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <Plus className="size-4" aria-hidden />
        Add product
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ProductsPageHeader
        stats={catalogStats}
        isStatsLoading={isStatsLoading}
        isFiltered={isFiltered}
        matchingCount={result.totalItems}
        search={debouncedSearch}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        actions={headerActions}
      />

      <div className="surface-card rounded-xl p-4 sm:p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Search & filters
        </p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 bg-background/80 pl-9"
              aria-label="Search products"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex flex-wrap rounded-xl border bg-muted/30 p-1"
              role="group"
              aria-label="Stock level filter"
            >
              {STOCK_FILTER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStockFilter(value)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-medium transition-all",
                    stockFilter === value
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {isFiltered ? (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                <X className="size-4" aria-hidden />
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <CreateProductModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={() => {
          setPage(1);
          void fetchProducts();
          void refreshCatalogStats();
        }}
      />

      <EditProductModal
        productId={editingProductId}
        open={editingProductId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProductId(null);
          }
        }}
        onUpdated={() => {
          void fetchProducts();
          void refreshCatalogStats();
        }}
      />

      <UploadProductsModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploaded={() => {
          setPage(1);
          void fetchProducts();
          void refreshCatalogStats();
        }}
      />

      {fetchError ? (
        <FormMessage
          type="error"
          title="Unable to load products"
          message={fetchError}
        />
      ) : null}

      {isLoading ? (
        <ProductsTableSkeleton />
      ) : isEmptyDatabase ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Create your first product in the catalog to manage pricing and inventory levels."
        />
      ) : isEmptySearch ? (
        <EmptyState
          icon={Search}
          title="No matching products"
          description="No results match your current search or stock filters. Try adjusting them."
          action={{
            label: "Clear filters",
            onClick: clearFilters,
          }}
        />
      ) : (
        <div className="space-y-4">
          <ProductsTable
            products={products}
            totalItems={result.totalItems}
            onEditProduct={(product) => setEditingProductId(product.id)}
            onStockAdjust={handleStockAdjust}
          />
          <ProductsPagination
            page={result.page}
            totalPages={result.totalPages}
            totalItems={result.totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
