"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProductPicker } from "@/components/invoices/product-picker";
import type { ApiProduct } from "@/lib/api/types/product.types";
import { getApiProductStock } from "@/lib/products/map-api-product";
import { formatCurrency } from "@/lib/invoices/format";
import { roundCurrency } from "@/lib/invoices/calculations";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";

type CreateInvoiceLineItemsProps = {
  fields: UseFieldArrayReturn<CreateInvoiceFormInput, "items">["fields"];
  append: UseFieldArrayReturn<CreateInvoiceFormInput, "items">["append"];
  remove: UseFieldArrayReturn<CreateInvoiceFormInput, "items">["remove"];
  register: UseFormRegister<CreateInvoiceFormInput>;
  control: Control<CreateInvoiceFormInput>;
  setValue: UseFormSetValue<CreateInvoiceFormInput>;
  errors: FieldErrors<CreateInvoiceFormInput>;
  watchedItems: CreateInvoiceFormInput["items"];
  products: ApiProduct[];
  disabled?: boolean;
};

function getProductUnitPrice(
  productId: string,
  products: ApiProduct[],
): number {
  return (
    products.find((product) => product.id === productId)?.sellingPrice ?? 0
  );
}

export function CreateInvoiceLineItems({
  fields,
  append,
  remove,
  register,
  control,
  setValue,
  errors,
  watchedItems,
  products,
  disabled = false,
}: CreateInvoiceLineItemsProps) {
  const itemsError = errors.items?.message ?? errors.items?.root?.message;

  return (
    <div className="space-y-4">
      <div className="hidden gap-3 rounded-xl bg-muted/40 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:grid md:grid-cols-[1fr_120px_110px_110px_40px]">
        <span>Product</span>
        <span>Qty</span>
        <span>Unit price</span>
        <span className="text-right">Line total</span>
        <span className="sr-only">Remove</span>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const item = watchedItems[index];
          const unitPrice = getProductUnitPrice(
            item?.productId ?? "",
            products,
          );
          const quantity = Number(item?.quantity) || 0;
          const lineTotal = roundCurrency(quantity * unitPrice);
          const rowErrors = errors.items?.[index];
          const selectedProduct = products.find(
            (product) => product.id === item?.productId,
          );
          const stock = selectedProduct
            ? getApiProductStock(selectedProduct)
            : 0;
          const exceedsStock =
            selectedProduct && quantity > 0 && quantity > stock;

          return (
            <div
              key={field.id}
              className="rounded-xl border bg-background/80 p-4 shadow-sm shadow-slate-950/5"
            >
              <div className="mb-3 flex items-center justify-between md:hidden">
                <span className="text-sm font-medium">Item {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  disabled={disabled || fields.length <= 1}
                  aria-label={`Remove item ${index + 1}`}
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_120px_110px_110px_40px] md:items-start md:gap-3">
                <Field data-invalid={!!rowErrors?.productId || undefined}>
                  <FieldLabel className="md:sr-only">Product</FieldLabel>
                  <Controller
                    control={control}
                    name={`items.${index}.productId`}
                    render={({ field: productField }) => (
                      <ProductPicker
                        value={productField.value}
                        onChange={productField.onChange}
                        products={products}
                        disabled={disabled}
                        invalid={!!rowErrors?.productId}
                      />
                    )}
                  />
                  {selectedProduct ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stock} in stock · {formatCurrency(unitPrice, "INR")} each
                    </p>
                  ) : null}
                  {exceedsStock ? (
                    <p className="mt-1 text-xs text-amber-600">
                      Quantity exceeds available stock ({stock})
                    </p>
                  ) : null}
                  <FieldError errors={[rowErrors?.productId]} />
                </Field>

                <Field data-invalid={!!rowErrors?.quantity || undefined}>
                  <FieldLabel
                    htmlFor={`items.${index}.quantity`}
                    className="md:sr-only"
                  >
                    Quantity
                  </FieldLabel>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={disabled || quantity <= 1}
                      aria-label={`Decrease quantity for item ${index + 1}`}
                      onClick={() =>
                        setValue(
                          `items.${index}.quantity`,
                          Math.max(1, quantity - 1),
                          { shouldDirty: true, shouldValidate: true },
                        )
                      }
                    >
                      <Minus className="size-3.5" aria-hidden />
                    </Button>
                    <Input
                      id={`items.${index}.quantity`}
                      type="number"
                      min={1}
                      step={1}
                      disabled={disabled}
                      className="h-9 text-center tabular-nums"
                      aria-invalid={!!rowErrors?.quantity}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={disabled}
                      aria-label={`Increase quantity for item ${index + 1}`}
                      onClick={() =>
                        setValue(`items.${index}.quantity`, quantity + 1, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      <Plus className="size-3.5" aria-hidden />
                    </Button>
                  </div>
                  <FieldError errors={[rowErrors?.quantity]} />
                </Field>

                <div className="flex flex-col gap-1 md:pt-2">
                  <span className="text-xs text-muted-foreground md:sr-only">
                    Unit price
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(unitPrice, "INR")}
                  </span>
                </div>

                <div className="flex flex-col gap-1 md:items-end md:pt-2">
                  <span className="text-xs text-muted-foreground md:sr-only">
                    Line total
                  </span>
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-primary">
                    {formatCurrency(lineTotal, "INR")}
                  </span>
                </div>

                <div className="hidden md:flex md:justify-center md:pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    disabled={disabled || fields.length <= 1}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {itemsError ? (
        <p role="alert" className="text-sm text-destructive">
          {itemsError}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ productId: "", quantity: 1 })}
        disabled={disabled}
      >
        <Plus className="size-4" aria-hidden />
        Add item
      </Button>
    </div>
  );
}
