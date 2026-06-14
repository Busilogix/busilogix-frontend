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
import { AppLogo } from "@/components/layout/app-logo";
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
    <div className="w-full max-w-[700px] py-6 sm:py-8">
      <div className="mb-6 flex justify-center lg:hidden">
        <AppLogo variant="auth" href="/dashboard" />
      </div>

      <Card className="relative overflow-hidden border-none shadow-2xl shadow-indigo-500/5 bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/5 sm:rounded-[2rem]">
        {/* Subtle decorative gradient background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60 pointer-events-none" aria-hidden />
        
        <CardHeader className="space-y-1.5 border-b border-slate-200/50 pb-6 pt-8 px-6 sm:px-8">
          <CardTitle className="text-[22px] font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Set up your store
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 font-medium">
            Please register your business details to configure your workspace and start billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-6 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-inner">
                  <Building2 className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Company Profile</h3>
              </div>
              <FieldGroup className="gap-5">
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

            <div className="border-t border-slate-200/50 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20 shadow-inner">
                  <MapPin className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Business Address</h3>
              </div>
              <FieldGroup className="gap-5">
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

            <div className="flex flex-col-reverse gap-4 pt-6 mt-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/50 pb-4">
              <Button
                type="button"
                variant="ghost"
                onClick={logout}
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 rounded-xl transition-colors font-semibold h-12 px-6"
                disabled={isSaving}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-[0_8px_16px_-6px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin size-5 mr-2.5" aria-hidden />
                    Creating store...
                  </>
                ) : (
                  "Create your store"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
