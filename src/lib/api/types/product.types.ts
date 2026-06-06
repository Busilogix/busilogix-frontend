export type ProductRequest = {
  name: string;
  sku: string;
  description?: string;
  sellingPrice: number;
  stockQuantity: number;
};

export type CreateProductRequest = ProductRequest;
export type UpdateProductRequest = ProductRequest;

export type ApiProduct = {
  id: string;
  name: string;
  sku: string;
  description?: string;
  sellingPrice: number;
  stock?: number;
  stockQuantity?: number;
  createdAt?: string;
};

export type ProductListPage = {
  content: ApiProduct[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ProductListParams = {
  page?: number;
  size?: number;
  search?: string;
  minStockQuantity?: number;
  maxStockQuantity?: number;
};

export type ProductListResult = {
  items: ApiProduct[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ProductMutationResponse = {
  message: string;
};

export type ApiProductStats = {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
};

export type ProductCatalogStats = {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
};
