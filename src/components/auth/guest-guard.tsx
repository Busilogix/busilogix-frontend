"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LoadingState } from "@/components/layout/loading-state";
import { useHasAccessToken } from "@/hooks/use-has-access-token";

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useHasAccessToken();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return <LoadingState title="Redirecting to dashboard..." description="" />;
  }

  return <>{children}</>;
}
