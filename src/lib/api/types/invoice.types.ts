import type { CustomerAddress } from "./customer.types";

export type InvoiceTaxType = "INTRA_STATE" | "INTER_STATE";

export type CreateInvoiceCustomer = {
  name: string | null;
  email: string | null;
  mobile: string;
  address?: CustomerAddress;
};

export type CreateInvoiceItem = {
  productId: string;
  quantity: number;
};

export type CreateInvoiceRequest = {
  customer: CreateInvoiceCustomer;
  items: CreateInvoiceItem[];
  taxPercentage: number;
  taxType: InvoiceTaxType;
  discountAmount: number;
};

export type ApiInvoiceItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type ApiInvoiceCustomer = {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  address?: CustomerAddress;
};

export type ApiInvoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  customer: ApiInvoiceCustomer;
  totalAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  discountAmount: number;
  netAmount: number;
  items: ApiInvoiceItem[];
};

export type CreateInvoiceResponse = {
  message: string;
  invoice: ApiInvoice;
};

/** @deprecated Legacy list/detail shape — migrate when list API is integrated */
export type InvoiceStatus = "DRAFT" | "PAID" | "OVERDUE" | "CANCELLED";

/** @deprecated Legacy list/detail shape — migrate when list API is integrated */
export type InvoiceLineItem = {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
};

/** @deprecated Legacy list/detail shape — migrate when list API is integrated */
export type Invoice = {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name?: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  line_items: InvoiceLineItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
};

/** @deprecated Legacy — migrate when update API is integrated */
export type UpdateInvoiceRequest = Partial<{
  customer_id: string;
  issue_date: string;
  due_date: string;
  currency: string;
  line_items: Omit<InvoiceLineItem, "id">[];
  notes: string;
  status: InvoiceStatus;
}>;

export type InvoiceListParams = {
  page?: number; // 1-indexed in frontend
  size?: number; // maps to size in backend
  search?: string;
  status?: InvoiceStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
};

export type BackendInvoice = ApiInvoice & {
  createdAt: string;
};

export type InvoiceListPage = {
  content: BackendInvoice[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type InvoiceListResult = {
  items: BackendInvoice[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};
