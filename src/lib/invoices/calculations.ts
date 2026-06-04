export type LineItemCalculationInput = {
  quantity: number;
  unit_price: number;
  tax_percentage: number;
};

export type InvoiceTotals = {
  subtotal: number;
  tax: number;
  grandTotal: number;
};

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateLineSubtotal(
  item: LineItemCalculationInput,
): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unit_price) ? item.unit_price : 0;
  return roundCurrency(quantity * unitPrice);
}

export function calculateLineTax(item: LineItemCalculationInput): number {
  const taxRate = Number.isFinite(item.tax_percentage) ? item.tax_percentage : 0;
  return roundCurrency(calculateLineSubtotal(item) * (taxRate / 100));
}

export function calculateLineTotal(item: LineItemCalculationInput): number {
  return roundCurrency(calculateLineSubtotal(item) + calculateLineTax(item));
}

export function calculateInvoiceTotals(
  lineItems: LineItemCalculationInput[],
): InvoiceTotals {
  const subtotal = roundCurrency(
    lineItems.reduce((sum, item) => sum + calculateLineSubtotal(item), 0),
  );
  const tax = roundCurrency(
    lineItems.reduce((sum, item) => sum + calculateLineTax(item), 0),
  );

  return {
    subtotal,
    tax,
    grandTotal: roundCurrency(subtotal + tax),
  };
}
