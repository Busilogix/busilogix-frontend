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

export type InvoiceStatus = "DRAFT" | "DUE" | "PAID" | "OVERDUE" | "CANCELLED";

export type InvoiceListParams = {
  page?: number; // 1-indexed in frontend
  size?: number; // maps to size in backend
  search?: string;
  status?: InvoiceStatus;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  customerMobile?: string;
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
