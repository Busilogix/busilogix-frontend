import type { Metadata } from "next";

import { CustomerForm } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditCustomerPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Edit Customer #${id}`;
  const description = `Update details and contact information for customer ${id}.`;

  return {
    title,
    description,
    openGraph: {
      ...sharedOpenGraph,
      title: `${title} | Busilogix`,
      description,
      url: `/customers/${id}/edit`,
    },
    twitter: {
      ...sharedTwitter,
      title: `${title} | Busilogix`,
      description,
    },
  };
}

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      title="Edit customer"
      description="Update contact and billing details used across invoices and customer records."
    >
      <CustomerForm mode="edit" customerId={id} />
    </PageContainer>
  );
}
