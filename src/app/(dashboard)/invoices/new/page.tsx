import type { Metadata } from "next";
import Link from "next/link";

import { InvoiceForm } from "@/components/invoices";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Create Invoice",
  description: "Build a new invoice with line items and automatic totals",
};

export default function NewInvoicePage() {
  return (
    <PageContainer
      title="Create invoice"
      description="Build a professional invoice with customer details, line items, and automatic tax calculations."
      actions={
        <Link
          href="/invoices"
          className={cn(buttonVariants({ variant: "outline", size: "default" }))}
        >
          Back to invoices
        </Link>
      }
    >
      <InvoiceForm />
    </PageContainer>
  );
}
