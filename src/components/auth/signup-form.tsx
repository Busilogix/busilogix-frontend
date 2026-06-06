"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
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
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";

import { AuthCard, AuthCardLink } from "./auth-card";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", mobile: "", password: "" },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);

    try {
      await authService.signup(data);
      router.push("/login?registered=1");
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to create your account. Please try again.";
      toast.error("Registration failed", {
        description: message,
      });
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

          <div className="grid gap-4 sm:grid-cols-2">
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

            <Field data-invalid={!!errors.mobile || undefined}>
              <FieldLabel htmlFor="signup-mobile">Mobile</FieldLabel>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="signup-mobile"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  disabled={isLoading}
                  aria-invalid={!!errors.mobile}
                  className="pl-9"
                  {...register("mobile")}
                />
              </div>
              <FieldError errors={[errors.mobile]} />
            </Field>
          </div>

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

          <p className="text-center text-[11px] text-muted-foreground">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
