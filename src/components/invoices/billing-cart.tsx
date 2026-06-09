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
      <div className="hidden sm:block overflow-hidden rounded-xl border">
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

      <div className="block sm:hidden space-y-3">
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
            <div
              key={field.id}
              className={cn(
                "rounded-xl border p-3.5 space-y-3 transition-colors bg-card",
                highlightedIndex === index && "bg-emerald-500/10 border-emerald-500/30",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-foreground text-sm leading-snug truncate">
                    {selectedProduct?.name ?? "Product"}
                  </h4>
                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                      {selectedProduct?.sku || "SKU"}
                    </span>
                    <span>·</span>
                    <span>{formatCurrency(unitPrice, "INR")}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 text-muted-foreground hover:text-destructive shrink-0"
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
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  {exceedsStock && (
                    <span className="text-xs font-medium text-amber-600 animate-pulse mb-0.5">
                      low stock ({stock})
                    </span>
                  )}
                  <div className="inline-flex items-center gap-1 rounded-lg border bg-background p-0.5 w-fit">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-8"
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
                    <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-8"
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
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">Total</span>
                  <span className="text-base font-bold tabular-nums text-primary">
                    {formatCurrency(lineTotal, "INR")}
                  </span>
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
    </div>
  );
}
