import type { Metadata } from "next";
import Link from "next/link";

import { InvoiceForm } from "@/components/invoices";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

type EditInvoicePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditInvoicePageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Edit Invoice #${id}`;
  const description = `Update details, items, tax, and totals for invoice ${id}.`;

  return {
    title,
    description,
    openGraph: {
      ...sharedOpenGraph,
      title: `${title} | Busilogix`,
      description,
      url: `/invoices/${id}/edit`,
    },
    twitter: {
      ...sharedTwitter,
      title: `${title} | Busilogix`,
      description,
    },
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
