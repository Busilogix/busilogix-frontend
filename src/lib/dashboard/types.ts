import type { CustomerRecord } from "@/lib/customers/types";
import type { InvoiceListRecord } from "@/lib/invoices/types";

export type DashboardMetrics = {
  totalCustomers: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  currency: string;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  recentInvoices: InvoiceListRecord[];
  recentCustomers: CustomerRecord[];
};
