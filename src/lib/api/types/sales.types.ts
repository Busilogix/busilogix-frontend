export type SalesReportIntervalData = {
  label: string;
  grossSales: number;
  netRevenue: number;
  invoiceCount: number;
};

export type SalesReportData = {
  startDate: string;
  endDate: string;
  grossSales: number;
  netRevenue: number;
  totalInvoices: number;
  data: SalesReportIntervalData[];
};

export type SalesReportParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  groupBy: "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
};
