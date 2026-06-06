import type { Metadata } from "next";

import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Busilogix account",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registeredMessage =
    params.registered === "1" ? "Account created — sign in to continue." : null;

  return <LoginForm registeredMessage={registeredMessage} />;
}
