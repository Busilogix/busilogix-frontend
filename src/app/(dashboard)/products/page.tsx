import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { ProductsList } from "@/components/products/products-list";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your product catalog and pricing",
  openGraph: {
    ...sharedOpenGraph,
    title: "Products | Busilogix",
    description: "Manage your product catalog and pricing",
    url: "/products",
  },
  twitter: {
    ...sharedTwitter,
    title: "Products | Busilogix",
    description: "Manage your product catalog and pricing",
  },
};

export default function ProductsPage() {
  return (
    <PageContainer>
      <ProductsList />
    </PageContainer>
  );
}
