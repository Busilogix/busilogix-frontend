import type { UseFormSetValue } from "react-hook-form";

import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

export function applyCartItems(
  nextItems: CreateInvoiceFormInput["items"],
  setValue: UseFormSetValue<CreateInvoiceFormInput>,
): void {
  setValue("items", nextItems, {
    shouldDirty: true,
    shouldValidate: true,
  });
}
