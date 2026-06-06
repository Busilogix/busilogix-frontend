import type { ProductListParams } from "../types/product.types";

export function isValidStockRange(
  minStockQuantity?: number,
  maxStockQuantity?: number,
): boolean {
  if (minStockQuantity === undefined || maxStockQuantity === undefined) {
    return true;
  }

  return maxStockQuantity >= minStockQuantity;
}

export function buildProductListQuery(
  params: ProductListParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  if (params.page !== undefined) {
    query.page = params.page;
  }

  if (params.size !== undefined) {
    query.size = params.size;
  }

  const search = params.search?.trim();
  if (search) {
    query.search = search;
  }

  if (params.minStockQuantity !== undefined) {
    query.minStockQuantity = params.minStockQuantity;
  }

  if (params.maxStockQuantity !== undefined) {
    query.maxStockQuantity = params.maxStockQuantity;
  }

  return query;
}
