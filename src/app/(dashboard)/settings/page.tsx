import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { SettingsForm } from "@/components/settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage company, invoice, and email preferences",
};

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Set up your business profile once so future invoices are faster and more consistent."
    >
      <div className="mx-auto max-w-3xl">
        <SettingsForm />
      </div>
    </PageContainer>
  );
}
