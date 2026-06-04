"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";
import { FormMessage } from "./form-message";

const SUBMIT_DELAY_MS = 1400;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
    },
  });

  async function onSubmit(_data: SignupFormValues) {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
      setSubmitSuccess(
        "Account created successfully. API integration will complete registration here.",
      );
    } catch {
      setSubmitError(
        "Unable to create your account. Please try again. (API placeholder)",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start managing invoices and customers with Busilogix"
      footer={
        <AuthCardLink
          text="Already have an account?"
          linkText="Sign in"
          href="/login"
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {submitError ? (
          <FormMessage
            type="error"
            title="Registration failed"
            message={submitError}
          />
        ) : null}

        {submitSuccess ? (
          <FormMessage
            type="success"
            title="Account created"
            message={submitSuccess}
          />
        ) : null}

        <FieldGroup>
          <Field data-invalid={!!errors.name || undefined}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Jane Smith"
              autoComplete="name"
              disabled={isLoading}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.mobile || undefined}>
            <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
            <Input
              id="mobile"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              disabled={isLoading}
              aria-invalid={!!errors.mobile}
              {...register("mobile")}
            />
            <FieldError errors={[errors.mobile]} />
          </Field>

          <Field data-invalid={!!errors.password || undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthCard>
  );
}
