import type { UseFormSetValue } from "react-hook-form";

import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

export const COUNTER_SALE_CUSTOMER = {
  mobile: "+910000000000",
  name: "Walk-in Customer",
  email: "walkin@counter.local",
} as const;

export function applyCounterSaleCustomer(
  setValue: UseFormSetValue<CreateInvoiceFormInput>,
): void {
  setValue("customer.mobile", COUNTER_SALE_CUSTOMER.mobile, {
    shouldDirty: true,
    shouldValidate: true,
  });
  setValue("customer.name", COUNTER_SALE_CUSTOMER.name, {
    shouldDirty: true,
    shouldValidate: true,
  });
  setValue("customer.email", COUNTER_SALE_CUSTOMER.email, {
    shouldDirty: true,
    shouldValidate: true,
  });
}

export function isCounterSaleCustomer(
  customer: CreateInvoiceFormInput["customer"],
): boolean {
  return (
    customer.mobile.trim() === COUNTER_SALE_CUSTOMER.mobile &&
    customer.name.trim() === COUNTER_SALE_CUSTOMER.name &&
    customer.email.trim() === COUNTER_SALE_CUSTOMER.email
  );
}
