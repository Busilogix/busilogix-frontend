"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { customerService } from "@/lib/api/customer.service";
import { isApiError } from "@/lib/api/errors";
import { buildCreateCustomerPayload } from "@/lib/customers/build-create-payload";
import { buildUpdateCustomerPayload } from "@/lib/customers/build-update-payload";
import { mapApiCustomerToFormInput } from "@/lib/customers/map-api-customer";
import {
  customerFormSchema,
  type CustomerFormInput,
} from "@/lib/validations/customer";

import { CustomerFormSkeleton } from "./customer-form-skeleton";

type CustomerFormProps = {
  mode: "create" | "edit";
  customerId?: string;
};

type CustomerFormSectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

const defaultValues: CustomerFormInput = {
  mobile: "",
  name: "",
  email: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  },
};

function CustomerFormSection({
  icon,
  title,
  description,
  children,
}: CustomerFormSectionProps) {
  return (
    <Card className="surface-card h-full rounded-xl gap-3 py-3 sm:gap-4 sm:py-4">
      <CardHeader className="border-b px-3 pt-2.5 pb-2.5 sm:px-5 sm:pt-4 sm:pb-3.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-9">
            {icon}
          </span>
          <div>
            <CardTitle className="text-xs font-semibold sm:text-sm">{title}</CardTitle>
            <CardDescription className="text-[10px] leading-tight sm:text-xs">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pt-3.5 sm:px-5 sm:pt-5">{children}</CardContent>
    </Card>
  );
}

