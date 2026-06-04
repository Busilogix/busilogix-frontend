import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { ReportsView } from "@/components/reports";

export const metadata: Metadata = {
  title: "Reports",
  description: "Revenue, invoice, and customer insights",
};

export default function ReportsPage() {
  return (
    <PageContainer
      title="Reports"
      description="Understand revenue, pending payments, invoice status, and top customers at a glance."
    >
      <ReportsView />
    </PageContainer>
  );
}
