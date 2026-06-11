import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { SettingsForm, SettingsPageHeader } from "@/components/settings";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage company, invoice, and email preferences",
  openGraph: {
    ...sharedOpenGraph,
    title: "Settings | Busilogix",
    description: "Manage company, invoice, and email preferences",
    url: "/settings",
  },
  twitter: {
    ...sharedTwitter,
    title: "Settings | Busilogix",
    description: "Manage company, invoice, and email preferences",
  },
};

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <SettingsPageHeader />
        <SettingsForm />
      </div>
    </PageContainer>
  );
}
