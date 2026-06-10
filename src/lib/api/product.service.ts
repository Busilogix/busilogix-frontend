import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type {
  ApiProduct,
  ApiProductStats,
  CreateProductRequest,
  ProductCatalogStats,
  ProductListPage,
  ProductListParams,
  ProductListResult,
  ProductMutationResponse,
  UpdateProductRequest,
} from "./types/product.types";
import { parseAuthResponse } from "./utils/auth-response";
import { buildProductListQuery } from "./utils/product-query";

const PRODUCTS_BASE = "/products";

class ProductService {
  async list(params: ProductListParams = {}): Promise<ProductListResult> {
    const response = await apiClient.get<BackendEnvelope<ProductListPage>>(
      PRODUCTS_BASE,
      { params: buildProductListQuery(params) },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Products response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return {
      items: data.content,
      page: data.page + 1,
      pageSize: data.size,
      totalItems: data.totalElements,
      totalPages: Math.max(1, data.totalPages),
      hasNext: data.hasNext,
      hasPrevious: data.hasPrevious,
    };
  }

  async getStats(): Promise<ProductCatalogStats> {
    const response = await apiClient.get<BackendEnvelope<ApiProductStats>>(
      `${PRODUCTS_BASE}/stats`,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Product statistics response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return {
      total: data.totalProducts,
      inStock: data.inStock,
      lowStock: data.lowStock,
      outOfStock: data.outOfStock,
    };
  }

  async getById(id: string): Promise<ApiProduct> {
    const response = await apiClient.get<BackendEnvelope<ApiProduct>>(
      `${PRODUCTS_BASE}/${id}`,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Product response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async create(
    payload: CreateProductRequest,
  ): Promise<ProductMutationResponse> {
    const response = await apiClient.post<BackendEnvelope>(
      `${PRODUCTS_BASE}/create`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async update(
    id: string,
    payload: UpdateProductRequest,
  ): Promise<ProductMutationResponse> {
    const response = await apiClient.put<BackendEnvelope>(
      `${PRODUCTS_BASE}/${id}`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async upload(file: File): Promise<ProductMutationResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<BackendEnvelope>(
      `/uploads/products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async downloadSample(): Promise<Blob> {
    const response = await apiClient.get(
      `/uploads/products/sample`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  }
}

export const productService = new ProductService();

