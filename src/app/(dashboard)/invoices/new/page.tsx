import type { Metadata } from "next";
import Link from "next/link";

import { InvoiceForm } from "@/components/invoices";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Quick Bill",
  description:
    "Fast POS-style billing with SKU scan, cart, and one-click checkout",
  openGraph: {
    ...sharedOpenGraph,
    title: "Quick Bill | Busilogix",
    description:
      "Fast POS-style billing with SKU scan, cart, and one-click checkout",
    url: "/invoices/new",
  },
  twitter: {
    ...sharedTwitter,
    title: "Quick Bill | Busilogix",
    description:
      "Fast POS-style billing with SKU scan, cart, and one-click checkout",
  },
};

export default function NewInvoicePage() {
  return (
    <PageContainer
      title="Quick bill"
      description="Enter mobile, scan SKU or search products, and bill in seconds. Tax defaults are remembered."
      actions={
        <Link
          href="/invoices"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
          )}
        >
          Back to invoices
        </Link>
      }
    >
      <InvoiceForm />
    </PageContainer>
  );
}
