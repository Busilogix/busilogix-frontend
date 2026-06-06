import type { CreateInvoiceRequest } from "@/lib/api/types/invoice.types";
import { buildOptionalInvoiceAddress } from "@/lib/invoices/map-customer-lookup";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

export function buildCreateInvoicePayload(
  data: CreateInvoiceFormInput,
): CreateInvoiceRequest {
  const address = buildOptionalInvoiceAddress(data.customer.address);

  return {
    customer: {
      name: data.customer.name.trim(),
      email: data.customer.email.trim(),
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
