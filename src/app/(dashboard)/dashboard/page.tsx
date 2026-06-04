import type { Metadata } from "next";

import { DashboardView } from "@/components/dashboard";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of customers, invoices, and revenue",
};

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Start here to understand your customers, invoices, revenue, and next actions."
    >
      <DashboardView />
    </PageContainer>
  );
}
