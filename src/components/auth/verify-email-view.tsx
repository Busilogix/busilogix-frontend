"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api/auth.service";
import { isApiError } from "@/lib/api/errors";

import { AuthCard, AuthCardLink } from "./auth-card";

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was found in the URL. Please make sure you clicked the correct link.");
      return;
    }

    async function verify() {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        toast.success("Email verified successfully");
      } catch (error) {
        setStatus("error");
        const message = isApiError(error)
          ? error.message
          : "The verification link is invalid or has expired.";
        setErrorMessage(message);
        toast.error("Verification failed", {
          description: message,
        });
      }
    }

    verify();
  }, [token]);

  if (status === "loading") {
    return (
      <AuthCard
        title="Verifying email"
        description="Please wait while we confirm your email address"
      >
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground animate-pulse">
            Verifying token credentials...
          </p>
        </div>
      </AuthCard>
    );
  }

  if (status === "error") {
    return (
      <AuthCard
        title="Verification failed"
        description="We could not verify your email address"
        footer={
          <AuthCardLink
            text="Need to try again?"
            linkText="Resend verification link"
            href="/resend-verification"
          />
        }
      >
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground">
            <XCircle className="size-6" aria-hidden />
          </div>
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button
            className="w-full font-semibold shadow-sm"
            onClick={() => router.push("/resend-verification")}
          >
            Request new verification link
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Email verified"
      description="Your email address has been successfully confirmed"
      footer={
        <AuthCardLink
          text="Ready to get started?"
          linkText="Sign in to your account"
          href="/login"
        />
      }
    >
      <div className="space-y-6 py-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <CheckCircle2 className="size-6" aria-hidden />
        </div>
        <p className="text-sm text-muted-foreground">
          Thank you for confirming your email. Your account is now active.
        </p>
        <Button
          className="w-full font-semibold shadow-sm"
          onClick={() => router.push("/login")}
        >
          Sign in to Busilogix
        </Button>
      </div>
    </AuthCard>
  );
}
