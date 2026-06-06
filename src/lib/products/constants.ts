import type { ProductListParams } from "@/lib/api/types/product.types";

export const PRODUCTS_PAGE_SIZE = 10;

export const PRODUCTS_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const LOW_STOCK_THRESHOLD = 10;

export type ProductStockFilter =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export function stockFilterToQuery(
  filter: ProductStockFilter,
): Pick<ProductListParams, "minStockQuantity" | "maxStockQuantity"> {
  switch (filter) {
    case "in_stock":
      return { minStockQuantity: 1 };
    case "low_stock":
      return { maxStockQuantity: LOW_STOCK_THRESHOLD };
    case "out_of_stock":
      return { maxStockQuantity: 0 };
    default:
      return {};
  }
}
