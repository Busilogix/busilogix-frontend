import type { Metadata } from "next";

import { InvoicesList } from "@/components/invoices";
import { PageContainer } from "@/components/layout/page-container";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Invoices",
  description: "View, search, and manage invoices",
  openGraph: {
    ...sharedOpenGraph,
    title: "Invoices | Busilogix",
    description: "View, search, and manage invoices",
    url: "/invoices",
  },
  twitter: {
    ...sharedTwitter,
    title: "Invoices | Busilogix",
    description: "View, search, and manage invoices",
  },
};

export default function InvoicesPage() {
  return (
    <PageContainer>
      <InvoicesList />
    </PageContainer>
  );
}
