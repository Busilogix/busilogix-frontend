"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, LogOut, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { LogoUploader } from "@/components/ui/logo-uploader";
import { PhoneInput } from "@/components/ui/phone-input";
import { useAuth } from "@/context/auth-provider";
import { isApiError } from "@/lib/api/errors";
import { storeService } from "@/lib/api/store.service";
import { buildStoreProfilePayload } from "@/lib/settings/build-store-payload";
import { dispatchStoreUpdated } from "@/lib/settings/store-events";
import { formatMobileNumber } from "@/lib/utils";
import {
  profileFormSchema,
  type ProfileFormInput,
} from "@/lib/validations/settings";

const EMPTY_PROFILE: ProfileFormInput = {
  company_name: "",
  company_email: "",
  company_phone: "",
  logo_url: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  gst_number: "",
};

export function StoreSetupForm() {
  const router = useRouter();
  const { setHasStore, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: EMPTY_PROFILE,
  });

  const logoUrl = watch("logo_url");

  async function onSubmit(data: ProfileFormInput) {
    setIsSaving(true);

    try {
      const payload = buildStoreProfilePayload({
        ...data,
        company_phone: formatMobileNumber(data.company_phone),
        gst_number: data.gst_number.trim().toUpperCase(),
        logo_url: data.logo_url.trim(),
      });

      const { message } = await storeService.create(payload);
      setHasStore(true);
      dispatchStoreUpdated();
      toast.success("Store created", {
        description: message || "Your store profile has been set up successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Creation failed", {
        description: isApiError(error)
          ? error.message
          : "Unable to create your store. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-full max-w-xl px-4 py-8">
      <Card className="border border-slate-200/80 shadow-xl shadow-slate-950/8 ring-1 ring-black/5">
        <CardHeader className="space-y-1.5 border-b pb-5">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Set up your store
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Please register your business details to configure your workspace and start billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary/90">
                <Building2 className="size-4" />
                Company Profile
              </div>
              <FieldGroup className="gap-4">
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
                      placeholder="e.g. Acme Corporation"
                      disabled={isSaving}
                      {...register("company_name")}
                    />
                    <FieldError errors={[errors.company_name]} />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.company_email || undefined}>
                    <FieldLabel htmlFor="company_email">Company email</FieldLabel>
                    <Input
                      id="company_email"
                      type="email"
                      placeholder="billing@company.com"
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
                  <FieldLabel htmlFor="gst_number">GST number (optional)</FieldLabel>
                  <Input
                    id="gst_number"
                    placeholder="e.g. 27AABCU9603R1ZM"
                    className="font-mono uppercase"
                    disabled={isSaving}
                    {...register("gst_number")}
                  />
                  <FieldError errors={[errors.gst_number]} />
                </Field>
              </FieldGroup>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary/90">
                <MapPin className="size-4" />
                Business Address
              </div>
              <FieldGroup className="gap-4">
                <Field data-invalid={!!errors.address_line1 || undefined}>
                  <FieldLabel htmlFor="address_line1">Address line 1</FieldLabel>
                  <Input
                    id="address_line1"
                    placeholder="Street address, P.O. box, company name"
                    disabled={isSaving}
                    {...register("address_line1")}
                  />
                  <FieldError errors={[errors.address_line1]} />
                </Field>

                <Field data-invalid={!!errors.address_line2 || undefined}>
                  <FieldLabel htmlFor="address_line2">Address line 2 (optional)</FieldLabel>
                  <Input
                    id="address_line2"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    disabled={isSaving}
                    {...register("address_line2")}
                  />
                  <FieldError errors={[errors.address_line2]} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field data-invalid={!!errors.city || undefined}>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      disabled={isSaving}
                      {...register("city")}
                    />
                    <FieldError errors={[errors.city]} />
                  </Field>

                  <Field data-invalid={!!errors.state || undefined}>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      disabled={isSaving}
                      {...register("state")}
                    />
                    <FieldError errors={[errors.state]} />
                  </Field>

                  <Field data-invalid={!!errors.postal_code || undefined}>
                    <FieldLabel htmlFor="postal_code">Pincode</FieldLabel>
                    <Input
                      id="postal_code"
                      placeholder="400001"
                      disabled={isSaving}
                      {...register("postal_code")}
                    />
                    <FieldError errors={[errors.postal_code]} />
                  </Field>
                </div>
              </FieldGroup>
            </div>

            <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={logout}
                className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                disabled={isSaving}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full font-semibold shadow-sm sm:w-auto px-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin size-4" aria-hidden />
                    Creating store...
                  </>
                ) : (
                  "Create store"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
