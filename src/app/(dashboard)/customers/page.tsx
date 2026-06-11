import type { Metadata } from "next";

import { CustomersList } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage your customer contacts and billing details",
  openGraph: {
    ...sharedOpenGraph,
    title: "Customers | Busilogix",
    description: "Manage your customer contacts and billing details",
    url: "/customers",
  },
  twitter: {
    ...sharedTwitter,
    title: "Customers | Busilogix",
    description: "Manage your customer contacts and billing details",
  },
};

export default function CustomersPage() {
  return (
    <PageContainer>
      <CustomersList />
    </PageContainer>
  );
}
