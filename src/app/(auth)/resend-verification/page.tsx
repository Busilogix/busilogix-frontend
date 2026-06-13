import type { Metadata } from "next";

import { ResendVerificationForm } from "@/components/auth";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Resend verification",
  description: "Request a new email verification link for your Busilogix account",
  openGraph: {
    ...sharedOpenGraph,
    title: "Resend verification | Busilogix",
    description: "Request a new email verification link for your Busilogix account",
    url: "/resend-verification",
  },
  twitter: {
    ...sharedTwitter,
    title: "Resend verification | Busilogix",
    description: "Request a new email verification link for your Busilogix account",
  },
};

export default function ResendVerificationPage() {
  return <ResendVerificationForm />;
}
