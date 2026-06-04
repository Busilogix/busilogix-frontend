import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ProductForm } from "@/components/products/product-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Edit Product",
    description: `Edit product ${id}`,
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  return (
    <PageContainer
      title="Edit product"
      description="Update product description, catalog pricing, and inventory parameters."
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
        <ProductForm mode="edit" productId={id} />
      </div>
    </PageContainer>
  );
}
