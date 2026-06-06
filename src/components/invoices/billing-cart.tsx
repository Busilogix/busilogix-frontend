"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormSetValue,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { ApiProduct } from "@/lib/api/types/product.types";
import { getApiProductStock } from "@/lib/products/map-api-product";
import { formatCurrency } from "@/lib/invoices/format";
import { roundCurrency } from "@/lib/invoices/calculations";
import type { CreateInvoiceFormInput } from "@/lib/validations/invoice";
import { cn } from "@/lib/utils";

type BillingCartProps = {
  fields: UseFieldArrayReturn<CreateInvoiceFormInput, "items">["fields"];
  remove: UseFieldArrayReturn<CreateInvoiceFormInput, "items">["remove"];
  setValue: UseFormSetValue<CreateInvoiceFormInput>;
  errors: FieldErrors<CreateInvoiceFormInput>;
  watchedItems: CreateInvoiceFormInput["items"];
  products: ApiProduct[];
  disabled?: boolean;
  highlightedIndex?: number | null;
};

function getProductUnitPrice(
  productId: string,
  products: ApiProduct[],
): number {
  return (
    products.find((product) => product.id === productId)?.sellingPrice ?? 0
  );
}

export function BillingCart({
  fields,
  remove,
  setValue,
  errors,
  watchedItems,
  products,
  disabled = false,
  highlightedIndex = null,
}: BillingCartProps) {
  const filledRows = fields
    .map((field, index) => ({ field, index }))
    .filter(({ index }) => Boolean(watchedItems[index]?.productId));

  const itemsError = errors.items?.message ?? errors.items?.root?.message;

  if (filledRows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">Cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap a product chip or scan SKU above.
        </p>
        {itemsError ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {itemsError}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Product</th>
              <th className="px-3 py-2.5 font-semibold">Qty</th>
              <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
              <th className="px-2 py-2.5">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filledRows.map(({ field, index }) => {
              const item = watchedItems[index];
              const unitPrice = getProductUnitPrice(
                item?.productId ?? "",
                products,
              );
              const quantity = Number(item?.quantity) || 0;
              const lineTotal = roundCurrency(quantity * unitPrice);
              const selectedProduct = products.find(
                (product) => product.id === item?.productId,
              );
              const stock = selectedProduct
                ? getApiProductStock(selectedProduct)
                : 0;
              const exceedsStock =
                selectedProduct && quantity > 0 && quantity > stock;

              return (
                <tr
                  key={field.id}
                  className={cn(
                    "border-t align-middle transition-colors",
                    highlightedIndex === index && "bg-emerald-500/10",
                  )}
                >
                  <td className="px-3 py-2.5">
                    <p className="font-medium leading-snug">
                      {selectedProduct?.name ?? "Product"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedProduct?.sku}
                      {exceedsStock ? (
                        <span className="text-amber-600">
                          {" "}
                          · low stock ({stock})
                        </span>
                      ) : (
                        <span> · {formatCurrency(unitPrice, "INR")}</span>
                      )}
                    </p>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="inline-flex items-center gap-1 rounded-lg border bg-background p-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-9"
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
                        <Minus className="size-4" aria-hidden />
                      </Button>
                      <span className="min-w-8 text-center text-base font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-9"
                        disabled={disabled}
                        aria-label={`Increase quantity for item ${index + 1}`}
                        onClick={() =>
                          setValue(`items.${index}.quantity`, quantity + 1, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <Plus className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-base font-semibold tabular-nums text-primary">
                    {formatCurrency(lineTotal, "INR")}
                  </td>
                  <td className="px-2 py-2.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-9"
                      onClick={() => {
                        if (fields.length <= 1) {
                          setValue(`items.${index}.productId`, "", {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.quantity`, 1, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          return;
                        }

                        remove(index);
                      }}
                      disabled={disabled}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {itemsError ? (
        <p role="alert" className="text-sm text-destructive">
          {itemsError}
        </p>
      ) : null}
    </div>
  );
}
