import type { CreateProductRequest } from "@/lib/api/types/product.types";
import type { CreateProductFormInput } from "@/lib/validations/product";

export function buildCreateProductPayload(
  data: CreateProductFormInput,
): CreateProductRequest {
  const description = data.description?.trim();

  return {
    name: data.name.trim(),
    sku: data.sku.trim(),
    sellingPrice: data.price,
    stockQuantity: data.stock,
    ...(description ? { description } : {}),
  };
}
