"use client";

import {
  CalendarDays,
  CalendarPlus,
  Search,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CustomerCatalogStats } from "@/lib/api/types/customer.types";
import { formatCustomerDateRangeLabel } from "@/lib/customers/customer-catalog-stats";
import { hasDateRangeFilter } from "@/lib/customers/date-range";
import { cn } from "@/lib/utils";

export type CustomerDatePreset = "all" | "year" | "month" | "week";

type CustomersOverviewCardsProps = {
  stats: CustomerCatalogStats | null;
  isStatsLoading: boolean;
  isFiltered: boolean;
  matchingCount: number;
  search: string;
  dateRange?: DateRange;
  activeDatePreset: CustomerDatePreset;
  onDatePresetChange?: (preset: CustomerDatePreset) => void;
};

type SnapshotStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone?: "default" | "blue" | "emerald" | "violet";
  onClick?: () => void;
  isActive?: boolean;
};

function SnapshotStat({
  icon,
  label,
  value,
  description,
  tone = "default",
  onClick,
  isActive,
}: SnapshotStatProps) {
  const toneClasses = {
    default: "bg-muted text-muted-foreground",
    blue: "bg-blue-500/10 text-blue-600 ring-blue-500/15",
    emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15",
    violet: "bg-violet-500/10 text-violet-600 ring-violet-500/15",
  };

  const content = (
    <>
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 sm:size-9 *:[svg]:size-3.5 sm:*:[svg]:size-4",
          toneClasses[tone],
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium text-muted-foreground sm:text-xs">{label}</p>
        <p className="mt-0.5 text-base font-bold tabular-nums tracking-tight text-foreground sm:text-2xl">
          {value}
        </p>
        <p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
          {description}
        </p>
      </div>
    </>
  );

  const cardClasses = cn(
    "flex min-w-0 items-start gap-2 rounded-xl border py-1.5 px-2 text-left transition-colors sm:gap-3 sm:p-3",
    isActive
      ? "border-primary/30 bg-primary/5 shadow-sm"
      : "border-transparent bg-muted/20 hover:border-border hover:bg-muted/40",
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClasses}>
        {content}
      </button>
    );
  }

  return (
    <div className={cn(cardClasses, "hover:border-transparent hover:bg-muted/20")}>
      {content}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <Card className="surface-card overflow-hidden rounded-xl py-2.5 sm:py-4">
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32 sm:h-7 sm:w-40" />
            <Skeleton className="h-3 w-48 sm:h-4 sm:w-56" />
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t pt-3.5 sm:mt-5 sm:gap-3 sm:pt-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl sm:h-24" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomersOverviewCards({
  stats,
  isStatsLoading,
  isFiltered,
  matchingCount,
  search,
  dateRange,
  activeDatePreset,
  onDatePresetChange,
}: CustomersOverviewCardsProps) {
  if (isStatsLoading && !stats) {
    return <OverviewSkeleton />;
  }

  const catalog = stats ?? {
    total: 0,
    addedThisYear: 0,
    addedThisMonth: 0,
    addedThisWeek: 0,
  };

  const dateRangeLabel = formatCustomerDateRangeLabel(
    dateRange?.from,
    dateRange?.to,
  );

  const headlineDescription = isFiltered
    ? [search.trim() ? `Search: “${search.trim()}”` : null, dateRangeLabel]
        .filter(Boolean)
        .join(" · ") || "Filters applied to your customer list"
    : "Customers saved in your workspace";

  const hasDateFilter = hasDateRangeFilter(dateRange);

  return (
    <Card className="surface-card overflow-hidden rounded-xl py-2.5 sm:py-4">
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 sm:size-10">
                {isFiltered ? (
                  <Search className="size-3.5 sm:size-4" aria-hidden />
                ) : (
                  <UsersRound className="size-3.5 sm:size-4" aria-hidden />
                )}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-xl">
                  {isFiltered ? "Filtered customer view" : "Customer snapshot"}
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {headlineDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t pt-3.5 sm:mt-5 sm:gap-3 sm:pt-5 lg:grid-cols-4">
          <SnapshotStat
            icon={<Users className="size-4" aria-hidden />}
            label="Total customers"
            value={catalog.total.toLocaleString()}
            description="All contacts in your account"
            onClick={
              onDatePresetChange ? () => onDatePresetChange("all") : undefined
            }
            isActive={
              activeDatePreset === "all" && !search.trim() && !hasDateFilter
            }
          />
          <SnapshotStat
            icon={<CalendarDays className="size-4" aria-hidden />}
            label="Added this year"
            value={catalog.addedThisYear.toLocaleString()}
            description="New customers since January"
            tone="blue"
            onClick={
              onDatePresetChange ? () => onDatePresetChange("year") : undefined
            }
            isActive={activeDatePreset === "year" && hasDateFilter}
          />
          <SnapshotStat
            icon={<CalendarPlus className="size-4" aria-hidden />}
            label="Added this month"
            value={catalog.addedThisMonth.toLocaleString()}
            description="New customers since month start"
            tone="emerald"
            onClick={
              onDatePresetChange ? () => onDatePresetChange("month") : undefined
            }
            isActive={activeDatePreset === "month" && hasDateFilter}
          />
          <SnapshotStat
            icon={<UserPlus className="size-4" aria-hidden />}
            label="Added this week"
            value={catalog.addedThisWeek.toLocaleString()}
            description="New customers in the last 7 days"
            tone="violet"
            onClick={
              onDatePresetChange ? () => onDatePresetChange("week") : undefined
            }
            isActive={activeDatePreset === "week" && hasDateFilter}
          />
        </div>
      </CardContent>
    </Card>
  );
}
