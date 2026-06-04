"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { calculateLineTotal } from "@/lib/invoices/calculations";
import { formatCurrency } from "@/lib/invoices/format";
import type { InvoiceFormInput } from "@/lib/validations/invoice";

type InvoiceLineItemsProps = {
  fields: UseFieldArrayReturn<InvoiceFormInput, "line_items">["fields"];
  append: UseFieldArrayReturn<InvoiceFormInput, "line_items">["append"];
  remove: UseFieldArrayReturn<InvoiceFormInput, "line_items">["remove"];
  register: UseFormRegister<InvoiceFormInput>;
  errors: FieldErrors<InvoiceFormInput>;
  watchedLineItems: InvoiceFormInput["line_items"];
  disabled?: boolean;
};

export function InvoiceLineItems({
  fields,
  append,
  remove,
  register,
  errors,
  watchedLineItems,
  disabled = false,
}: InvoiceLineItemsProps) {
  const lineItemsError =
    errors.line_items?.message ?? errors.line_items?.root?.message;

  return (
    <div className="space-y-4">
      <div className="hidden gap-3 rounded-xl bg-muted/40 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:grid md:grid-cols-[1fr_80px_110px_90px_110px_40px]">
        <span>Item name</span>
        <span>Qty</span>
        <span>Unit price</span>
        <span>Tax %</span>
        <span className="text-right">Total</span>
        <span className="sr-only">Remove</span>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const item = watchedLineItems[index];
          const lineTotal = calculateLineTotal({
            quantity: Number(item?.quantity) || 0,
            unit_price: Number(item?.unit_price) || 0,
            tax_percentage: Number(item?.tax_percentage) || 0,
          });
          const rowErrors = errors.line_items?.[index];

          return (
            <div
              key={field.id}
              className="rounded-xl border bg-background/80 p-4 shadow-sm shadow-slate-950/5 md:p-4"
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

              <div className="grid gap-4 md:grid-cols-[1fr_80px_110px_90px_110px_40px] md:items-start md:gap-3">
                <Field data-invalid={!!rowErrors?.item_name || undefined}>
                  <FieldLabel
                    htmlFor={`line_items.${index}.item_name`}
                    className="md:sr-only"
                  >
                    Item name
                  </FieldLabel>
                  <Input
                    id={`line_items.${index}.item_name`}
                    placeholder="Service or product"
                    disabled={disabled}
                    aria-invalid={!!rowErrors?.item_name}
                    {...register(`line_items.${index}.item_name`)}
                  />
                  <FieldError errors={[rowErrors?.item_name]} />
                </Field>

                <Field data-invalid={!!rowErrors?.quantity || undefined}>
                  <FieldLabel
                    htmlFor={`line_items.${index}.quantity`}
                    className="md:sr-only"
                  >
                    Quantity
                  </FieldLabel>
                  <Input
                    id={`line_items.${index}.quantity`}
                    type="number"
                    min={1}
                    step={1}
                    disabled={disabled}
                    aria-invalid={!!rowErrors?.quantity}
                    {...register(`line_items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError errors={[rowErrors?.quantity]} />
                </Field>

                <Field data-invalid={!!rowErrors?.unit_price || undefined}>
                  <FieldLabel
                    htmlFor={`line_items.${index}.unit_price`}
                    className="md:sr-only"
                  >
                    Unit price
                  </FieldLabel>
                  <Input
                    id={`line_items.${index}.unit_price`}
                    type="number"
                    min={0}
                    step={0.01}
                    disabled={disabled}
                    aria-invalid={!!rowErrors?.unit_price}
                    {...register(`line_items.${index}.unit_price`, {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError errors={[rowErrors?.unit_price]} />
                </Field>

                <Field data-invalid={!!rowErrors?.tax_percentage || undefined}>
                  <FieldLabel
                    htmlFor={`line_items.${index}.tax_percentage`}
                    className="md:sr-only"
                  >
                    Tax %
                  </FieldLabel>
                  <Input
                    id={`line_items.${index}.tax_percentage`}
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    disabled={disabled}
                    aria-invalid={!!rowErrors?.tax_percentage}
                    {...register(`line_items.${index}.tax_percentage`, {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError errors={[rowErrors?.tax_percentage]} />
                </Field>

                <div className="flex flex-col gap-1 md:items-end md:pt-2">
                  <span className="text-xs text-muted-foreground md:sr-only">
                    Total
                  </span>
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-primary">
                    {formatCurrency(lineTotal)}
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

      {lineItemsError ? (
        <p role="alert" className="text-sm text-destructive">
          {lineItemsError}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            item_name: "",
            quantity: 1,
            unit_price: 0,
            tax_percentage: 0,
          })
        }
        disabled={disabled}
      >
        <Plus className="size-4" aria-hidden />
        Add item
      </Button>
    </div>
  );
}
