import type { Metadata } from "next";

import { CustomerForm, CustomerFormHeader } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Add Customer",
  description: "Create a new customer record",
};

export default function NewCustomerPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <CustomerFormHeader mode="create" />
        <CustomerForm mode="create" />
      </div>
    </PageContainer>
  );
}
