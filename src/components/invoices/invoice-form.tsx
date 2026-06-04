"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, FileText, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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
import { Separator } from "@/components/ui/separator";
import { calculateInvoiceTotals } from "@/lib/invoices/calculations";
import {
  createInvoiceFromForm,
  getInvoiceById,
  suggestInvoiceNumber,
  updateInvoiceFromForm,
} from "@/lib/invoices/mock-store";
import type { InvoiceDetailRecord } from "@/lib/invoices/types";
import {
  createDefaultInvoiceFormValues,
  invoiceFormSchema,
  type InvoiceFormInput,
} from "@/lib/validations/invoice";

import { InvoiceFormSummary } from "./invoice-form-summary";
import { InvoiceLineItems } from "./invoice-line-items";

const SUBMIT_DELAY_MS = 900;

type InvoiceFormProps = {
  mode?: "create" | "edit";
  invoiceId?: string;
};

function mapInvoiceToForm(invoice: InvoiceDetailRecord): InvoiceFormInput {
  return {
    customer_name: invoice.customer_name,
    customer_email: invoice.customer_email,
    customer_phone: invoice.customer_phone,
    invoice_number: invoice.invoice_number,
    issue_date: invoice.issue_date,
    due_date: invoice.due_date,
    line_items: invoice.line_items.map((item) => ({
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_percentage: item.tax_percentage,
    })),
  };
}

export function InvoiceForm({ mode = "create", invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: createDefaultInvoiceFormValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "line_items",
  });

  const watchedLineItems = watch("line_items");

  useEffect(() => {
    if (mode === "create") {
      setValue("invoice_number", suggestInvoiceNumber());
      return;
    }

    if (!invoiceId) {
      return;
    }

    setIsLoadingInvoice(true);
    setNotFound(false);

    const invoice = getInvoiceById(invoiceId);

    if (!invoice) {
      setNotFound(true);
      setIsLoadingInvoice(false);
      return;
    }

    reset(mapInvoiceToForm(invoice));
    setIsLoadingInvoice(false);
  }, [invoiceId, mode, reset, setValue]);

  const totals = useMemo(
    () =>
      calculateInvoiceTotals(
        (watchedLineItems ?? []).map((item) => ({
          quantity: Number(item?.quantity) || 0,
          unit_price: Number(item?.unit_price) || 0,
          tax_percentage: Number(item?.tax_percentage) || 0,
        })),
      ),
    [watchedLineItems],
  );

  async function onSubmit(data: InvoiceFormInput) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));

      if (mode === "edit" && invoiceId) {
        const updated = updateInvoiceFromForm(invoiceId, data);

        if (!updated) {
          setSubmitError("Invoice not found. It may have been removed.");
          return;
        }

        router.push(`/invoices/${invoiceId}`);
        return;
      }

      createInvoiceFromForm(data);
      router.push("/invoices");
    } catch {
      setSubmitError("Unable to save the invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingInvoice) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading invoice details...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p className="font-medium">Invoice not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This invoice may have been deleted or the link is invalid.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          render={<Link href="/invoices" />}
        >
          Back to invoices
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {submitError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {submitError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-7 lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle>Customer information</CardTitle>
                  <CardDescription>
                    Bill-to contact details for this invoice
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-7">
              <FieldGroup>
                <Field data-invalid={!!errors.customer_name || undefined}>
                  <FieldLabel htmlFor="customer_name">Customer name</FieldLabel>
                  <FieldDescription>
                    This appears in the bill-to section of the invoice.
                  </FieldDescription>
                  <Input
                    id="customer_name"
                    placeholder="Acme Corporation"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.customer_name}
                    {...register("customer_name")}
                  />
                  <FieldError errors={[errors.customer_name]} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={!!errors.customer_email || undefined}>
                    <FieldLabel htmlFor="customer_email">
                      Customer email
                    </FieldLabel>
                    <FieldDescription>
                      Used when you send the invoice by email.
                    </FieldDescription>
                    <Input
                      id="customer_email"
                      type="email"
                      placeholder="billing@company.com"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.customer_email}
                      {...register("customer_email")}
                    />
                    <FieldError errors={[errors.customer_email]} />
                  </Field>

                  <Field data-invalid={!!errors.customer_phone || undefined}>
                    <FieldLabel htmlFor="customer_phone">
                      Customer phone
                    </FieldLabel>
                    <FieldDescription>
                      Add a reachable billing contact number.
                    </FieldDescription>
                    <Input
                      id="customer_phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.customer_phone}
                      {...register("customer_phone")}
                    />
                    <FieldError errors={[errors.customer_phone]} />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle>Invoice information</CardTitle>
                  <CardDescription>
                    Numbering and billing period for this invoice
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-7">
              <FieldGroup>
                <Field data-invalid={!!errors.invoice_number || undefined}>
                  <FieldLabel htmlFor="invoice_number">
                    Invoice number
                  </FieldLabel>
                  <FieldDescription>
                    Auto-filled for convenience. You can edit it if needed.
                  </FieldDescription>
                  <Input
                    id="invoice_number"
                    placeholder="INV-2026-001"
                    disabled={isSubmitting}
                    className="font-mono"
                    aria-invalid={!!errors.invoice_number}
                    {...register("invoice_number")}
                  />
                  <FieldError errors={[errors.invoice_number]} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={!!errors.issue_date || undefined}>
                    <FieldLabel htmlFor="issue_date">Issue date</FieldLabel>
                    <FieldDescription>
                      The date the invoice is created.
                    </FieldDescription>
                    <Input
                      id="issue_date"
                      type="date"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.issue_date}
                      {...register("issue_date")}
                    />
                    <FieldError errors={[errors.issue_date]} />
                  </Field>

                  <Field data-invalid={!!errors.due_date || undefined}>
                    <FieldLabel htmlFor="due_date">Due date</FieldLabel>
                    <FieldDescription>
                      Payment deadline shown to the customer.
                    </FieldDescription>
                    <Input
                      id="due_date"
                      type="date"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.due_date}
                      {...register("due_date")}
                    />
                    <FieldError errors={[errors.due_date]} />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Line items</CardTitle>
              <CardDescription>
                Add products or services — totals update automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-7">
              <div className="mb-5 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                Add each product or service as a separate row. Busilogix
                calculates subtotal, tax, and grand total automatically.
              </div>
              <InvoiceLineItems
                fields={fields}
                append={append}
                remove={remove}
                register={register}
                errors={errors}
                watchedLineItems={watchedLineItems}
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="border-b">
              <CardTitle>Invoice summary</CardTitle>
              <CardDescription>Live preview of amounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-7">
              <InvoiceFormSummary totals={totals} />

              <Separator />

              <p className="text-sm leading-6 text-muted-foreground">
                Save as draft first. You can review, send, or download the
                invoice after it appears in the invoice list.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden />
                      Saving invoice...
                    </>
                  ) : mode === "edit" ? (
                    "Save changes"
                  ) : (
                    "Save as draft"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                  render={<Link href="/invoices" />}
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
