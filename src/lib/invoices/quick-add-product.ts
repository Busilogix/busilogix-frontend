import type { ApiProduct } from "@/lib/api/types/product.types";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

export function findProductsByQuery(
  products: ApiProduct[],
  query: string,
  limit = 8,
): ApiProduct[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const exactSkuMatches = products.filter(
    (product) => product.sku.toLowerCase() === normalizedQuery,
  );

  if (exactSkuMatches.length === 1) {
    return exactSkuMatches;
  }

  const matches = products.filter(
    (product) =>
      product.sku.toLowerCase().includes(normalizedQuery) ||
      product.name.toLowerCase().includes(normalizedQuery),
  );

  return matches.slice(0, limit);
}

export function findBestProductMatch(
  products: ApiProduct[],
  query: string,
): ApiProduct | null {
  const matches = findProductsByQuery(products, query, 12);
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery || matches.length === 0) {
    return null;
  }

  const exactSku = matches.find(
    (product) => product.sku.toLowerCase() === normalizedQuery,
  );

  if (exactSku) {
    return exactSku;
  }

  const exactName = matches.find(
    (product) => product.name.toLowerCase() === normalizedQuery,
  );

  if (exactName) {
    return exactName;
  }

  const skuPrefixMatches = matches.filter((product) =>
    product.sku.toLowerCase().startsWith(normalizedQuery),
  );

  if (skuPrefixMatches.length === 1) {
    return skuPrefixMatches[0];
  }

  return matches.length === 1 ? matches[0] : null;
}

export type AddProductToCartResult = {
  index: number;
  merged: boolean;
};

export function addProductToCart(
  items: CreateInvoiceFormInput["items"],
  productId: string,
  quantity: number,
): {
  nextItems: CreateInvoiceFormInput["items"];
  result: AddProductToCartResult;
} {
  const safeQuantity = Math.max(1, Math.floor(quantity));
  const nextItems = items.map((item) => ({ ...item }));
  const existingIndex = nextItems.findIndex(
    (item) => item.productId === productId,
  );

  if (existingIndex >= 0) {
    const currentQuantity = Number(nextItems[existingIndex].quantity) || 0;

    nextItems[existingIndex] = {
      ...nextItems[existingIndex],
      quantity: currentQuantity + safeQuantity,
    };

    return {
      nextItems,
      result: { index: existingIndex, merged: true },
    };
  }

  const emptyIndex = nextItems.findIndex((item) => !item.productId);

  if (emptyIndex >= 0) {
    nextItems[emptyIndex] = {
      productId,
      quantity: safeQuantity,
    };

    return {
      nextItems,
      result: { index: emptyIndex, merged: false },
    };
  }

  nextItems.push({
    productId,
    quantity: safeQuantity,
  });

  return {
    nextItems,
    result: { index: nextItems.length - 1, merged: false },
  };
}
