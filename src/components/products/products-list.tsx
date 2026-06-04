"use client";

import { Download, Plus, Search, Package } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PRODUCTS_PAGE_SIZE,
  deleteProduct,
  queryProducts,
} from "@/lib/products/mock-store";
import type { ProductRecord } from "@/lib/products/types";
import { downloadCsv } from "@/lib/export/csv";

import { ProductsPagination } from "./products-pagination";
import { ProductsTable } from "./products-table";

const LOAD_DELAY_MS = 400;

export function ProductsList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(() =>
    queryProducts({
      search: "",
      status: "all",
      page: 1,
      pageSize: PRODUCTS_PAGE_SIZE,
    })
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setResult(
        queryProducts({
          search: debouncedSearch,
          status,
          page,
          pageSize: PRODUCTS_PAGE_SIZE,
        })
      );
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    const cleanup = fetchProducts();
    return cleanup;
  }, [fetchProducts]);

  const hasProducts = result.totalItems > 0;
  const isEmptySearch = debouncedSearch.length > 0 && !hasProducts;
  const isEmptyDatabase = debouncedSearch.length === 0 && !hasProducts;

  function refreshProducts(nextPage = page) {
    setResult(
      queryProducts({
        search: debouncedSearch,
        status,
        page: nextPage,
        pageSize: PRODUCTS_PAGE_SIZE,
      })
    );
  }

  function handleDeleteProduct(product: ProductRecord) {
    const confirmed = window.confirm(
      `Delete ${product.name}? This will remove it from the product catalog.`
    );

    if (!confirmed) return;

    deleteProduct(product.id);
    refreshProducts();
  }

  function handleExportProducts() {
    downloadCsv(
      "busilogix-products.csv",
      result.items.map((prod) => ({
        sku: prod.sku,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        stock: prod.stock,
        min_stock: prod.min_stock_level,
        status: prod.status,
      }))
    );
  }

  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search by name, SKU..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-8.5 bg-background/80 pl-8.5 text-xs"
              aria-label="Search products"
            />
          </div>
          <div className="flex rounded-lg border bg-muted/30 p-0.5 self-start">
            <button
              onClick={() => { setStatus("all"); setPage(1); }}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                status === "all"
                  ? "bg-background text-foreground shadow-sm shadow-slate-950/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setStatus("active"); setPage(1); }}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                status === "active"
                  ? "bg-background text-foreground shadow-sm shadow-slate-950/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => { setStatus("inactive"); setPage(1); }}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
                status === "inactive"
                  ? "bg-background text-foreground shadow-sm shadow-slate-950/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportProducts}
            disabled={!hasProducts}
            className="h-8 text-xs px-2.5"
          >
            <Download className="size-3.5" aria-hidden />
            Export CSV
          </Button>
          <Button
            render={<Link href="/products/new" />}
            size="sm"
            className="h-8 text-xs px-2.5 shadow-sm"
          >
            <Plus className="size-3.5" aria-hidden />
            Add product
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="h-6 bg-muted/65 animate-pulse rounded w-1/3" />
          <div className="h-32 bg-muted/50 animate-pulse rounded" />
        </div>
      ) : isEmptyDatabase ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Create your first product in the catalog to manage pricing and inventory levels."
          action={{ label: "Add product", href: "/products/new" }}
        />
      ) : isEmptySearch ? (
        <EmptyState
          icon={Search}
          title="No matching products"
          description={`No products found for "${debouncedSearch}". Try another name or SKU.`}
          action={{
            label: "Clear search",
            onClick: () => setSearch(""),
          }}
        />
      ) : (
        <>
          <ProductsTable
            products={result.items}
            onDeleteProduct={handleDeleteProduct}
          />
          <ProductsPagination
            page={result.page}
            totalPages={result.totalPages}
            totalItems={result.totalItems}
            pageSize={result.pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
