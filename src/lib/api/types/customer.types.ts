export type CustomerStatus = "active" | "inactive" | "archived";

export type CustomerAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type ApiCustomer = {
  id: string;
  mobile: string;
  name?: string;
  email?: string;
  address?: CustomerAddress;
  createdAt: string;
};

export type CustomerListPage = {
  content: ApiCustomer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  address?: CustomerAddress;
  status: CustomerStatus;
  total_invoices?: number;
  outstanding_balance?: number;
  created_at: string;
  updated_at: string;
};

export type CreateCustomerRequest = {
  mobile: string;
  name?: string;
  email?: string;
  address?: CustomerAddress;
};

export type CreateCustomerResponse = {
  message: string;
};

export type UpdateCustomerRequest = {
  name?: string;
  email?: string;
  address?: CustomerAddress;
};

export type UpdateCustomerResponse = {
  message: string;
};

export type CustomerListParams = {
  page?: number;
  size?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type CustomerListResult = {
  items: ApiCustomer[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ApiCustomerStats = {
  totalCustomers: number;
  addedThisYear: number;
  addedThisMonth: number;
  addedThisWeek: number;
};

export type CustomerCatalogStats = {
  total: number;
  addedThisYear: number;
  addedThisMonth: number;
  addedThisWeek: number;
};

export type CustomerMobileLookupResult = {
  exists: boolean;
  customer?: ApiCustomer;
};
