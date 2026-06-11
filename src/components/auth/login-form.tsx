"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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

    try {
      await authService.login(data);
      setUserEmail(data.email);
      router.push("/dashboard");
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to sign in right now. Please try again.";
      toast.error("Sign in failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

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
                href="#"
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
