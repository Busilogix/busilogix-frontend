import { z } from "zod";

const phonePattern = /^[+]?[\d\s()-]{10,15}$/;

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
    line_items: z
      .array(lineItemSchema)
      .min(1, "Add at least one line item"),
  })
  .refine(
    (data) => new Date(data.due_date) >= new Date(data.issue_date),
    {
      message: "Due date must be on or after the issue date",
      path: ["due_date"],
    },
  );

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
