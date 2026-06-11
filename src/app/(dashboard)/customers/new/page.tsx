import type { Metadata } from "next";

import { CustomerForm } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Add Customer",
  description: "Create a new customer record",
};

export default function NewCustomerPage() {
  return (
    <PageContainer
      title="Add customer"
      description="Capture contact and billing details so you can create invoices faster with accurate customer information."
    >
      <CustomerForm mode="create" />
    </PageContainer>
  );
}
