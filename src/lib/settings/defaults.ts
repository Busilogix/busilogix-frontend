import type { SettingsRecord } from "./types";

export const DEFAULT_SETTINGS: SettingsRecord = {
  company_name: "Busilogix Inc.",
  company_email: "hello@busilogix.com",
  company_phone: "+1 (555) 100-2000",
  company_website: "https://busilogix.com",
  address_line1: "100 Business Park Drive",
  address_line2: "Suite 400",
  city: "San Francisco",
  state: "CA",
  postal_code: "94105",
  country: "United States",
  gst_number: "27AABCU9603R1ZM",
  pan_number: "AABCU9603R",
  legal_business_name: "Busilogix Technologies Pvt. Ltd.",
  default_currency: "USD",
  invoice_prefix: "INV",
  default_payment_terms_days: 30,
  default_tax_percentage: 10,
  email_from_name: "Busilogix Billing",
  email_reply_to: "billing@busilogix.com",
  email_signature:
    "Thank you for your business.\nBusilogix — Professional invoicing made simple.",
};
