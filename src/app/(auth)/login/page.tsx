import type { Metadata } from "next";

import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Busilogix account",
};

export default function LoginPage() {
  return <LoginForm />;
}
