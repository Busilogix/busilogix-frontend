import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { ProductsList } from "@/components/products/products-list";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your product catalog and pricing",
};

export default function ProductsPage() {
  return (
    <PageContainer>
      <ProductsList />
    </PageContainer>
  );
}
