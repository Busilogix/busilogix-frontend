import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { ReportsView } from "@/components/reports";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Reports",
  description: "Revenue, invoice, and customer insights",
  openGraph: {
    ...sharedOpenGraph,
    title: "Reports | Busilogix",
    description: "Revenue, invoice, and customer insights",
    url: "/reports",
  },
  twitter: {
    ...sharedTwitter,
    title: "Reports | Busilogix",
    description: "Revenue, invoice, and customer insights",
  },
};

export default function ReportsPage() {
  return (
    <PageContainer>
      <ReportsView />
    </PageContainer>
  );
}
