"use client";

import { ListPageHeader } from "@/components/layout/list-page-header";
import type { CustomerCatalogStats } from "@/lib/api/types/customer.types";
import type { DateRange } from "react-day-picker";

import {
  CustomersOverviewCards,
  type CustomerDatePreset,
} from "./customers-overview-cards";

type CustomersPageHeaderProps = {
  stats: CustomerCatalogStats | null;
  isStatsLoading: boolean;
  isFiltered: boolean;
  matchingCount: number;
  search: string;
  dateRange?: DateRange;
  activeDatePreset: CustomerDatePreset;
  onDatePresetChange: (preset: CustomerDatePreset) => void;
};

export function CustomersPageHeader({
  stats,
  isStatsLoading,
  isFiltered,
  matchingCount,
  search,
  dateRange,
  activeDatePreset,
  onDatePresetChange,
}: CustomersPageHeaderProps) {
  return (
    <div className="space-y-4">
      <ListPageHeader
        title="Customers"
        description="Manage contact, billing, and tax details so invoices stay accurate and easy to send."
      />
      <CustomersOverviewCards
        stats={stats}
        isStatsLoading={isStatsLoading}
        isFiltered={isFiltered}
        matchingCount={matchingCount}
        search={search}
        dateRange={dateRange}
        activeDatePreset={activeDatePreset}
        onDatePresetChange={onDatePresetChange}
      />
    </div>
  );
}
