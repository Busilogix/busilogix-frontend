import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { InventoryView } from "@/components/inventory/inventory-view";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Track stock levels and stock adjustments logs",
};

export default function InventoryPage() {
  return (
    <PageContainer>
      <InventoryView />
    </PageContainer>
  );
}
