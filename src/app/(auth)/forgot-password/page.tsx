import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your Busilogix account",
  openGraph: {
    ...sharedOpenGraph,
    title: "Forgot password | Busilogix",
    description: "Request a password reset link for your Busilogix account",
    url: "/forgot-password",
  },
  twitter: {
    ...sharedTwitter,
    title: "Forgot password | Busilogix",
    description: "Request a password reset link for your Busilogix account",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
