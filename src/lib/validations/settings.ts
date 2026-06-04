import { z } from "zod";

const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const phonePattern = /^[+]?[\d\s()-]{10,15}$/;

export const settingsFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required").min(2),
  company_email: z.string().min(1, "Email is required").email(),
  company_phone: z
    .string()
    .min(1, "Phone is required")
    .regex(phonePattern, "Enter a valid phone number"),
  company_website: z
    .string()
    .refine(
      (value) => !value.trim() || /^https?:\/\/.+/.test(value),
      "Enter a valid URL starting with http:// or https://",
    ),
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  gst_number: z
    .string()
    .refine(
      (value) => !value.trim() || gstPattern.test(value.trim().toUpperCase()),
      "Enter a valid 15-character GST number",
    ),
  pan_number: z.string(),
  legal_business_name: z.string().min(1, "Legal business name is required"),
  default_currency: z.string().min(1, "Currency is required"),
  invoice_prefix: z
    .string()
    .min(1, "Invoice prefix is required")
    .max(10, "Prefix must be 10 characters or less"),
  default_payment_terms_days: z
    .number({ error: "Payment terms are required" })
    .min(1, "Must be at least 1 day")
    .max(365, "Must be 365 days or less"),
  default_tax_percentage: z
    .number({ error: "Default tax is required" })
    .min(0)
    .max(100),
  email_from_name: z.string().min(1, "From name is required"),
  email_reply_to: z.string().min(1, "Reply-to email is required").email(),
  email_signature: z.string().max(1000, "Signature is too long"),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
