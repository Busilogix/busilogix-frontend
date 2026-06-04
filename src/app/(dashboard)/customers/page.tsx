import type { Metadata } from "next";

import { CustomersList } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage your customer contacts and billing details",
};

export default function CustomersPage() {
  return (
    <PageContainer
      title="Customers"
      description="Keep customer contact, tax, and billing details organized before creating invoices."
    >
      <CustomersList />
    </PageContainer>
  );
}
