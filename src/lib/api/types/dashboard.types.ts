export type ApiRecentInvoice = {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  netAmount: number;
  createdAt: string;
};

export type ApiTopProduct = {
  productId: string;
  productName: string;
  quantitySold: number;
};

export type ApiDashboardData = {
  totalProducts: number;
  lowStockProducts: number;
  totalInvoices: number;
  grossSales: number;
  netRevenue: number;
  recentInvoices: ApiRecentInvoice[];
  topProducts: ApiTopProduct[];
};
