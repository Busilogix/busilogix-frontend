import { buildInvoiceDetailFromForm } from "./build-detail";
import { SEED_INVOICE_DETAILS } from "./seed-details";
import type {
  InvoiceDetailRecord,
  InvoiceListRecord,
  InvoiceQueryParams,
  InvoiceQueryResult,
  InvoiceStatusFilter,
} from "./types";
import type { InvoiceFormInput } from "@/lib/validations/invoice";

const STORAGE_KEY = "busilogix_mock_invoices";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function writeStore(invoices: InvoiceDetailRecord[]): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

function readStore(): InvoiceDetailRecord[] {
  if (!isBrowser()) {
    return SEED_INVOICE_DETAILS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INVOICE_DETAILS));
    return SEED_INVOICE_DETAILS;
  }

  try {
    const parsed = JSON.parse(stored) as InvoiceDetailRecord[];
    return parsed.map((invoice) => enrichLegacyRecord(invoice));
  } catch {
    return SEED_INVOICE_DETAILS;
  }
}

function enrichLegacyRecord(invoice: InvoiceDetailRecord): InvoiceDetailRecord {
  if (invoice.line_items?.length && invoice.customer_email) {
    return invoice;
  }

  const seed = SEED_INVOICE_DETAILS.find((item) => item.id === invoice.id);
  if (seed) {
    return {
      ...seed,
      ...invoice,
      line_items: invoice.line_items ?? seed.line_items,
    };
  }

  return {
    ...invoice,
    customer_email: invoice.customer_email ?? "billing@customer.com",
    customer_phone: invoice.customer_phone ?? "+1 (555) 000-0000",
    subtotal: invoice.subtotal ?? invoice.total_amount * 0.9,
    tax_amount: invoice.tax_amount ?? invoice.total_amount * 0.1,
    line_items: invoice.line_items ?? [],
  };
}

function toListRecord(invoice: InvoiceDetailRecord): InvoiceListRecord {
  const {
    customer_email: _e,
    customer_phone: _p,
    subtotal: _s,
    tax_amount: _t,
    line_items: _l,
    notes: _n,
    ...list
  } = invoice;
  return list;
}

export const INVOICES_PAGE_SIZE = 10;

export function suggestInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const count = readStore().length + 1;
  return `INV-${year}-${String(count).padStart(3, "0")}`;
}

export function getAllInvoices(): InvoiceDetailRecord[] {
  return readStore().sort(
    (a, b) =>
      new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
  );
}

export function getInvoiceById(id: string): InvoiceDetailRecord | undefined {
  return readStore().find((invoice) => invoice.id === id);
}

export function createInvoiceFromForm(
  data: InvoiceFormInput,
): InvoiceDetailRecord {
  const invoice = buildInvoiceDetailFromForm(data);
  writeStore([invoice, ...readStore()]);
  return invoice;
}

export function updateInvoiceFromForm(
  id: string,
  data: InvoiceFormInput,
): InvoiceDetailRecord | undefined {
  const invoices = readStore();
  const index = invoices.findIndex((invoice) => invoice.id === id);

  if (index === -1) {
    return undefined;
  }

  const existing = invoices[index];
  const updated = {
    ...buildInvoiceDetailFromForm(data, {
      id,
      status: existing.status,
    }),
    customer_id: existing.customer_id,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
  };

  invoices[index] = updated;
  writeStore(invoices);
  return updated;
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceDetailRecord["status"],
): InvoiceDetailRecord | undefined {
  const invoices = readStore();
  const index = invoices.findIndex((invoice) => invoice.id === id);

  if (index === -1) {
    return undefined;
  }

  const updated = {
    ...invoices[index],
    status,
    updated_at: new Date().toISOString(),
  };

  invoices[index] = updated;
  writeStore(invoices);
  return updated;
}

export function duplicateInvoice(id: string): InvoiceDetailRecord | undefined {
  const invoice = getInvoiceById(id);

  if (!invoice) {
    return undefined;
  }

  const now = new Date().toISOString();
  const copy: InvoiceDetailRecord = {
    ...invoice,
    id: `inv_${Date.now().toString(36)}`,
    invoice_number: suggestInvoiceNumber(),
    status: "DRAFT",
    issue_date: new Date().toISOString().split("T")[0],
    created_at: now,
    updated_at: now,
    notes: undefined,
    line_items: invoice.line_items.map((item, index) => ({
      ...item,
      id: `li_${index + 1}`,
    })),
  };

  writeStore([copy, ...readStore()]);
  return copy;
}

export function queryInvoices(params: InvoiceQueryParams): InvoiceQueryResult {
  const { search = "", status = "all", page, pageSize } = params;
  const normalizedSearch = search.trim().toLowerCase();

  let filtered = readStore().sort(
    (a, b) =>
      new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
  );

  if (status !== "all") {
    filtered = filtered.filter((invoice) => invoice.status === status);
  }

  if (normalizedSearch) {
    filtered = filtered.filter(
      (invoice) =>
        invoice.invoice_number.toLowerCase().includes(normalizedSearch) ||
        invoice.customer_name.toLowerCase().includes(normalizedSearch),
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize).map(toListRecord);

  return {
    items,
    totalItems,
    totalPages,
    page: safePage,
    pageSize,
  };
}

export const INVOICE_STATUS_OPTIONS: {
  value: InvoiceStatusFilter;
  label: string;
}[] = [
    { value: "all", label: "All statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "DUE", label: "Due" },
    { value: "PAID", label: "Paid" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

export type InvoiceStats = {
  total: number;
  paidCount: number;
  pendingAmount: number;
  overdueCount: number;
  currency: string;
};

export function getInvoiceStats(): InvoiceStats {
  const all = getAllInvoices();
  const pending = all.filter(
    (invoice) => invoice.status === "OVERDUE" || invoice.status === "DUE",
  );

  return {
    total: all.length,
    paidCount: all.filter((invoice) => invoice.status === "PAID").length,
    pendingAmount:
      Math.round(
        pending.reduce((sum, invoice) => sum + invoice.total_amount, 0) * 100,
      ) / 100,
    overdueCount: all.filter((invoice) => invoice.status === "OVERDUE").length,
    currency: all[0]?.currency ?? "USD",
  };
}
