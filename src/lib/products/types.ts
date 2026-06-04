export type ProductRecord = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  stock: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
};

export type ProductFormValues = {
  name: string;
  sku: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  stock: number;
  min_stock_level: number;
};

export type StockAdjustmentLog = {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  timestamp: string;
};

export type ProductQueryParams = {
  search?: string;
  status?: "all" | "active" | "inactive";
  page: number;
  pageSize: number;
};

export type ProductQueryResult = {
  items: ProductRecord[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
};
