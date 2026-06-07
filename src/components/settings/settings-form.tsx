"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CreditCard, Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import type { ZodIssue } from "zod";

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
import { LogoUploader } from "@/components/ui/logo-uploader";
import { PhoneInput } from "@/components/ui/phone-input";
import { isApiError } from "@/lib/api/errors";
import { storeService } from "@/lib/api/store.service";
import {
  buildPaymentInfoPayload,
  buildStoreProfilePayload,
} from "@/lib/settings/build-store-payload";
import { EMPTY_SETTINGS } from "@/lib/settings/defaults";
import { mapApiStoreToFormInput } from "@/lib/settings/map-api-store";
import { dispatchStoreUpdated } from "@/lib/settings/store-events";
import { formatMobileNumber } from "@/lib/utils";
import {
  PAYMENT_FIELD_NAMES,
  paymentFormSchema,
  PROFILE_FIELD_NAMES,
  profileFormSchema,
  settingsFormSchema,
  type SettingsFormInput,
} from "@/lib/validations/settings";

import { SettingsFormSkeleton } from "./settings-form-skeleton";

type SettingsSectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

function applyZodErrors(
  setError: UseFormSetError<SettingsFormInput>,
  issues: ZodIssue[],
) {
  for (const issue of issues) {
    const field = issue.path[0];

    if (typeof field === "string") {
      setError(field as keyof SettingsFormInput, { message: issue.message });
    }
  }
}

