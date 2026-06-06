import type { UseFormSetValue } from "react-hook-form";

import { buildWalkInEmail } from "@/lib/invoices/recent-billing-customers";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

export function applyAutoWalkInCustomer(
  mobile: string,
  setValue: UseFormSetValue<CreateInvoiceFormInput>,
): void {
  setValue("customer.name", "Walk-in Customer", {
    shouldDirty: true,
    shouldValidate: true,
  });
  setValue("customer.email", buildWalkInEmail(mobile), {
    shouldDirty: true,
    shouldValidate: true,
  });
}
