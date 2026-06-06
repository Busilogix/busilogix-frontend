import type { UseFormSetValue } from "react-hook-form";

import { customerService } from "@/lib/api/customer.service";
import { isApiError } from "@/lib/api/errors";
import { mapApiCustomerToInvoiceCustomer } from "@/lib/invoices/map-customer-lookup";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

export type CustomerLookupResult =
  | { status: "found"; customerName: string; mobile: string }
  | { status: "not_found"; mobile: string }
  | { status: "error"; message: string };

export async function applyCustomerLookupByMobile(
  mobile: string,
  setValue: UseFormSetValue<CreateInvoiceFormInput>,
): Promise<CustomerLookupResult> {
  try {
    const result = await customerService.lookupByMobile(mobile);

    if (result.exists && result.customer) {
      const mappedCustomer = mapApiCustomerToInvoiceCustomer(result.customer);

      setValue("customer.name", mappedCustomer.name, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.email", mappedCustomer.email, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.address.line1", mappedCustomer.address.line1, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.address.line2", mappedCustomer.address.line2, {
        shouldDirty: true,
      });
      setValue("customer.address.city", mappedCustomer.address.city, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.address.state", mappedCustomer.address.state, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("customer.address.pincode", mappedCustomer.address.pincode, {
        shouldDirty: true,
        shouldValidate: true,
      });

      return {
        status: "found",
        customerName: mappedCustomer.name || mappedCustomer.mobile,
        mobile,
      };
    }

    return { status: "not_found", mobile };
  } catch (error) {
    return {
      status: "error",
      message: isApiError(error)
        ? error.message
        : "Unable to look up customer.",
    };
  }
}
