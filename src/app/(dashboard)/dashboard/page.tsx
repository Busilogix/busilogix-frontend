import type { Metadata } from "next";

import { DashboardView } from "@/components/dashboard";
import { PageContainer } from "@/components/layout/page-container";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of customers, invoices, and revenue",
  openGraph: {
    ...sharedOpenGraph,
    title: "Dashboard | Busilogix",
    description: "Overview of customers, invoices, and revenue",
    url: "/dashboard",
  },
  twitter: {
    ...sharedTwitter,
    title: "Dashboard | Busilogix",
    description: "Overview of customers, invoices, and revenue",
  },
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardView />
    </PageContainer>
  );
}
