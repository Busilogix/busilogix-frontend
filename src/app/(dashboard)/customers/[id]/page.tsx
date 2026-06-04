import type { Metadata } from "next";
import Link from "next/link";

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

  return {
    title: "Customer Profile",
    description: `Customer ${id} profile`,
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
