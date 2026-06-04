import type { Metadata } from "next";
import Link from "next/link";

import { InvoiceForm } from "@/components/invoices";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditInvoicePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditInvoicePageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Edit Invoice",
    description: `Edit invoice ${id}`,
  };
}

export default async function EditInvoicePage({
  params,
}: EditInvoicePageProps) {
  const { id } = await params;

  return (
    <PageContainer
      title="Edit invoice"
      description="Update customer details, dates, line items, tax, and totals for this invoice."
      actions={
        <Link
          href={`/invoices/${id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
          )}
        >
          Back to invoice
        </Link>
      }
    >
      <InvoiceForm mode="edit" invoiceId={id} />
    </PageContainer>
  );
}
