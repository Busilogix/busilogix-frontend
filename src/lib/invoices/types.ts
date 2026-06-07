import type { InvoiceStatus } from "@/lib/api/types/invoice.types";
import type { CustomerAddress } from "@/lib/api/types/customer.types";

export type { InvoiceStatus };

export type InvoiceLineItemRecord = {
  id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  line_subtotal: number;
  line_tax: number;
  line_total: number;
};

export type InvoiceListRecord = {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type InvoiceDetailRecord = InvoiceListRecord & {
  customer_email: string;
  customer_phone: string;
  customer_address?: CustomerAddress;
  subtotal: number;
  tax_amount: number;
  line_items: InvoiceLineItemRecord[];
  notes?: string;
};

export type InvoiceStatusFilter = InvoiceStatus | "all";

export type InvoiceQueryParams = {
  search?: string;
  status?: InvoiceStatusFilter;
  page: number;
  pageSize: number;
};

export type InvoiceQueryResult = {
  items: InvoiceListRecord[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
};
