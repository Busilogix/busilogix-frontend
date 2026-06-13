import { getAllCustomers } from "@/lib/customers/mock-store";
import { getAllInvoices } from "@/lib/invoices/mock-store";

export function getReportsData() {
  const customers = getAllCustomers();
  const invoices = getAllInvoices();
  const paidInvoices = invoices.filter((invoice) => invoice.status === "PAID");
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "OVERDUE" || invoice.status === "DUE",
  );

  const revenue = paidInvoices.reduce(
    (sum, invoice) => sum + invoice.total_amount,
    0,
  );
  const pending = pendingInvoices.reduce(
    (sum, invoice) => sum + invoice.total_amount,
    0,
  );

  const statusCounts = invoices.reduce<Record<string, number>>(
    (acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const customerTotals = customers
    .map((customer) => {
      const customerInvoices = invoices.filter(
        (invoice) => invoice.customer_id === customer.id,
      );

      return {
        id: customer.id,
        name: customer.name,
        invoiceCount: customerInvoices.length,
        revenue: customerInvoices
          .filter((invoice) => invoice.status === "PAID")
          .reduce((sum, invoice) => sum + invoice.total_amount, 0),
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    currency: invoices[0]?.currency ?? "USD",
    totals: {
      revenue,
      pending,
      invoices: invoices.length,
      customers: customers.length,
    },
    statusCounts,
    customerTotals,
  };
}
