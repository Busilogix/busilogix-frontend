export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type InvoiceLineItem = {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
};

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

export type CreateInvoiceRequest = {
  customer_id: string;
  issue_date: string;
  due_date: string;
  currency?: string;
  line_items: Omit<InvoiceLineItem, "id">[];
  notes?: string;
  status?: InvoiceStatus;
};

export type UpdateInvoiceRequest = Partial<CreateInvoiceRequest>;

export type InvoiceListParams = {
  page?: number;
  page_size?: number;
  search?: string;
  status?: InvoiceStatus;
  customer_id?: string;
};
