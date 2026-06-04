"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/layout/loading-state";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "@/lib/customers/mock-store";
import type { CustomerFormValues } from "@/lib/customers/types";
import {
  customerFormSchema,
  type CustomerFormInput,
} from "@/lib/validations/customer";

const LOAD_DELAY_MS = 600;
const SUBMIT_DELAY_MS = 800;

type CustomerFormProps = {
  mode: "create" | "edit";
  customerId?: string;
};

const defaultValues: CustomerFormInput = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

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

    setIsLoadingCustomer(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      const customer = getCustomerById(customerId);

      if (!customer) {
        setNotFound(true);
        setIsLoadingCustomer(false);
        return;
      }

      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      });
      setIsLoadingCustomer(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [mode, customerId, reset]);

  async function onSubmit(data: CustomerFormInput) {
    setSubmitError(null);
    setIsSubmitting(true);

    const payload: CustomerFormValues = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));

      if (mode === "create") {
        createCustomer(payload);
      } else if (customerId) {
        const updated = updateCustomer(customerId, payload);

        if (!updated) {
          setSubmitError("Customer not found. It may have been removed.");
          return;
        }
      }

      router.push("/customers");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingCustomer) {
    return <LoadingState title="Loading customer" variant="skeleton" />;
  }

  if (notFound) {
    return (
      <Card>
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

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>
          {mode === "create" ? "Customer details" : "Update customer"}
        </CardTitle>
        <CardDescription>
          Add the basic contact and billing details you will use on invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          noValidate
        >
          {submitError ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {submitError}
            </p>
          ) : null}

          <FieldGroup>
            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription>
                Use the customer or company name you want shown on invoices.
              </FieldDescription>
              <Input
                id="name"
                placeholder="Acme Corporation"
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.email || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldDescription>
                  Invoice emails and reminders will be sent here.
                </FieldDescription>
                <Input
                  id="email"
                  type="email"
                  placeholder="billing@company.com"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.phone || undefined}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <FieldDescription>
                  Include country code if you bill international customers.
                </FieldDescription>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                <FieldError errors={[errors.phone]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.address || undefined}>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <FieldDescription>
                Full billing address, including city, state, and postal code.
              </FieldDescription>
              <Textarea
                id="address"
                placeholder="Street, city, state, postal code"
                rows={3}
                disabled={isSubmitting}
                aria-invalid={!!errors.address}
                {...register("address")}
              />
              <FieldError errors={[errors.address]} />
            </Field>
          </FieldGroup>

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              render={<Link href="/customers" />}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : mode === "create" ? (
                "Create customer"
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
