import type { Metadata } from "next";
import Link from "next/link";

import { CustomerForm } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <PageContainer
      title="Edit customer"
      description="Update customer contact and billing information."
      actions={
        <Link
          href="/customers"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
          )}
        >
          Back to list
        </Link>
      }
    >
      <div className="mx-auto max-w-2xl">
        <CustomerForm mode="edit" customerId={id} />
      </div>
    </PageContainer>
  );
}
