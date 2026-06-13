"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api/auth.service";
import { isApiError } from "@/lib/api/errors";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success("Reset link sent successfully");
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to process request. Please try again.";
      toast.error("Request failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <AuthCard
        title="Check your email"
        description="We've sent a password reset link to your email address"
        footer={
          <AuthCardLink
            text="Remember your password?"
            linkText="Sign in"
            href="/login"
          />
        }
      >
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-6" aria-hidden />
          </div>
          <p className="text-sm text-muted-foreground">
            We have sent a password reset link to{" "}
            <span className="font-semibold text-foreground">{submittedEmail}</span>.
            Please follow the link in the email to set a new password.
          </p>
          <Button
            variant="outline"
            className="w-full font-semibold"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="mr-2 size-4" aria-hidden />
            Back to sign in
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      description="Enter your email to receive a password reset link"
      footer={
        <AuthCardLink
          text="Remember your password?"
          linkText="Sign in"
          href="/login"
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="forgot-email">Email address</FieldLabel>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={!!errors.email}
                className="pl-9"
                {...register("email")}
              />
            </div>
            <FieldError errors={[errors.email]} />
          </Field>
        </FieldGroup>

        <div className="pt-1">
          <Button
            type="submit"
            className="w-full font-semibold shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
