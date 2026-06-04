import type { Metadata } from "next";

import { SignupForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Busilogix account",
};

export default function SignupPage() {
  return <SignupForm />;
}
