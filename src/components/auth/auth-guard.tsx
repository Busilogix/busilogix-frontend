"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LoadingState } from "@/components/layout/loading-state";
import { useAuth } from "@/context/auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasStore, isCheckingStore } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (isCheckingStore) {
      return;
    }

    if (hasStore === false) {
      if (pathname !== "/store-setup") {
        router.replace("/store-setup");
      }
    } else if (hasStore === true) {
      if (pathname === "/store-setup") {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, hasStore, isCheckingStore, pathname, router]);

  if (!isAuthenticated) {
    return <LoadingState title="Redirecting to sign in..." description="" />;
  }

  if (isCheckingStore) {
    return (
      <LoadingState
        title="Verifying store status"
        description="Please wait while we verify your account configuration."
      />
    );
  }

  if (hasStore === false && pathname !== "/store-setup") {
    return (
      <LoadingState
        title="Redirecting to store setup"
        description="A store profile is required to access the dashboard."
      />
    );
  }

  if (hasStore === true && pathname === "/store-setup") {
    return (
      <LoadingState
        title="Redirecting to dashboard"
        description="Store already configured."
      />
    );
  }

  return <>{children}</>;
}

