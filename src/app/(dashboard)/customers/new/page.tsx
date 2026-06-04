import type { Metadata } from "next";
import Link from "next/link";

import { CustomerForm } from "@/components/customers";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Add Customer",
  description: "Create a new customer record",
};

export default function NewCustomerPage() {
  return (
    <PageContainer
      title="Add customer"
      description="Enter contact and billing details for a new customer."
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
        <CustomerForm mode="create" />
      </div>
    </PageContainer>
  );
}
