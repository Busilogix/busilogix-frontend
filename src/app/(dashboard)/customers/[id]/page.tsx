import type { Metadata } from "next";
import Link from "next/link";

import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

import { CustomerDetailView } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CustomerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Customer Profile #${id}`;
  const description = `Review details, invoice history, paid revenue, and pending balances for customer ${id}.`;

  return {
    title,
    description,
    openGraph: {
      ...sharedOpenGraph,
      title: `${title} | Busilogix`,
      description,
      url: `/customers/${id}`,
    },
    twitter: {
      ...sharedTwitter,
      title: `${title} | Busilogix`,
      description,
    },
  };
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      title="Customer profile"
      description="Review customer details, invoice history, paid revenue, and pending balances."
      actions={
        <Link
          href="/customers"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
          )}
        >
          Back to customers
        </Link>
      }
    >
      <CustomerDetailView customerId={id} />
    </PageContainer>
  );
}
