import type { Metadata } from "next";
import Link from "next/link";

import { InvoiceDetailView } from "@/components/invoices/invoice-detail-view";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

type InvoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Invoice #${id}`;
  const description = `Detailed billing statement and status for Invoice ${id}.`;

  return {
    title,
    description,
    openGraph: {
      ...sharedOpenGraph,
      title: `${title} | Busilogix`,
      description,
      url: `/invoices/${id}`,
    },
    twitter: {
      ...sharedTwitter,
      title: `${title} | Busilogix`,
      description,
    },
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
