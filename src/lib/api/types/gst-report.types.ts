export type GstReportData = {
  taxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
};

export type GstReportParams = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
};
