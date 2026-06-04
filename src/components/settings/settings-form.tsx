"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Receipt,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FormMessage } from "@/components/auth/form-message";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/layout/loading-state";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import { getSettings, saveSettings } from "@/lib/settings/mock-store";
import {
  settingsFormSchema,
  type SettingsFormInput,
} from "@/lib/validations/settings";

const LOAD_DELAY_MS = 500;
const SAVE_DELAY_MS = 800;

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "INR", "AUD", "CAD"];

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormInput>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: DEFAULT_SETTINGS,
  });

  const currency = watch("default_currency");

  useEffect(() => {
    const timer = setTimeout(() => {
      reset(getSettings());
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [reset]);

  async function onSubmit(data: SettingsFormInput) {
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, SAVE_DELAY_MS));
      saveSettings({
        ...data,
        gst_number: data.gst_number?.toUpperCase() ?? "",
        company_website: data.company_website.trim(),
      });
      setSaveSuccess(true);
    } catch {
      setSaveError("Unable to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <LoadingState title="Loading settings" variant="skeleton" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {saveError ? (
        <FormMessage type="error" title="Save failed" message={saveError} />
      ) : null}
      {saveSuccess ? (
        <FormMessage
          type="success"
          title="Settings saved"
          message="Your preferences have been updated. API sync will apply when connected."
        />
      ) : null}

      <div className="rounded-2xl border bg-primary/5 p-5 text-sm leading-6 text-muted-foreground">
        <p className="font-medium text-foreground">Beginner tip</p>
        <p className="mt-1">
          Fill in company and tax details first. Busilogix will reuse these
          defaults when creating invoices, so you do not have to enter them
          again later.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" aria-hidden />
            </span>
            <div>
              <CardTitle>Company information</CardTitle>
              <CardDescription>
                Your business identity on invoices and communications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup>
            <Field data-invalid={!!errors.company_name || undefined}>
              <FieldLabel htmlFor="company_name">Company name</FieldLabel>
              <Input
                id="company_name"
                disabled={isSaving}
                {...register("company_name")}
              />
              <FieldError errors={[errors.company_name]} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.company_email || undefined}>
                <FieldLabel htmlFor="company_email">Company email</FieldLabel>
                <Input
                  id="company_email"
                  type="email"
                  disabled={isSaving}
                  {...register("company_email")}
                />
                <FieldError errors={[errors.company_email]} />
              </Field>
              <Field data-invalid={!!errors.company_phone || undefined}>
                <FieldLabel htmlFor="company_phone">Company phone</FieldLabel>
                <Input
                  id="company_phone"
                  type="tel"
                  disabled={isSaving}
                  {...register("company_phone")}
                />
                <FieldError errors={[errors.company_phone]} />
              </Field>
            </div>
            <Field data-invalid={!!errors.company_website || undefined}>
              <FieldLabel htmlFor="company_website">Website</FieldLabel>
              <Input
                id="company_website"
                placeholder="https://yourcompany.com"
                disabled={isSaving}
                {...register("company_website")}
              />
              <FieldError errors={[errors.company_website]} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-4" aria-hidden />
            </span>
            <div>
              <CardTitle>Business address</CardTitle>
              <CardDescription>
                Address shown on invoices and official documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup>
            <Field data-invalid={!!errors.address_line1 || undefined}>
              <FieldLabel htmlFor="address_line1">Address line 1</FieldLabel>
              <Input
                id="address_line1"
                disabled={isSaving}
                {...register("address_line1")}
              />
              <FieldError errors={[errors.address_line1]} />
            </Field>
            <Field data-invalid={!!errors.address_line2 || undefined}>
              <FieldLabel htmlFor="address_line2">Address line 2</FieldLabel>
              <Input
                id="address_line2"
                placeholder="Suite, floor, etc. (optional)"
                disabled={isSaving}
                {...register("address_line2")}
              />
              <FieldError errors={[errors.address_line2]} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.city || undefined}>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" disabled={isSaving} {...register("city")} />
                <FieldError errors={[errors.city]} />
              </Field>
              <Field data-invalid={!!errors.state || undefined}>
                <FieldLabel htmlFor="state">State / Province</FieldLabel>
                <Input id="state" disabled={isSaving} {...register("state")} />
                <FieldError errors={[errors.state]} />
              </Field>
              <Field data-invalid={!!errors.postal_code || undefined}>
                <FieldLabel htmlFor="postal_code">Postal code</FieldLabel>
                <Input
                  id="postal_code"
                  disabled={isSaving}
                  {...register("postal_code")}
                />
                <FieldError errors={[errors.postal_code]} />
              </Field>
              <Field data-invalid={!!errors.country || undefined}>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input
                  id="country"
                  disabled={isSaving}
                  {...register("country")}
                />
                <FieldError errors={[errors.country]} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="size-4" aria-hidden />
            </span>
            <div>
              <CardTitle>GST information</CardTitle>
              <CardDescription>
                Tax registration details for compliant invoicing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup>
            <Field data-invalid={!!errors.legal_business_name || undefined}>
              <FieldLabel htmlFor="legal_business_name">
                Legal business name
              </FieldLabel>
              <Input
                id="legal_business_name"
                disabled={isSaving}
                {...register("legal_business_name")}
              />
              <FieldError errors={[errors.legal_business_name]} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.gst_number || undefined}>
                <FieldLabel htmlFor="gst_number">GST number</FieldLabel>
                <Input
                  id="gst_number"
                  placeholder="27AABCU9603R1ZM"
                  className="font-mono uppercase"
                  disabled={isSaving}
                  {...register("gst_number")}
                />
                <FieldError errors={[errors.gst_number]} />
              </Field>
              <Field data-invalid={!!errors.pan_number || undefined}>
                <FieldLabel htmlFor="pan_number">PAN number</FieldLabel>
                <Input
                  id="pan_number"
                  placeholder="AABCU9603R"
                  className="font-mono uppercase"
                  disabled={isSaving}
                  {...register("pan_number")}
                />
                <FieldError errors={[errors.pan_number]} />
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
              <CardTitle>Invoice preferences</CardTitle>
              <CardDescription>
                Defaults applied when creating new invoices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.default_currency || undefined}>
                <FieldLabel>Default currency</FieldLabel>
                <Select
                  value={currency}
                  onValueChange={(value) =>
                    setValue("default_currency", value ?? "USD")
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.default_currency]} />
              </Field>
              <Field data-invalid={!!errors.invoice_prefix || undefined}>
                <FieldLabel htmlFor="invoice_prefix">Invoice prefix</FieldLabel>
                <Input
                  id="invoice_prefix"
                  placeholder="INV"
                  className="font-mono uppercase"
                  disabled={isSaving}
                  {...register("invoice_prefix")}
                />
                <FieldError errors={[errors.invoice_prefix]} />
              </Field>
              <Field
                data-invalid={!!errors.default_payment_terms_days || undefined}
              >
                <FieldLabel htmlFor="default_payment_terms_days">
                  Payment terms (days)
                </FieldLabel>
                <Input
                  id="default_payment_terms_days"
                  type="number"
                  min={1}
                  max={365}
                  disabled={isSaving}
                  {...register("default_payment_terms_days", {
                    valueAsNumber: true,
                  })}
                />
                <FieldError errors={[errors.default_payment_terms_days]} />
              </Field>
              <Field
                data-invalid={!!errors.default_tax_percentage || undefined}
              >
                <FieldLabel htmlFor="default_tax_percentage">
                  Default tax (%)
                </FieldLabel>
                <Input
                  id="default_tax_percentage"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  disabled={isSaving}
                  {...register("default_tax_percentage", {
                    valueAsNumber: true,
                  })}
                />
                <FieldError errors={[errors.default_tax_percentage]} />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-4" aria-hidden />
            </span>
            <div>
              <CardTitle>Email preferences</CardTitle>
              <CardDescription>
                How invoices appear when sent to customers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.email_from_name || undefined}>
                <FieldLabel htmlFor="email_from_name">From name</FieldLabel>
                <Input
                  id="email_from_name"
                  disabled={isSaving}
                  {...register("email_from_name")}
                />
                <FieldError errors={[errors.email_from_name]} />
              </Field>
              <Field data-invalid={!!errors.email_reply_to || undefined}>
                <FieldLabel htmlFor="email_reply_to">Reply-to email</FieldLabel>
                <Input
                  id="email_reply_to"
                  type="email"
                  disabled={isSaving}
                  {...register("email_reply_to")}
                />
                <FieldError errors={[errors.email_reply_to]} />
              </Field>
            </div>
            <Field data-invalid={!!errors.email_signature || undefined}>
              <FieldLabel htmlFor="email_signature">Email signature</FieldLabel>
              <Textarea
                id="email_signature"
                rows={4}
                placeholder="Closing message for invoice emails..."
                disabled={isSaving}
                {...register("email_signature")}
              />
              <FieldError errors={[errors.email_signature]} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Saving...
            </>
          ) : (
            "Save settings"
          )}
        </Button>
      </div>
    </form>
  );
}
