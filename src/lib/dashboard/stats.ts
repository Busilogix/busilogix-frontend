import { getAllCustomers } from "@/lib/customers/mock-store";
import { getAllInvoices } from "@/lib/invoices/mock-store";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";

import type { DashboardData } from "./types";

const RECENT_LIMIT = 5;
const DEFAULT_CURRENCY = "USD";

function toListInvoice(invoice: InvoiceDetailRecord) {
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

export function getDashboardData(): DashboardData {
  const customers = getAllCustomers();
  const invoices = getAllInvoices();

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total_amount, 0);

  const pendingAmount = invoices
    .filter(
      (invoice) => invoice.status === "sent" || invoice.status === "overdue",
    )
    .reduce((sum, invoice) => sum + invoice.total_amount, 0);

  return {
    metrics: {
      totalCustomers: customers.length,
      totalInvoices: invoices.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingAmount: Math.round(pendingAmount * 100) / 100,
      currency: invoices[0]?.currency ?? DEFAULT_CURRENCY,
    },
    recentInvoices: invoices.slice(0, RECENT_LIMIT).map(toListInvoice),
    recentCustomers: customers.slice(0, RECENT_LIMIT),
  };
}
