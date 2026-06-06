import type { CreateCustomerRequest } from "@/lib/api/types/customer.types";
import type { CustomerFormInput } from "@/lib/validations/customer";

export function hasAddressContent(
  address: NonNullable<CustomerFormInput["address"]>,
): boolean {
  return Object.values(address).some((value) => value?.trim());
}

export function buildCreateCustomerPayload(
  data: CustomerFormInput,
): CreateCustomerRequest {
  const payload: CreateCustomerRequest = {
    mobile: data.mobile.trim(),
  };

  const name = data.name?.trim();
  if (name) {
    payload.name = name;
  }

  const email = data.email?.trim();
  if (email) {
    payload.email = email;
  }

  const address = data.address;
  if (address && hasAddressContent(address)) {
    const line2 = address.line2?.trim();

    payload.address = {
      line1: address.line1.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
      ...(line2 ? { line2 } : {}),
    };
  }

  return payload;
}