function SettingsSection({
  icon,
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card
      className={className ?? "surface-card flex h-full flex-col rounded-xl"}
    >
      <CardHeader className="border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
            {icon}
          </span>
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4 pt-5 sm:p-5">
        {children}
      </CardContent>
    </Card>
  );
}

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [hasStore, setHasStore] = useState(false);

  const {
    register,
    reset,
    getValues,
    setValue,
    watch,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SettingsFormInput>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: EMPTY_SETTINGS,
  });

  const logoUrl = watch("logo_url");

  const isSaving = isSavingProfile || isSavingPayment;

  const loadStore = useCallback(
    async (options: { silent?: boolean } = {}) => {
      try {
        const store = await storeService.getMe();
        setHasStore(true);
        reset(mapApiStoreToFormInput(store));
        return;
      } catch (error) {
        if (isApiError(error) && error.statusCode === 404) {
          setHasStore(false);
          reset(EMPTY_SETTINGS);
          return;
        }

        if (!options.silent) {
          toast.error("Failed to load settings", {
            description: isApiError(error)
              ? error.message
              : "Unable to load store settings. Please try again.",
          });
        }

        setHasStore(false);
        reset(EMPTY_SETTINGS);
      }
    },
    [reset],
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadStore();

      if (!cancelled) {
        setIsLoading(false);
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [loadStore]);

  async function saveProfile() {
    clearErrors(PROFILE_FIELD_NAMES);

    const values = getValues();
    const result = profileFormSchema.safeParse({
      ...values,
      company_phone: formatMobileNumber(values.company_phone),
      gst_number: values.gst_number.trim().toUpperCase(),
      logo_url: values.logo_url.trim(),
    });

    if (!result.success) {
      applyZodErrors(setError, result.error.issues);
      return;
    }

    setIsSavingProfile(true);

    try {
      const payload = buildStoreProfilePayload(result.data);

      if (hasStore) {
        const { message } = await storeService.update(payload);
        await loadStore({ silent: true });
        dispatchStoreUpdated();
        toast.success("Store updated", { description: message });
        return;
      }

      const { message } = await storeService.create(payload);
      await loadStore({ silent: true });
      dispatchStoreUpdated();
      toast.success("Store created", { description: message });
    } catch (error) {
      toast.error("Save failed", {
        description: isApiError(error)
          ? error.message
          : "Unable to save store profile. Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function savePayment() {
    if (!hasStore) {
      toast.error("Store profile required", {
        description:
          "Save your company and address details before payment info.",
      });
      return;
    }

    clearErrors(PAYMENT_FIELD_NAMES);

    const values = getValues();
    const result = paymentFormSchema.safeParse({
      upi_id: values.upi_id,
      bank_name: values.bank_name,
      account_name: values.account_name,
      account_number: values.account_number,
      ifsc_code: values.ifsc_code.trim().toUpperCase(),
    });

    if (!result.success) {
      applyZodErrors(setError, result.error.issues);
      return;
    }

    setIsSavingPayment(true);

    try {
      const { message } = await storeService.updatePaymentInfo(
        buildPaymentInfoPayload(result.data),
      );

      await loadStore({ silent: true });
      dispatchStoreUpdated();
      toast.success("Payment info saved", { description: message });
    } catch (error) {
      toast.error("Save failed", {
        description: isApiError(error)
          ? error.message
          : "Unable to save payment information. Please try again.",
      });
    } finally {
      setIsSavingPayment(false);
    }
  }

  if (isLoading) {
    return <SettingsFormSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <SettingsSection
            icon={<Building2 className="size-4" aria-hidden />}
            title="Company information"
            description="Business identity and tax registration for invoices"
          >
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
                <Field data-invalid={!!errors.logo_url || undefined}>
                  <FieldLabel>Logo</FieldLabel>
                  <LogoUploader
                    value={logoUrl}
                    onChange={(url) => setValue("logo_url", url, { shouldValidate: true })}
                    disabled={isSaving}
                    compact
                  />
                  <FieldError errors={[errors.logo_url]} />
                </Field>

                <Field data-invalid={!!errors.company_name || undefined}>
                  <FieldLabel htmlFor="company_name">Company name</FieldLabel>
                  <Input
                    id="company_name"
                    disabled={isSaving}
                    {...register("company_name")}
                  />
                  <FieldError errors={[errors.company_name]} />
                </Field>
              </div>

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
                  <Controller
                    control={control}
                    name="company_phone"
                    render={({ field }) => (
                      <PhoneInput
                        id="company_phone"
                        disabled={isSaving}
                        placeholder="98765 43210"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <FieldError errors={[errors.company_phone]} />
                </Field>
              </div>

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
            </FieldGroup>
          </SettingsSection>

          <SettingsSection
            icon={<MapPin className="size-4" aria-hidden />}
            title="Business address"
            description="Address shown on invoices and official documents"
          >
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
              <div className="grid gap-5 sm:grid-cols-3">
                <Field data-invalid={!!errors.city || undefined}>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input id="city" disabled={isSaving} {...register("city")} />
                  <FieldError errors={[errors.city]} />
                </Field>
                <Field data-invalid={!!errors.state || undefined}>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input
                    id="state"
                    disabled={isSaving}
                    {...register("state")}
                  />
                  <FieldError errors={[errors.state]} />
                </Field>
                <Field data-invalid={!!errors.postal_code || undefined}>
                  <FieldLabel htmlFor="postal_code">Pincode</FieldLabel>
                  <Input
                    id="postal_code"
                    disabled={isSaving}
                    {...register("postal_code")}
                  />
                  <FieldError errors={[errors.postal_code]} />
                </Field>
              </div>
            </FieldGroup>
          </SettingsSection>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isSaving}
            className="shadow-sm"
            onClick={() => void saveProfile()}
          >
            {isSavingProfile ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Saving...
              </>
            ) : hasStore ? (
              "Save profile"
            ) : (
              "Create store"
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <SettingsSection
          icon={<CreditCard className="size-4" aria-hidden />}
          title="Payment information"
          description="Bank and UPI details shown on invoices for customer payments"
          className="surface-card rounded-xl"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.upi_id || undefined}>
              <FieldLabel htmlFor="upi_id">UPI ID</FieldLabel>
              <Input
                id="upi_id"
                placeholder="yourstore@upi"
                disabled={isSaving}
                {...register("upi_id")}
              />
              <FieldError errors={[errors.upi_id]} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.bank_name || undefined}>
                <FieldLabel htmlFor="bank_name">Bank name</FieldLabel>
                <Input
                  id="bank_name"
                  placeholder="HDFC Bank"
                  disabled={isSaving}
                  {...register("bank_name")}
                />
                <FieldError errors={[errors.bank_name]} />
              </Field>
              <Field data-invalid={!!errors.account_name || undefined}>
                <FieldLabel htmlFor="account_name">Account name</FieldLabel>
                <Input
                  id="account_name"
                  placeholder="ABC Electronics"
                  disabled={isSaving}
                  {...register("account_name")}
                />
                <FieldError errors={[errors.account_name]} />
              </Field>
              <Field data-invalid={!!errors.account_number || undefined}>
                <FieldLabel htmlFor="account_number">Account number</FieldLabel>
                <Input
                  id="account_number"
                  inputMode="numeric"
                  placeholder="123456789012"
                  className="font-mono"
                  disabled={isSaving}
                  {...register("account_number")}
                />
                <FieldError errors={[errors.account_number]} />
              </Field>
              <Field data-invalid={!!errors.ifsc_code || undefined}>
                <FieldLabel htmlFor="ifsc_code">IFSC code</FieldLabel>
                <Input
                  id="ifsc_code"
                  placeholder="HDFC0001234"
                  className="font-mono uppercase"
                  disabled={isSaving}
                  {...register("ifsc_code")}
                />
                <FieldError errors={[errors.ifsc_code]} />
              </Field>
            </div>
          </FieldGroup>
        </SettingsSection>

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isSaving || !hasStore}
            className="shadow-sm"
            onClick={() => void savePayment()}
          >
            {isSavingPayment ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Saving...
              </>
            ) : (
              "Save payment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
