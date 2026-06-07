export type InventoryReportProductItem = {
  productId: string;
  productName: string;
  stock: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
};

export type InventoryReportData = {
  totalProducts: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  products: InventoryReportProductItem[];
};

export type InventoryReportParams = {
  limit?: number;
};
