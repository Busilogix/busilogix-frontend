import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ProductForm } from "@/components/products/product-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = `Edit Product #${id}`;
  const description = `Update details, SKU, pricing, and settings for product ${id}.`;

  return {
    title,
    description,
    openGraph: {
      ...sharedOpenGraph,
      title: `${title} | Busilogix`,
      description,
      url: `/products/${id}/edit`,
    },
    twitter: {
      ...sharedTwitter,
      title: `${title} | Busilogix`,
      description,
    },
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
