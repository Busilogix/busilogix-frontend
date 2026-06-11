import type { Metadata } from "next";

import { LoginForm } from "@/components/auth";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Busilogix account",
  openGraph: {
    ...sharedOpenGraph,
    title: "Sign in | Busilogix",
    description: "Sign in to your Busilogix account",
    url: "/login",
  },
  twitter: {
    ...sharedTwitter,
    title: "Sign in | Busilogix",
    description: "Sign in to your Busilogix account",
  },
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
