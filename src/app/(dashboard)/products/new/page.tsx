import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ProductForm } from "@/components/products/product-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Create a new product catalog item",
};

export default function NewProductPage() {
  return (
    <PageContainer
      title="Add product"
      description="Add a new item to your catalog with SKU, pricing, and initial inventory details."
      actions={
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs")}
        >
          Back to list
        </Link>
      }
    >
      <div className="mx-auto max-w-xl">
        <ProductForm mode="create" />
      </div>
    </PageContainer>
  );
}