export function CustomerForm({ mode, customerId }: CustomerFormProps) {
  const router = useRouter();
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormInput>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (mode !== "edit" || !customerId) {
      return;
    }

    const id = customerId;
    let cancelled = false;

    async function loadCustomer() {
      setIsLoadingCustomer(true);
      setNotFound(false);

      try {
        const customer = await customerService.getById(id);

        if (cancelled) {
          return;
        }

        reset(mapApiCustomerToFormInput(customer));
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (isApiError(error) && error.statusCode === 404) {
          setNotFound(true);
          return;
        }

        setSubmitError(
          isApiError(error)
            ? error.message
            : "Unable to load customer. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setIsLoadingCustomer(false);
        }
      }
    }

    void loadCustomer();

    return () => {
      cancelled = true;
    };
  }, [mode, customerId, reset]);

  async function onSubmit(data: CustomerFormInput) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const { message } = await customerService.create(
          buildCreateCustomerPayload(data),
        );

        toast.success("Customer created", { description: message });
        router.push("/customers");
        return;
      }

      if (customerId) {
        const { message } = await customerService.update(
          customerId,
          buildUpdateCustomerPayload(data),
        );

        toast.success("Customer updated", { description: message });
        router.push("/customers");
      }
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingCustomer) {
    return <CustomerFormSkeleton />;
  }

  if (notFound) {
    return (
      <Card className="surface-card rounded-xl">
        <CardContent className="py-12 text-center">
          <p className="font-medium text-foreground">Customer not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This customer may have been deleted or the link is invalid.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            render={<Link href="/customers" />}
          >
            Back to customers
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isCreate = mode === "create";
  const addressErrors = errors.address;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {submitError ? (
        <FormMessage type="error" title="Save failed" message={submitError} />
      ) : null}

      <div className="surface-card rounded-xl border-primary/10 bg-primary/5 p-3 sm:p-5">
        <p className="text-sm font-semibold text-foreground">
          {isCreate ? "Before you create an invoice" : "Keep records accurate"}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {isCreate
            ? "Mobile number is required. Name, email, and billing address are optional — if you add an address, line 1, city, state, and pincode are required."
            : "Update name, email, and address. Mobile number cannot be changed after creation."}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CustomerFormSection
          icon={<User className="size-4" aria-hidden />}
          title="Contact information"
          description={
            isCreate
              ? "Mobile is required; name and email are optional"
              : "Mobile is read-only on edit"
          }
        >
          <FieldGroup className="gap-3 sm:gap-5">
            <Field data-invalid={!!errors.mobile || undefined}>
              <FieldLabel htmlFor="mobile">
                Mobile number <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldDescription className="text-[11px] leading-tight sm:text-xs">
                {isCreate
                  ? "Include country code, e.g. +91 70072 69286."
                  : "Saved at creation and cannot be updated."}
              </FieldDescription>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+917007269286"
                  className="h-10 text-sm pl-9"
                  disabled={isSubmitting || !isCreate}
                  readOnly={!isCreate}
                  aria-invalid={!!errors.mobile}
                  {...register("mobile")}
                />
              </div>
              <FieldError errors={[errors.mobile]} />
            </Field>

            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="name">Customer name</FieldLabel>
              <FieldDescription className="text-[11px] leading-tight sm:text-xs">
                Optional. Shown on invoices and lists.
              </FieldDescription>
              <div className="relative">
                <User
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="name"
                  placeholder="Dhruv Gupta"
                  className="h-10 text-sm pl-9"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <FieldDescription className="text-[11px] leading-tight sm:text-xs">
                Optional. Used for invoice emails and reminders.
              </FieldDescription>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="billing@company.com"
                  className="h-10 text-sm pl-9"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              <FieldError errors={[errors.email]} />
            </Field>
          </FieldGroup>
        </CustomerFormSection>

        <CustomerFormSection
          icon={<MapPin className="size-4" aria-hidden />}
          title="Billing address"
          description="Optional — required fields apply only when address is added"
        >
          <FieldGroup className="gap-3 sm:gap-5">
            <Field data-invalid={!!addressErrors?.line1 || undefined}>
              <FieldLabel htmlFor="address-line1">Address line 1</FieldLabel>
              <FieldDescription className="text-[11px] leading-tight sm:text-xs">Street, building, or area.</FieldDescription>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="address-line1"
                  placeholder="100 Market Street"
                  className="h-10 text-sm pl-9"
                  disabled={isSubmitting}
                  aria-invalid={!!addressErrors?.line1}
                  {...register("address.line1")}
                />
              </div>
              <FieldError errors={[addressErrors?.line1]} />
            </Field>

            <Field data-invalid={!!addressErrors?.line2 || undefined}>
              <FieldLabel htmlFor="address-line2">Address line 2</FieldLabel>
              <FieldDescription className="text-[11px] leading-tight sm:text-xs">
                Optional apartment, suite, or landmark.
              </FieldDescription>
              <Input
                id="address-line2"
                placeholder="Suite 4B"
                className="h-10 text-sm px-3"
                disabled={isSubmitting}
                aria-invalid={!!addressErrors?.line2}
                {...register("address.line2")}
              />
              <FieldError errors={[addressErrors?.line2]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!addressErrors?.city || undefined}>
                <FieldLabel htmlFor="address-city">City</FieldLabel>
                <Input
                  id="address-city"
                  placeholder="Bengaluru"
                  className="h-10 text-sm px-3"
                  disabled={isSubmitting}
                  aria-invalid={!!addressErrors?.city}
                  {...register("address.city")}
                />
                <FieldError errors={[addressErrors?.city]} />
              </Field>

              <Field data-invalid={!!addressErrors?.state || undefined}>
                <FieldLabel htmlFor="address-state">State</FieldLabel>
                <Input
                  id="address-state"
                  placeholder="Karnataka"
                  className="h-10 text-sm px-3"
                  disabled={isSubmitting}
                  aria-invalid={!!addressErrors?.state}
                  {...register("address.state")}
                />
                <FieldError errors={[addressErrors?.state]} />
              </Field>
            </div>

            <Field data-invalid={!!addressErrors?.pincode || undefined}>
              <FieldLabel htmlFor="address-pincode">Pincode</FieldLabel>
              <Input
                id="address-pincode"
                placeholder="560100"
                className="h-10 text-sm px-3"
                disabled={isSubmitting}
                aria-invalid={!!addressErrors?.pincode}
                {...register("address.pincode")}
              />
              <FieldError errors={[addressErrors?.pincode]} />
            </Field>
          </FieldGroup>
        </CustomerFormSection>
      </div>

      <div className="surface-card sticky bottom-4 z-10 flex flex-col gap-2.5 rounded-xl px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm text-muted-foreground">
          {isCreate
            ? "Customer will be saved to your account after creation."
            : "Updates sync to the customer list immediately."}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            render={<Link href="/customers" />}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="shadow-sm">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                {isCreate ? "Creating..." : "Saving..."}
              </>
            ) : isCreate ? (
              "Create customer"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
