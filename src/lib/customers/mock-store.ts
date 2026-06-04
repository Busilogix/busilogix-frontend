import { SEED_CUSTOMERS } from "./mock-data";
import type { CustomerFormValues, CustomerRecord } from "./types";

const STORAGE_KEY = "busilogix_mock_customers";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStore(): CustomerRecord[] {
  if (!isBrowser()) {
    return SEED_CUSTOMERS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CUSTOMERS));
    return SEED_CUSTOMERS;
  }

  try {
    return (JSON.parse(stored) as (CustomerRecord & { gst_number?: string })[]).map(
      (record) => {
        const { gst_number: _gstNumber, ...customer } = record;
        return customer;
      },
    );
  } catch {
    return SEED_CUSTOMERS;
  }
}

function writeStore(customers: CustomerRecord[]): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

function generateId(): string {
  return `cust_${Date.now().toString(36)}`;
}

export function getAllCustomers(): CustomerRecord[] {
  return readStore().sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

export function getCustomerById(id: string): CustomerRecord | undefined {
  return readStore().find((customer) => customer.id === id);
}

export function createCustomer(data: CustomerFormValues): CustomerRecord {
  const now = new Date().toISOString();
  const customer: CustomerRecord = {
    id: generateId(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    created_at: now,
    updated_at: now,
  };

  const customers = readStore();
  writeStore([customer, ...customers]);
  return customer;
}

export function updateCustomer(
  id: string,
  data: CustomerFormValues,
): CustomerRecord | undefined {
  const customers = readStore();
  const index = customers.findIndex((customer) => customer.id === id);

  if (index === -1) {
    return undefined;
  }

  const updated: CustomerRecord = {
    ...customers[index],
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    updated_at: new Date().toISOString(),
  };

  customers[index] = updated;
  writeStore(customers);
  return updated;
}

export function deleteCustomer(id: string): boolean {
  const customers = readStore();
  const nextCustomers = customers.filter((customer) => customer.id !== id);

  if (nextCustomers.length === customers.length) {
    return false;
  }

  writeStore(nextCustomers);
  return true;
}

export type CustomerQueryParams = {
  search?: string;
  page: number;
  pageSize: number;
};

export type CustomerQueryResult = {
  items: CustomerRecord[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export function queryCustomers(
  params: CustomerQueryParams,
): CustomerQueryResult {
  const { search = "", page, pageSize } = params;
  const normalizedSearch = search.trim().toLowerCase();

  let filtered = getAllCustomers();

  if (normalizedSearch) {
    filtered = filtered.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch) ||
        customer.phone.toLowerCase().includes(normalizedSearch),
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    totalItems,
    totalPages,
    page: safePage,
    pageSize,
  };
}

export const CUSTOMERS_PAGE_SIZE = 8;
