export type ProductReportItem = {
  productId: string;
  productName: string;
  quantitySold: number;
  grossSales: number;
};

export type ProductReportData = {
  totalProductsSold: number;
  totalSales: number;
  products: ProductReportItem[];
};

export type ProductReportParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  limit?: number;
};
