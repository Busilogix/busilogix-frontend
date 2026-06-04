export type CustomerStatus = "active" | "inactive" | "archived";

export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  status: CustomerStatus;
  total_invoices?: number;
  outstanding_balance?: number;
  created_at: string;
  updated_at: string;
};

export type CreateCustomerRequest = {
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  status?: CustomerStatus;
};

export type UpdateCustomerRequest = Partial<CreateCustomerRequest>;

export type CustomerListParams = {
  page?: number;
  page_size?: number;
  search?: string;
  status?: CustomerStatus;
};
