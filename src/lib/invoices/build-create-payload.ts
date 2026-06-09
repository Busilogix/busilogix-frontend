import type { CreateInvoiceRequest } from "@/lib/api/types/invoice.types";
import { buildOptionalInvoiceAddress } from "@/lib/invoices/map-customer-lookup";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";
import { isCounterSaleCustomer } from "@/lib/invoices/counter-sale";

export function buildCreateInvoicePayload(
  data: CreateInvoiceFormInput,
): CreateInvoiceRequest {
  const address = buildOptionalInvoiceAddress(data.customer.address);
  const isWalkIn = isCounterSaleCustomer(data.customer);

  return {
    customer: {
      name: isWalkIn ? null : data.customer.name.trim(),
      email: isWalkIn ? null : data.customer.email.trim(),
      mobile: data.customer.mobile.trim(),
      ...(address ? { address } : {}),
    },
    items: data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    taxPercentage: data.taxPercentage,
    taxType: data.taxType,
    discountAmount: data.discountAmount,
  };
}
