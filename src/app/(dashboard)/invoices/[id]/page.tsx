import type { Metadata } from "next";
import Link from "next/link";

import { InvoiceDetailView } from "@/components/invoices/invoice-detail-view";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InvoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Invoice",
    description: `Invoice ${id} details`,
  };
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;

  return (
    <PageContainer>
      <InvoiceDetailView invoiceId={id} />
    </PageContainer>
  );
}
