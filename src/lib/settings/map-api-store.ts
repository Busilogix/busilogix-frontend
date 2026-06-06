import type { ApiStore } from "@/lib/api/types/store.types";
import type { SettingsFormInput } from "@/lib/validations/settings";

export function mapApiStoreToFormInput(store: ApiStore): SettingsFormInput {
  const payment = store.paymentInfo;

  return {
    company_name: store.name.trim(),
    company_email: store.email?.trim() ?? "",
    company_phone: store.mobile?.trim() ?? "",
    logo_url: store.logoUrl?.trim() ?? "",
    address_line1: store.address.line1.trim(),
    address_line2: store.address.line2?.trim() ?? "",
    city: store.address.city.trim(),
    state: store.address.state.trim(),
    postal_code: store.address.pincode.trim(),
    gst_number: store.gstNumber.trim(),
    upi_id: payment?.upiId?.trim() ?? "",
    bank_name: payment?.bankName?.trim() ?? "",
    account_name: payment?.accountName?.trim() ?? "",
    account_number: payment?.accountNumber?.trim() ?? "",
    ifsc_code: payment?.ifscCode?.trim() ?? "",
  };
}
