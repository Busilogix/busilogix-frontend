"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  User,
} from "lucide-react";
import Link from "next/link";
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
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";
import { GoogleLoginButton } from "./google-login-button";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    try {
      await authService.signup(data);
      setRegisteredEmail(data.email);
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to create your account. Please try again.";
      toast.error("Registration failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!registeredEmail || isResending) return;
    setIsResending(true);
    try {
      await authService.resendVerification({ email: registeredEmail });
      setResendCount((c) => c + 1);
      toast.success("Verification email resent", {
        description: `Another link has been sent to ${registeredEmail}`,
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

  /* ── Post-signup: check-your-email state ─────────────────────────────── */
  if (registeredEmail) {
    return (
      <AuthCard
        title="Check your inbox"
        description="One last step — verify your email to activate your account"
        footer={
          <AuthCardLink
            text="Already have an account?"
            linkText="Sign in"
            href="/login"
          />
        }
      >
        <div className="space-y-6 py-2">
          {/* Icon + email pill */}
          <div className="flex flex-col items-center gap-3 pt-1 text-center">
            <div className="relative">
              <div
                className="flex size-16 items-center justify-center rounded-2xl shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.20 252) 0%, oklch(0.45 0.22 260) 100%)",
                }}
              >
                <Mail className="size-8 text-white drop-shadow" aria-hidden />
              </div>
              <span className="absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                <CheckCircle2 className="size-3.5 text-white" aria-hidden />
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Mail className="size-3" aria-hidden />
              {registeredEmail}
            </div>
          </div>

          {/* What happens next */}
          <div className="space-y-3 rounded-xl border bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What happens next
            </p>
            <ul className="space-y-2">
              {[
                "We just sent a verification link to your email",
                "Open the email and click the link inside",
                "You'll be taken to a page confirming your account",
                "Then sign in and start using Busilogix",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Spam tip */}
          <p className="text-center text-xs text-muted-foreground/70">
            Can't find the email?{" "}
            <span className="text-muted-foreground">Check your spam folder</span>
            {" "}or request another one below.
          </p>

          {/* Resend */}
          <Button
            variant="outline"
            className="w-full font-semibold"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="size-4" aria-hidden />
                {resendCount > 0 ? "Resend again" : "Resend verification email"}
              </>
            )}
          </Button>
        </div>
      </AuthCard>
    );
  }

  /* ── Signup form ─────────────────────────────────────────────────────── */
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={!!errors.name || undefined}>
            <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
            <div className="relative">
              <User
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="signup-name"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                disabled={isLoading}
                aria-invalid={!!errors.name}
                className="pl-9"
                {...register("name")}
              />
            </div>
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="signup-email"
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
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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
        </FieldGroup>

        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            className="w-full font-semibold shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Creating account...
              </>
            ) : (
              "Create my Busilogix account"
            )}
          </Button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/80" />
            </div>
            <span className="relative bg-background px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Or continue with
            </span>
          </div>

          <GoogleLoginButton disabled={isLoading} />

          <p className="text-center text-[11px] text-muted-foreground pt-1">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
