import type { CustomerAddress } from "@/lib/api/types/customer.types";
import type { ApiCustomer } from "@/lib/api/types/customer.types";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

const LOOKUP_MOBILE_PATTERN = /^[+]?[\d\s()-]{10,15}$/;

type InvoiceAddressInput = CreateInvoiceFormInput["customer"]["address"];

export function hasInvoiceAddress(address: InvoiceAddressInput): boolean {
  return Object.values(address).some((value) => value.trim().length > 0);
}

export function isInvoiceAddressComplete(
  address: InvoiceAddressInput,
): boolean {
  return Boolean(
    address.line1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    /^\d{6}$/.test(address.pincode.trim()),
  );
}

export function formatInvoiceAddressPreview(
  address: InvoiceAddressInput,
): string {
  const line1 = address.line1.trim();
  const line2 = address.line2.trim();
  const city = address.city.trim();
  const state = address.state.trim();
  const pincode = address.pincode.trim();

  if (!hasInvoiceAddress(address)) {
    return "No billing address added";
  }

  const locality = [line1, line2].filter(Boolean).join(", ");
  const region = [city, state, pincode].filter(Boolean).join(", ");

  return [locality, region].filter(Boolean).join(" · ");
}

export function buildOptionalInvoiceAddress(
  address: InvoiceAddressInput,
): CustomerAddress | undefined {
  if (!hasInvoiceAddress(address)) {
    return undefined;
  }

  return buildInvoiceAddress(address);
}

export function buildInvoiceAddress(
  address: InvoiceAddressInput,
): CustomerAddress {
  return {
    line1: address.line1.trim(),
    line2: address.line2.trim() || undefined,
    city: address.city.trim(),
    state: address.state.trim(),
    pincode: address.pincode.trim(),
  };
}

export function isInvoiceCustomerMobileReady(mobile: string): boolean {
  return LOOKUP_MOBILE_PATTERN.test(mobile.trim());
}

export function mapApiCustomerToInvoiceCustomer(
  customer: ApiCustomer,
): CreateInvoiceFormInput["customer"] {
  return {
    name: customer.name?.trim() ?? "",
    email: customer.email?.trim() ?? "",
    mobile: customer.mobile.trim(),
    address: {
      line1: customer.address?.line1?.trim() ?? "",
      line2: customer.address?.line2?.trim() ?? "",
      city: customer.address?.city?.trim() ?? "",
      state: customer.address?.state?.trim() ?? "",
      pincode: customer.address?.pincode?.trim() ?? "",
    },
  };
}
