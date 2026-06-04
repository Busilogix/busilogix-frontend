"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/layout/loading-state";
import {
  createProduct,
  getProductById,
  updateProduct,
  CATEGORY_OPTIONS,
} from "@/lib/products/mock-store";
import type { ProductFormValues } from "@/lib/products/types";
import {
  productFormSchema,
  type ProductFormInput,
  defaultProductValues,
} from "@/lib/validations/product";

const LOAD_DELAY_MS = 400;
const SUBMIT_DELAY_MS = 600;

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
};

export function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [isLoadingProduct, setIsLoadingProduct] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultProductValues,
  });

  useEffect(() => {
    if (mode !== "edit" || !productId) return;

    setIsLoadingProduct(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      const product = getProductById(productId);

      if (!product) {
        setNotFound(true);
        setIsLoadingProduct(false);
        return;
      }

      reset({
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        category: product.category,
        status: product.status,
        stock: product.stock,
        min_stock_level: product.min_stock_level,
      });
      setIsLoadingProduct(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [mode, productId, reset]);

  async function onSubmit(data: ProductFormInput) {
    setSubmitError(null);
    setIsSubmitting(true);

    const payload: ProductFormValues = {
      name: data.name,
      sku: data.sku,
      description: data.description || "",
      price: Number(data.price),
      category: data.category,
      status: data.status,
      stock: Number(data.stock),
      min_stock_level: Number(data.min_stock_level),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));

      if (mode === "create") {
        createProduct(payload);
      } else if (productId) {
        const updated = updateProduct(productId, payload);
        if (!updated) {
          setSubmitError("Product not found. It may have been removed.");
          return;
        }
      }

      router.push("/products");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingProduct) {
    return <LoadingState title="Loading product details" variant="skeleton" />;
  }

  if (notFound) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-medium text-foreground">Product not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This product catalog entry may have been deleted or the link is invalid.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            render={<Link href="/products" />}
          >
            Back to products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b py-3 px-4">
        <CardTitle className="text-base font-semibold">
          {mode === "create" ? "Product catalog details" : "Update product properties"}
        </CardTitle>
        <CardDescription className="text-xs">
          Enter product details, pricing, SKUs, and initial warehouse stock levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 px-4 pb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {submitError ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {submitError}
            </p>
          ) : null}

          <FieldGroup className="gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field data-invalid={!!errors.name || undefined}>
                <FieldLabel htmlFor="name" className="text-xs">Product Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g. Mechanical Keyboard"
                  disabled={isSubmitting}
                  className="h-8 text-xs"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field data-invalid={!!errors.sku || undefined}>
                <FieldLabel htmlFor="sku" className="text-xs">SKU</FieldLabel>
                <Input
                  id="sku"
                  placeholder="e.g. KB-MECH-01"
                  disabled={isSubmitting}
                  className="h-8 text-xs font-mono"
                  aria-invalid={!!errors.sku}
                  {...register("sku")}
                />
                <FieldError errors={[errors.sku]} />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field data-invalid={!!errors.category || undefined}>
                <FieldLabel htmlFor="category" className="text-xs">Category</FieldLabel>
                <select
                  id="category"
                  disabled={isSubmitting}
                  className="flex h-8 w-full rounded-lg border border-input bg-background/50 px-2 py-1 text-xs shadow-inner shadow-slate-950/5 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/20"
                  {...register("category")}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <FieldError errors={[errors.category]} />
              </Field>

              <Field data-invalid={!!errors.price || undefined}>
                <FieldLabel htmlFor="price" className="text-xs">Price ($)</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isSubmitting}
                  className="h-8 text-xs"
                  aria-invalid={!!errors.price}
                  {...register("price")}
                />
                <FieldError errors={[errors.price]} />
              </Field>

              <Field data-invalid={!!errors.status || undefined}>
                <FieldLabel htmlFor="status" className="text-xs">Status</FieldLabel>
                <select
                  id="status"
                  disabled={isSubmitting}
                  className="flex h-8 w-full rounded-lg border border-input bg-background/50 px-2 py-1 text-xs shadow-inner shadow-slate-950/5 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/20"
                  {...register("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <FieldError errors={[errors.status]} />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 border-t pt-3">
              <Field data-invalid={!!errors.stock || undefined}>
                <FieldLabel htmlFor="stock" className="text-xs">Stock Level</FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  disabled={isSubmitting}
                  className="h-8 text-xs"
                  aria-invalid={!!errors.stock}
                  {...register("stock")}
                />
                <FieldError errors={[errors.stock]} />
              </Field>

              <Field data-invalid={!!errors.min_stock_level || undefined}>
                <FieldLabel htmlFor="min_stock_level" className="text-xs">Min Stock Threshold (Alerts)</FieldLabel>
                <Input
                  id="min_stock_level"
                  type="number"
                  placeholder="5"
                  disabled={isSubmitting}
                  className="h-8 text-xs"
                  aria-invalid={!!errors.min_stock_level}
                  {...register("min_stock_level")}
                />
                <FieldError errors={[errors.min_stock_level]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.description || undefined}>
              <FieldLabel htmlFor="description" className="text-xs">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Product characteristics, dimensions, materials..."
                rows={2}
                disabled={isSubmitting}
                className="text-xs"
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>
          </FieldGroup>

          <div className="flex flex-col-reverse gap-2 border-t pt-3.5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              render={<Link href="/products" />}
              className="h-8 text-xs px-3"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs px-3" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin size-3" aria-hidden />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : mode === "create" ? (
                "Create product"
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
