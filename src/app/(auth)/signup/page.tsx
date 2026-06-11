import type { Metadata } from "next";

import { SignupForm } from "@/components/auth";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Busilogix account",
  openGraph: {
    ...sharedOpenGraph,
    title: "Sign up | Busilogix",
    description: "Create your Busilogix account",
    url: "/signup",
  },
  twitter: {
    ...sharedTwitter,
    title: "Sign up | Busilogix",
    description: "Create your Busilogix account",
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
