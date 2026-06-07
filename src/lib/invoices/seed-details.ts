import { SEED_CUSTOMERS } from "@/lib/customers/mock-data";

import {
  calculateLineSubtotal,
  calculateLineTax,
  calculateLineTotal,
} from "./calculations";
import type { InvoiceDetailRecord, InvoiceLineItemRecord } from "./types";

const SEED_INVOICES: any[] = [];

const customerById = Object.fromEntries(
  SEED_CUSTOMERS.map((customer) => [customer.id, customer]),
);

function buildSampleLineItems(totalAmount: number): InvoiceLineItemRecord[] {
  const primarySubtotal = Math.round(totalAmount * 0.85 * 100) / 100;
  const secondarySubtotal =
    Math.round((totalAmount - primarySubtotal) * 100) / 100;

  const items = [
    {
      id: "li_1",
      item_name: "Professional services",
      quantity: 1,
      unit_price: primarySubtotal,
      tax_percentage: 10,
    },
  ];

  if (secondarySubtotal > 0) {
    items.push({
      id: "li_2",
      item_name: "Additional charges",
      quantity: 1,
      unit_price: secondarySubtotal,
      tax_percentage: 0,
    });
  }

  return items.map((item) => {
    const input = {
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_percentage: item.tax_percentage,
    };
    return {
      ...item,
      line_subtotal: calculateLineSubtotal(input),
      line_tax: calculateLineTax(input),
      line_total: calculateLineTotal(input),
    };
  });
}

export function buildSeedInvoiceDetails(): InvoiceDetailRecord[] {
  return SEED_INVOICES.map((invoice) => {
    const customer = customerById[invoice.customer_id];
    const line_items = buildSampleLineItems(invoice.total_amount);
    const subtotal = line_items.reduce(
      (sum, item) => sum + item.line_subtotal,
      0,
    );
    const tax_amount = line_items.reduce((sum, item) => sum + item.line_tax, 0);

    return {
      ...invoice,
      customer_email: customer?.email ?? "billing@customer.com",
      customer_phone: customer?.phone ?? "+1 (555) 000-0000",
      subtotal: Math.round(subtotal * 100) / 100,
      tax_amount: Math.round(tax_amount * 100) / 100,
      line_items,
      notes:
        invoice.status === "PAID"
          ? "Payment received. Thank you for your business."
          : undefined,
    };
  });
}

export const SEED_INVOICE_DETAILS = buildSeedInvoiceDetails();
