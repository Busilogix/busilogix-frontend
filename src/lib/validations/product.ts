import { z } from "zod";

export const createProductFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be 50 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  price: z
    .number({ error: "Selling price is required" })
    .min(0.01, "Selling price must be greater than 0"),
  stock: z
    .number({ error: "Stock quantity is required" })
    .min(0, "Stock cannot be negative")
    .int("Stock must be an integer"),
});

export type CreateProductFormInput = z.infer<typeof createProductFormSchema>;

export const createProductDefaultValues: CreateProductFormInput = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  stock: 0,
};

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be 50 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  price: z.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "inactive"]),
  stock: z
    .number()
    .min(0, "Stock cannot be negative")
    .int("Stock must be an integer"),
  min_stock_level: z
    .number()
    .min(0, "Minimum stock level cannot be negative")
    .int("Minimum stock level must be an integer"),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const defaultProductValues: ProductFormInput = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  category: "Electronics",
  status: "active",
  stock: 0,
  min_stock_level: 5,
};
