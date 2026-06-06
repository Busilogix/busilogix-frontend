import type {
  StoreProfileRequest,
  UpdatePaymentInfoRequest,
} from "@/lib/api/types/store.types";
import type {
  PaymentFormInput,
  ProfileFormInput,
} from "@/lib/validations/settings";

export function buildStoreProfilePayload(
  data: ProfileFormInput,
): StoreProfileRequest {
  const line2 = data.address_line2.trim();
  const logoUrl = data.logo_url.trim();
  const gstNumber = data.gst_number.trim().toUpperCase();

  return {
    name: data.company_name.trim(),
    address: {
      line1: data.address_line1.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      pincode: data.postal_code.trim(),
      ...(line2 ? { line2 } : {}),
    },
    gstNumber,
    email: data.company_email.trim(),
    mobile: data.company_phone.trim(),
    ...(logoUrl ? { logoUrl } : {}),
  };
}

export function buildPaymentInfoPayload(
  data: PaymentFormInput,
): UpdatePaymentInfoRequest {
  return {
    upiId: data.upi_id.trim(),
    bankName: data.bank_name.trim(),
    accountName: data.account_name.trim(),
    accountNumber: data.account_number.trim(),
    ifscCode: data.ifsc_code.trim().toUpperCase(),
  };
}
