"use client";

import { ArrowRight, CircleDollarSign } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/context/auth-provider";
import { useStoreName } from "@/hooks/use-store-name";
import { formatCurrency } from "@/lib/invoices/format";
import { cn } from "@/lib/utils";

type DashboardWelcomeProps = {
  pendingAmount: number;
  currency: string;
  className?: string;
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getDisplayName(email: string | null): string {
  if (!email) {
    return "there";
  }

  const localPart = email.split("@")[0]?.trim();
  if (!localPart) {
    return "there";
  }

  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function DashboardWelcome({
  pendingAmount,
  currency,
  className,
}: DashboardWelcomeProps) {
  const { userEmail } = useAuth();
  const storeName = useStoreName();

  return (
    <section
      className={cn(
        "rounded-2xl border border-primary/10 bg-[linear-gradient(135deg,oklch(0.97_0.02_252)_0%,oklch(1_0_0)_55%,oklch(0.99_0.01_250)_100%)] p-5 shadow-sm shadow-primary/5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{formatToday()}</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {getGreeting()}, {getDisplayName(userEmail)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening at{" "}
            <span className="font-medium text-foreground">{storeName}</span>{" "}
            today.
          </p>
        </div>

        {pendingAmount > 0 ? (
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <CircleDollarSign className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {formatCurrency(pendingAmount, currency)} outstanding
              </p>
              <Link
                href="/invoices"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Review invoices
                <ArrowRight className="size-3" aria-hidden />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
