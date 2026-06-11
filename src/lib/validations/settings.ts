import { z } from "zod";

const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const phonePattern = /^[+]?[\d\s()-]{10,15}$/;
const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const accountNumberPattern = /^\d{9,18}$/;

export const profileFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required").min(2),
  company_email: z.string().min(1, "Email is required").email(),
  company_phone: z
    .string()
    .min(1, "Phone is required")
    .regex(phonePattern, "Enter a valid phone number"),
  logo_url: z
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
  gst_number: z
    .string()
    .refine(
      (value) => !value.trim() || gstPattern.test(value.trim().toUpperCase()),
      "Enter a valid 15-character GST number",
    ),
});

export const paymentFormSchema = z
  .object({
    upi_id: z.string().min(1, "UPI ID is required"),
    bank_name: z.string().min(1, "Bank name is required"),
    account_name: z.string().min(1, "Account name is required"),
    account_number: z.string().min(1, "Account number is required"),
    ifsc_code: z.string().min(1, "IFSC code is required"),
  })
  .superRefine((data, ctx) => {
    if (!ifscPattern.test(data.ifsc_code.trim().toUpperCase())) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid IFSC code",
        path: ["ifsc_code"],
      });
    }

    if (!accountNumberPattern.test(data.account_number.trim())) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid account number (9–18 digits)",
        path: ["account_number"],
      });
    }
  });

export const settingsFormSchema = profileFormSchema.extend({
  upi_id: z.string(),
  bank_name: z.string(),
  account_name: z.string(),
  account_number: z.string(),
  ifsc_code: z.string(),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
export type ProfileFormInput = z.infer<typeof profileFormSchema>;
export type PaymentFormInput = z.infer<typeof paymentFormSchema>;

export const PROFILE_FIELD_NAMES = [
  "company_name",
  "company_email",
  "company_phone",
  "logo_url",
  "address_line1",
  "address_line2",
  "city",
  "state",
  "postal_code",
  "gst_number",
] as const satisfies ReadonlyArray<keyof ProfileFormInput>;

export const PAYMENT_FIELD_NAMES = [
  "upi_id",
  "bank_name",
  "account_name",
  "account_number",
  "ifsc_code",
] as const satisfies ReadonlyArray<keyof PaymentFormInput>;
