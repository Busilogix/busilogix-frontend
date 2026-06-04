"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";
import { FormMessage } from "./form-message";

const SUBMIT_DELAY_MS = 1200;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(_data: LoginFormValues) {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
      setSubmitSuccess(
        "Sign-in successful. API integration will connect your account here.",
      );
    } catch {
      setSubmitError(
        "Unable to sign in right now. Please try again. (API placeholder)",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Busilogix account"
      footer={
        <AuthCardLink
          text="Don't have an account?"
          linkText="Create one"
          href="/signup"
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {submitError ? (
          <FormMessage
            type="error"
            title="Sign in failed"
            message={submitError}
          />
        ) : null}

        {submitSuccess ? (
          <FormMessage
            type="success"
            title="Signed in"
            message={submitSuccess}
          />
        ) : null}

        <FieldGroup>
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

          <Field data-invalid={!!errors.password || undefined}>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="#"
                className="text-xs font-medium text-primary hover:underline"
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
