import type { Metadata } from "next";

import { PrivacyContent } from "./privacy-content";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Busilogix platform - how we collect, use, and secure your business operations data.",
  openGraph: {
    ...sharedOpenGraph,
    title: "Privacy Policy | Busilogix",
    description:
      "Privacy Policy for Busilogix platform - how we collect, use, and secure your business operations data.",
    url: "/privacy",
  },
  twitter: {
    ...sharedTwitter,
    title: "Privacy Policy | Busilogix",
    description:
      "Privacy Policy for Busilogix platform - how we collect, use, and secure your business operations data.",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
