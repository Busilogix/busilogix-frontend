import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailView } from "@/components/auth";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";
import { LoadingState } from "@/components/layout/loading-state";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Confirm your email address for your Busilogix account",
  openGraph: {
    ...sharedOpenGraph,
    title: "Verify email | Busilogix",
    description: "Confirm your email address for your Busilogix account",
    url: "/verify-email",
  },
  twitter: {
    ...sharedTwitter,
    title: "Verify email | Busilogix",
    description: "Confirm your email address for your Busilogix account",
  },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState title="Loading verification..." description="" />}>
      <VerifyEmailView />
    </Suspense>
  );
}
