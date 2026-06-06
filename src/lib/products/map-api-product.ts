import type { ApiProduct } from "@/lib/api/types/product.types";
import type { ProductRecord } from "@/lib/products/types";
import type { CreateProductFormInput } from "@/lib/validations/product";

export function getApiProductStock(product: ApiProduct): number {
  return product.stock ?? product.stockQuantity ?? 0;
}

export function mapApiProductToFormInput(
  product: ApiProduct,
): CreateProductFormInput {
  return {
    name: product.name.trim(),
    sku: product.sku.trim(),
    description: product.description?.trim() ?? "",
    price: product.sellingPrice,
    stock: getApiProductStock(product),
  };
}

export function mapApiProductToRecord(product: ApiProduct): ProductRecord {
  const stock = getApiProductStock(product);
  const createdAt = product.createdAt ?? "";

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description ?? "",
    price: product.sellingPrice,
    stock,
    created_at: createdAt,
    updated_at: createdAt,
  };
}
