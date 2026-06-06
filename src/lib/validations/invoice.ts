import { z } from "zod";

const phonePattern = /^[+]?[\d\s()-]{10,15}$/;

const invoiceAddressFieldsSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
});

function refineOptionalInvoiceAddress(
  address: z.infer<typeof invoiceAddressFieldsSchema>,
  ctx: z.RefinementCtx,
  pathPrefix: "customer.address" | "address" = "customer.address",
) {
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
      path: [pathPrefix, "line1"],
    });
  }

  if (!trimmed.city) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "City is required",
      path: [pathPrefix, "city"],
    });
  }

  if (!trimmed.state) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "State is required",
      path: [pathPrefix, "state"],
    });
  }

  if (!trimmed.pincode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Pincode is required",
      path: [pathPrefix, "pincode"],
    });
  } else if (!/^\d{6}$/.test(trimmed.pincode)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter a valid 6-digit pincode",
      path: [pathPrefix, "pincode"],
    });
  }
}

const createInvoiceItemSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  quantity: z
    .number({ error: "Quantity is required" })
    .min(1, "Quantity must be at least 1"),
});

export const createInvoiceFormSchema = z
  .object({
    customer: z.object({
      name: z
        .string()
        .min(1, "Customer name is required")
        .min(2, "Customer name must be at least 2 characters"),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
      mobile: z
        .string()
        .min(1, "Mobile is required")
        .regex(phonePattern, "Enter a valid phone number (10–15 digits)"),
      address: invoiceAddressFieldsSchema,
    }),
    items: z
      .array(createInvoiceItemSchema)
      .min(1, "Add at least one line item"),
    taxPercentage: z
      .number({ error: "Tax percentage is required" })
      .min(0, "Tax cannot be negative")
      .max(100, "Tax cannot exceed 100%"),
    taxType: z.enum(["INTRA_STATE", "INTER_STATE"]),
    discountAmount: z
      .number({ error: "Discount is required" })
      .min(0, "Discount cannot be negative"),
  })
  .superRefine((data, ctx) => {
    refineOptionalInvoiceAddress(data.customer.address, ctx);
  });

export type CreateInvoiceFormInput = z.infer<typeof createInvoiceFormSchema>;
export type CreateInvoiceItemInput = z.infer<typeof createInvoiceItemSchema>;

export const defaultCreateInvoiceItem: CreateInvoiceItemInput = {
  productId: "",
  quantity: 1,
};

export function createDefaultCreateInvoiceValues(): CreateInvoiceFormInput {
  return {
    customer: {
      name: "",
      email: "",
      mobile: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
    items: [{ ...defaultCreateInvoiceItem }],
    taxPercentage: 18,
    taxType: "INTRA_STATE",
    discountAmount: 0,
  };
}

const lineItemSchema = z.object({
  item_name: z
    .string()
    .min(1, "Item name is required")
    .max(200, "Item name must be 200 characters or less"),
  quantity: z
    .number({ error: "Quantity is required" })
    .min(1, "Quantity must be at least 1"),
  unit_price: z
    .number({ error: "Unit price is required" })
    .min(0, "Unit price cannot be negative"),
  tax_percentage: z
    .number({ error: "Tax percentage is required" })
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100%"),
});

export const invoiceFormSchema = z
  .object({
    customer_name: z
      .string()
      .min(1, "Customer name is required")
      .min(2, "Customer name must be at least 2 characters"),
    customer_email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    customer_phone: z
      .string()
      .min(1, "Phone is required")
      .regex(phonePattern, "Enter a valid phone number (10–15 digits)"),
    invoice_number: z
      .string()
      .min(1, "Invoice number is required")
      .max(50, "Invoice number must be 50 characters or less"),
    issue_date: z.string().min(1, "Issue date is required"),
    due_date: z.string().min(1, "Due date is required"),
    line_items: z.array(lineItemSchema).min(1, "Add at least one line item"),
  })
  .refine((data) => new Date(data.due_date) >= new Date(data.issue_date), {
    message: "Due date must be on or after the issue date",
    path: ["due_date"],
  });

export type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;
export type InvoiceLineItemInput = z.infer<typeof lineItemSchema>;

export const defaultLineItem: InvoiceLineItemInput = {
  item_name: "",
  quantity: 1,
  unit_price: 0,
  tax_percentage: 0,
};

function getDefaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
}

export function createDefaultInvoiceFormValues(
  invoiceNumber = "",
): InvoiceFormInput {
  return {
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    invoice_number: invoiceNumber,
    issue_date: new Date().toISOString().split("T")[0],
    due_date: getDefaultDueDate(),
    line_items: [{ ...defaultLineItem }],
  };
}
