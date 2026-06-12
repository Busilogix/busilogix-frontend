"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";
import { FormMessage } from "./form-message";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Invalid token", {
        description: "Password reset token is missing from the URL.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: data.password,
      });
      setIsSuccess(true);
      toast.success("Password reset successful");
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Failed to reset password. The link may have expired.";
      toast.error("Reset failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthCard
        title="Invalid Link"
        description="The password reset link is invalid or has expired"
        footer={
          <AuthCardLink
            text="Need to try again?"
            linkText="Request a new link"
            href="/forgot-password"
          />
        }
      >
        <div className="space-y-6 py-4 text-center">
          <FormMessage
            type="error"
            title="Reset link issue"
            message="No reset token was found in the URL. Please make sure you copied the entire link from your email."
          />
          <Button
            variant="outline"
            className="w-full font-semibold"
            onClick={() => router.push("/forgot-password")}
          >
            Request new reset link
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (isSuccess) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been successfully reset"
        footer={
          <AuthCardLink
            text="Ready to sign in?"
            linkText="Login to your account"
            href="/login"
          />
        }
      >
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="size-6" aria-hidden />
          </div>
          <p className="text-sm text-muted-foreground">
            Your password has been changed successfully. You can now use your new password to sign in to your Busilogix account.
          </p>
          <Button
            className="w-full font-semibold"
            onClick={() => router.push("/login")}
          >
            Sign in to Busilogix
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset password"
      description="Choose a new secure password for your account"
      footer={
        <AuthCardLink
          text="Back to security?"
          linkText="Sign in"
          href="/login"
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.password || undefined}>
            <FieldLabel htmlFor="reset-password">New password</FieldLabel>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className="pl-9 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.password]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword || undefined}>
            <FieldLabel htmlFor="reset-confirm-password">Confirm new password</FieldLabel>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="reset-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                className="pl-9 pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.confirmPassword]} />
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
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
