"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/layout/loading-state";
import { isApiError } from "@/lib/api/errors";
import { productService } from "@/lib/api/product.service";
import { buildCreateProductPayload } from "@/lib/products/build-create-payload";
import { mapApiProductToFormInput } from "@/lib/products/map-api-product";
import {
  createProductDefaultValues,
  createProductFormSchema,
  type CreateProductFormInput,
} from "@/lib/validations/product";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
};

export type CreateProductFormProps = {
  variant?: "card" | "embedded";
  fieldIdPrefix?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type ProductFormFieldsProps = {
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  register: ReturnType<typeof useForm<CreateProductFormInput>>["register"];
  errors: ReturnType<
    typeof useForm<CreateProductFormInput>
  >["formState"]["errors"];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitError: string | null;
  title: string;
  description: string;
  variant: "card" | "embedded";
  fieldIdPrefix: string;
  onCancel?: () => void;
};

function ProductFormFields({
  isSubmitting,
  submitLabel,
  submittingLabel,
  register,
  errors,
  onSubmit,
  submitError,
  title,
  description,
  variant,
  fieldIdPrefix,
  onCancel,
}: ProductFormFieldsProps) {
  const form = (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
            <FieldLabel htmlFor={`${fieldIdPrefix}-name`} className="text-xs">
              Product name
            </FieldLabel>
            <Input
              id={`${fieldIdPrefix}-name`}
              placeholder="e.g. iPhone 15"
              disabled={isSubmitting}
              className="h-8 text-xs"
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={!!errors.sku || undefined}>
            <FieldLabel htmlFor={`${fieldIdPrefix}-sku`} className="text-xs">
              SKU
            </FieldLabel>
            <Input
              id={`${fieldIdPrefix}-sku`}
              placeholder="e.g. IPH15-128-BLK"
              disabled={isSubmitting}
              className="h-8 font-mono text-xs"
              {...register("sku")}
            />
            <FieldError errors={[errors.sku]} />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field data-invalid={!!errors.price || undefined}>
            <FieldLabel htmlFor={`${fieldIdPrefix}-price`} className="text-xs">
              Selling price
            </FieldLabel>
            <Input
              id={`${fieldIdPrefix}-price`}
              type="number"
              min={0}
              step="0.01"
              placeholder="79999.00"
              disabled={isSubmitting}
              className="h-8 text-xs"
              {...register("price", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.price]} />
          </Field>

          <Field data-invalid={!!errors.stock || undefined}>
            <FieldLabel htmlFor={`${fieldIdPrefix}-stock`} className="text-xs">
              Stock quantity
            </FieldLabel>
            <Input
              id={`${fieldIdPrefix}-stock`}
              type="number"
              min={0}
              step="1"
              placeholder="50"
              disabled={isSubmitting}
              className="h-8 text-xs"
              {...register("stock", { valueAsNumber: true })}
            />
            <FieldError errors={[errors.stock]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel
            htmlFor={`${fieldIdPrefix}-description`}
            className="text-xs"
          >
            Description
          </FieldLabel>
          <Textarea
            id={`${fieldIdPrefix}-description`}
            placeholder="Apple iPhone 15 128GB Black"
            rows={2}
            disabled={isSubmitting}
            className="text-xs"
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 border-t pt-3.5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-8 px-3 text-xs"
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            render={<Link href="/products" />}
            className="h-8 px-3 text-xs"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className="h-8 px-3 text-xs"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3 animate-spin" aria-hidden />
              {submittingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );

  if (variant === "embedded") {
    return form;
  }

  return (
    <Card>
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-4 pb-4">{form}</CardContent>
    </Card>
  );
}

export function CreateProductForm({
  variant = "card",
  fieldIdPrefix = "create-product",
  onSuccess,
  onCancel,
}: CreateProductFormProps = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormInput>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: createProductDefaultValues,
  });

  async function onSubmit(data: CreateProductFormInput) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const { message } = await productService.create(
        buildCreateProductPayload(data),
      );

      toast.success("Product created", { description: message });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/products");
      }
    } catch (error) {
      setSubmitError(
        isApiError(error)
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProductFormFields
      title="Product catalog details"
      description="Add name, SKU, selling price, and opening stock for the new product."
      isSubmitting={isSubmitting}
      submitLabel="Create product"
      submittingLabel="Creating..."
      register={register}
      errors={errors}
      submitError={submitError}
      onSubmit={handleSubmit(onSubmit)}
      variant={variant}
      fieldIdPrefix={fieldIdPrefix}
      onCancel={onCancel}
    />
  );
}

export type EditProductFormProps = {
  productId: string;
  variant?: "card" | "embedded";
  fieldIdPrefix?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function EditProductForm({
  productId,
  variant = "card",
  fieldIdPrefix = "edit-product",
  onSuccess,
  onCancel,
}: EditProductFormProps) {
  const router = useRouter();
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormInput>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: createProductDefaultValues,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setIsLoadingProduct(true);
      setNotFound(false);

      try {
        const product = await productService.getById(productId);

        if (!cancelled) {
          reset(mapApiProductToFormInput(product));
        }
      } catch (error) {
        if (!cancelled) {
          if (isApiError(error) && error.statusCode === 404) {
            setNotFound(true);
          } else {
            setSubmitError(
              isApiError(error)
                ? error.message
                : "Unable to load product. Please try again.",
            );
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProduct(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, reset]);

  async function onSubmit(data: CreateProductFormInput) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const { message } = await productService.update(
        productId,
        buildCreateProductPayload(data),
      );

      toast.success("Product updated", { description: message });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/products");
      }
    } catch (error) {
      setSubmitError(
        isApiError(error)
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingProduct) {
    if (variant === "embedded") {
      return <LoadingState title="Loading product" variant="skeleton" />;
    }

    return <LoadingState title="Loading product details" variant="skeleton" />;
  }

  if (notFound) {
    if (variant === "embedded") {
      return (
        <div className="space-y-4 py-2 text-center">
          <p className="font-medium text-foreground">Product not found</p>
          <p className="text-sm text-muted-foreground">
            This product may have been deleted or the link is invalid.
          </p>
          {onCancel ? (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Close
            </Button>
          ) : null}
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-medium text-foreground">Product not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This product may have been deleted or the link is invalid.
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
    <ProductFormFields
      title="Update product"
      description="Update name, SKU, selling price, and stock for this product."
      isSubmitting={isSubmitting}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      register={register}
      errors={errors}
      submitError={submitError}
      onSubmit={handleSubmit(onSubmit)}
      variant={variant}
      fieldIdPrefix={fieldIdPrefix}
      onCancel={onCancel}
    />
  );
}

export function ProductForm({ mode, productId }: ProductFormProps) {
  if (mode === "create") {
    return <CreateProductForm />;
  }

  if (!productId) {
    return null;
  }

  return <EditProductForm productId={productId} />;
}
