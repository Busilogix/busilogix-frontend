import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { InventoryView } from "@/components/inventory/inventory-view";
import { sharedOpenGraph, sharedTwitter } from "@/app/shared-metadata";

export const metadata: Metadata = {
  title: "Inventory Logs",
  description: "Monitor product stock adjustment ledger and real-time inventory logs",
  openGraph: {
    ...sharedOpenGraph,
    title: "Inventory Logs | Busilogix",
    description: "Monitor product stock adjustment ledger and real-time inventory logs",
    url: "/inventory",
  },
  twitter: {
    ...sharedTwitter,
    title: "Inventory Logs | Busilogix",
    description: "Monitor product stock adjustment ledger and real-time inventory logs",
  },
};

export default function InventoryPage() {
  return (
    <PageContainer>
      <InventoryView />
    </PageContainer>
  );
}
