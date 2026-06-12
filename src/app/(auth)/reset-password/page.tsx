import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";
import { LoadingState } from "@/components/layout/loading-state";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Busilogix account",
  openGraph: {
    ...sharedOpenGraph,
    title: "Reset password | Busilogix",
    description: "Set a new password for your Busilogix account",
    url: "/reset-password",
  },
  twitter: {
    ...sharedTwitter,
    title: "Reset password | Busilogix",
    description: "Set a new password for your Busilogix account",
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState title="Loading password reset..." description="" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
