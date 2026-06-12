"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  SendHorizonal,
  ShieldCheck,
} from "lucide-react";
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
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";

const steps = [
  { icon: Mail, label: "Enter your email" },
  { icon: SendHorizonal, label: "We send you a link" },
  { icon: ShieldCheck, label: "Click to verify" },
];

export function ResendVerificationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ResendVerificationFormValues) {
    setIsLoading(true);
    try {
      await authService.resendVerification(data);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success("Verification email sent");
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Failed to send verification email. Please try again.";
      toast.error("Request failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Success state ──────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <AuthCard
        title="Check your inbox"
        description="A fresh verification link is on its way to you"
        footer={
          <AuthCardLink
            text="Already verified?"
            linkText="Sign in"
            href="/login"
          />
        }
      >
        <div className="space-y-6 py-2 text-center">
          {/* Animated envelope icon */}
          <div className="relative mx-auto w-fit">
            <div
              className="flex size-16 items-center justify-center rounded-2xl shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.82 0.14 85) 0%, oklch(0.75 0.18 70) 100%)",
              }}
            >
              <Mail className="size-8 text-white drop-shadow" aria-hidden />
            </div>
            {/* Check badge */}
            <span className="absolute -right-1.5 -bottom-1.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
              <CheckCircle2 className="size-3.5 text-white" aria-hidden />
            </span>
          </div>

          {/* Email pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300">
            <Mail className="size-3" aria-hidden />
            {submittedEmail}
          </div>

          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
            We've sent a verification link to this address. Click the link in
            the email to activate your account — it may take a minute or two to
            arrive.
          </p>

          {/* Tip */}
          <p className="text-xs text-muted-foreground/70">
            Can't find it?{" "}
            <span className="text-muted-foreground">
              Check your spam or junk folder.
            </span>
          </p>

          <Button
            variant="outline"
            className="w-full font-semibold"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to sign in
          </Button>
        </div>
      </AuthCard>
    );
  }

  /* ── Request form ───────────────────────────────────────────── */
  return (
    <AuthCard
      title="Resend verification"
      description="Enter your email and we'll send a fresh verification link"
      footer={
        <AuthCardLink
          text="Remember your password?"
          linkText="Sign in"
          href="/login"
        />
      }
    >
      <div className="space-y-6">
        {/* How it works — 3 steps */}
        <ol className="flex items-start justify-between gap-2 rounded-xl border bg-muted/30 px-4 py-3">
          {steps.map((step, i) => (
            <li key={step.label} className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
                <step.icon className="size-4" aria-hidden />
              </span>
              <span className="text-[10px] leading-tight font-medium text-muted-foreground">
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <span className="sr-only">then</span>
              )}
            </li>
          ))}
        </ol>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="resend-email">Email address</FieldLabel>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="resend-email"
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
              style={{
                background: isLoading
                  ? undefined
                  : "linear-gradient(135deg, oklch(0.72 0.18 75) 0%, oklch(0.65 0.20 62) 100%)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Sending verification email...
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" aria-hidden />
                  Send verification link
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}
