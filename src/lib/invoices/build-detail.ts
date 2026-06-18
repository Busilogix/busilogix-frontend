import {
  calculateLineSubtotal,
  calculateLineTax,
  calculateLineTotal,
  calculateInvoiceTotals,
} from "./calculations";
import type { InvoiceDetailRecord, InvoiceLineItemRecord } from "./types";
import type { InvoiceFormInput } from "@/lib/validations/invoice";

export function buildLineItemsFromForm(
  lineItems: InvoiceFormInput["line_items"],
): InvoiceLineItemRecord[] {
  return lineItems.map((item, index) => {
    const input = {
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_percentage: item.tax_percentage,
    };
    return {
      id: `li_${index + 1}`,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_percentage: item.tax_percentage,
      line_subtotal: calculateLineSubtotal(input),
      line_tax: calculateLineTax(input),
      line_total: calculateLineTotal(input),
    };
  });
}

export function buildInvoiceDetailFromForm(
  data: InvoiceFormInput,
  options?: { id?: string; status?: InvoiceDetailRecord["status"] },
): InvoiceDetailRecord {
  const line_items = buildLineItemsFromForm(data.line_items);
  const totals = calculateInvoiceTotals(data.line_items);
  const now = new Date().toISOString();

  return {
    id: options?.id ?? `inv_${Date.now().toString(36)}`,
    invoice_number: data.invoice_number,
    customer_id: `cust_${Date.now().toString(36)}`,
    customer_name: data.customer_name,
    customer_email: data.customer_email ?? "",
    customer_phone: data.customer_phone,
    status: options?.status ?? "DRAFT",
    issue_date: data.issue_date,
    due_date: data.due_date,
    currency: "USD",
    subtotal: totals.subtotal,
    tax_amount: totals.tax,
    total_amount: totals.grandTotal,
    line_items,
    created_at: now,
    updated_at: now,
  };
}
