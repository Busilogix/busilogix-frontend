import { z } from "zod";

const mobilePattern = /^[+]?[\d\s()-]{10,15}$/;

const addressFieldsSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
});

export const customerFormSchema = z
  .object({
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(mobilePattern, "Enter a valid mobile number (10–15 digits)"),
    name: z.string().max(100, "Name must be 100 characters or less"),
    email: z.union([
      z.literal(""),
      z.string().email("Enter a valid email address"),
    ]),
    address: addressFieldsSchema,
  })
  .superRefine((data, ctx) => {
    const address = data.address;

    const trimmed = {
      line1: address.line1.trim(),
      line2: address.line2.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };

    const hasAnyAddressField = Object.values(trimmed).some(Boolean);

    if (!hasAnyAddressField) {
      return;
    }

    if (!trimmed.line1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address line 1 is required",
        path: ["address", "line1"],
      });
    }

    if (!trimmed.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required",
        path: ["address", "city"],
      });
    }

    if (!trimmed.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State is required",
        path: ["address", "state"],
      });
    }

    if (!trimmed.pincode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pincode is required",
        path: ["address", "pincode"],
      });
    } else if (!/^\d{4,10}$/.test(trimmed.pincode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid pincode",
        path: ["address", "pincode"],
      });
    }
  });

export type CustomerFormInput = z.infer<typeof customerFormSchema>;
