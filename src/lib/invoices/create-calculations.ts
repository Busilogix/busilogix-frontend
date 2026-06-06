import type { ApiProduct } from "@/lib/api/types/product.types";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

import { roundCurrency } from "./calculations";

export type CreateInvoiceTotals = {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  tax: number;
  grandTotal: number;
};

export function calculateCreateInvoiceTotals(
  items: CreateInvoiceFormInput["items"],
  products: ApiProduct[],
  taxPercentage: number,
  discountAmount: number,
): CreateInvoiceTotals {
  const subtotal = roundCurrency(
    items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const unitPrice = product?.sellingPrice ?? 0;
      const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
      return sum + quantity * unitPrice;
    }, 0),
  );

  const discount = roundCurrency(
    Number.isFinite(discountAmount) ? discountAmount : 0,
  );
  const taxableAmount = roundCurrency(Math.max(0, subtotal - discount));
  const taxRate = Number.isFinite(taxPercentage) ? taxPercentage : 0;
  const tax = roundCurrency(taxableAmount * (taxRate / 100));

  return {
    subtotal,
    discountAmount: discount,
    taxableAmount,
    tax,
    grandTotal: roundCurrency(taxableAmount + tax),
  };
}
