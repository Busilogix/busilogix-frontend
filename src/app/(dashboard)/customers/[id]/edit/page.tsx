import type { Metadata } from "next";

import { CustomerForm, CustomerFormHeader } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditCustomerPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Edit Customer",
    description: `Edit customer ${id}`,
  };
}

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <div className="space-y-6">
        <CustomerFormHeader mode="edit" />
        <CustomerForm mode="edit" customerId={id} />
      </div>
    </PageContainer>
  );
}
