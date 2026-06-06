import type { Metadata } from "next";

import { InvoicesList } from "@/components/invoices";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Invoices",
  description: "View, search, and manage invoices",
};

export default function InvoicesPage() {
  return (
    <PageContainer>
      <InvoicesList />
    </PageContainer>
  );
}
