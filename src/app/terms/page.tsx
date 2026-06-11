import type { Metadata } from "next";

import { TermsContent } from "./terms-content";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Busilogix platform - agreements, rules, accounts, and policies for using our invoicing and business services.",
  openGraph: {
    ...sharedOpenGraph,
    title: "Terms of Service | Busilogix",
    description:
      "Terms of Service for Busilogix platform - agreements, rules, accounts, and policies for using our invoicing and business services.",
    url: "/terms",
  },
  twitter: {
    ...sharedTwitter,
    title: "Terms of Service | Busilogix",
    description:
      "Terms of Service for Busilogix platform - agreements, rules, accounts, and policies for using our invoicing and business services.",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
