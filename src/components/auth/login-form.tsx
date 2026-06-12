"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useAuth } from "@/context/auth-provider";
import { authService } from "@/lib/api/auth.service";
import { isApiError } from "@/lib/api/errors";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";
import { FormMessage } from "./form-message";
import { GoogleLoginButton } from "./google-login-button";

type LoginFormProps = {
  registeredMessage?: string | null;
  errorMessage?: string | null;
};

export function LoginForm({ registeredMessage, errorMessage }: LoginFormProps) {
  const router = useRouter();
  const { setUserEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (registeredMessage) {
      toast.success("Account created", {
        description: registeredMessage,
      });
    }
  }, [registeredMessage]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setUnverifiedEmail(null);

    try {
      await authService.login(data);
      setUserEmail(data.email);
      router.push("/dashboard");
    } catch (error) {
      if (isApiError(error) && error.statusCode === 403) {
        setUnverifiedEmail(data.email);
      } else {
        const message = isApiError(error)
          ? error.message
          : "Unable to sign in right now. Please try again.";
        toast.error("Sign in failed", {
          description: message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!unverifiedEmail || isResending) return;
    setIsResending(true);
    setResendSuccess(false);
    try {
      await authService.resendVerification({ email: unverifiedEmail });
      setResendSuccess(true);
      toast.success("Verification email sent", {
        description: `A new link has been sent to ${unverifiedEmail}`,
      });
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Failed to resend. Please try again.";
      toast.error("Could not resend", { description: message });
    } finally {
      setIsResending(false);
    }
  }

  // ── Email-not-verified state ──────────────────────────────────────────────
  if (unverifiedEmail) {
    return (
      <AuthCard
        title="Verify your email"
        description="Your account needs email verification before you can sign in"
        footer={
          <AuthCardLink
            text="Wrong account?"
            linkText="Back to sign in"
            href="/login"
          />
        }
      >
        <div className="space-y-6 py-2">
          {/* Icon + email pill */}
          <div className="flex flex-col items-center gap-3 pt-2 text-center">
            <div
              className="flex size-14 items-center justify-center rounded-2xl shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.14 85) 0%, oklch(0.75 0.18 70) 100%)",
              }}
            >
              <Mail className="size-7 text-white drop-shadow-sm" aria-hidden />
            </div>
            <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300">
              {unverifiedEmail}
            </div>
          </div>

          {/* Explanation */}
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            We sent a verification link to this address when you signed up.
            Click the link in that email, or request a new one below.
          </p>

          {/* Resend success banner */}
          {resendSuccess && (
            <FormMessage
              type="success"
              title="Email sent!"
              message="Check your inbox and click the verification link."
            />
          )}

          {/* Primary CTA */}
          <div className="space-y-3">
            <Button
              className="w-full font-semibold shadow-sm"
              onClick={handleResend}
              disabled={isResending || resendSuccess}
              style={
                resendSuccess
                  ? undefined
                  : {
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.18 75) 0%, oklch(0.65 0.20 62) 100%)",
                    }
              }
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Sending verification email...
                </>
              ) : resendSuccess ? (
                <>
                  <Mail aria-hidden />
                  Email sent — check your inbox
                </>
              ) : (
                <>
                  <RefreshCw aria-hidden />
                  Resend verification email
                </>
              )}
            </Button>

            {/* Secondary — try a different account */}
            <button
              type="button"
              onClick={() => {
                setUnverifiedEmail(null);
                setResendSuccess(false);
              }}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Try a different account
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  // ── Normal sign-in form ───────────────────────────────────────────────────
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Busilogix account to continue"
      footer={
        <AuthCardLink
          text="Don't have an account?"
          linkText="Create one free"
          href="/signup"
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errorMessage && (
          <FormMessage
            type="error"
            title="Sign in failed"
            message={errorMessage}
            className="mb-4"
          />
        )}
        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="login-email">Email address</FieldLabel>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="login-email"
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

          <Field data-invalid={!!errors.password || undefined}>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
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
                Signing in...
              </>
            ) : (
              "Sign in to Busilogix"
            )}
          </Button>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/80" />
          </div>
          <span className="relative bg-background px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Or continue with
          </span>
        </div>

        <GoogleLoginButton disabled={isLoading} />
      </form>
    </AuthCard>
  );
}
