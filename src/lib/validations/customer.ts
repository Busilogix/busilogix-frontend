import { z } from "zod";

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(
      /^[+]?[\d\s()-]{10,15}$/,
      "Enter a valid phone number (10–15 digits)",
    ),
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be 500 characters or less"),
});

export type CustomerFormInput = z.infer<typeof customerFormSchema>;
