import type {
  ApiCustomer,
  CustomerAddress,
} from "@/lib/api/types/customer.types";
import type { CustomerFormInput } from "@/lib/validations/customer";

import type { CustomerRecord } from "./types";

export function formatCustomerAddress(address?: CustomerAddress): string {
  if (!address) {
    return "";
  }

  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

export function mapApiCustomerToRecord(customer: ApiCustomer): CustomerRecord {
  return {
    id: customer.id,
    name: customer.name?.trim() ?? "",
    email: customer.email?.trim() ?? "",
    phone: customer.mobile?.trim() ?? "",
    address: formatCustomerAddress(customer.address),
    created_at: customer.createdAt,
    updated_at: customer.createdAt,
  };
}

export function getCustomerDisplayName(customer: CustomerRecord): string {
  return customer.name.trim() || customer.phone.trim() || "Unnamed customer";
}

export function mapApiCustomerToFormInput(
  customer: ApiCustomer,
): CustomerFormInput {
  return {
    mobile: customer.mobile?.trim() ?? "",
    name: customer.name?.trim() ?? "",
    email: customer.email?.trim() ?? "",
    address: {
      line1: customer.address?.line1?.trim() ?? "",
      line2: customer.address?.line2?.trim() ?? "",
      city: customer.address?.city?.trim() ?? "",
      state: customer.address?.state?.trim() ?? "",
      pincode: customer.address?.pincode?.trim() ?? "",
    },
  };
}
