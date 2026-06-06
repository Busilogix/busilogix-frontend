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
          "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
          toneClasses[tone],
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex min-w-0 items-start gap-3 rounded-xl border p-3 text-left transition-colors",
          isActive
            ? "border-primary/30 bg-primary/5 shadow-sm"
            : "border-transparent bg-muted/20 hover:border-border hover:bg-muted/40",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-transparent bg-muted/20 p-3">
      {content}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <Card className="surface-card overflow-hidden rounded-xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-14 w-28 rounded-xl" />
        </div>
        <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
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

  const headlineValue = isFiltered
    ? matchingCount.toLocaleString()
    : catalog.total.toLocaleString();

  const headlineTitle = isFiltered ? "Matching customers" : "Customer base";
  const headlineDescription = isFiltered
    ? [search.trim() ? `Search: “${search.trim()}”` : null, dateRangeLabel]
        .filter(Boolean)
        .join(" · ") || "Filters applied to your customer list"
    : "Customers saved in your workspace";

  const hasDateFilter = hasDateRangeFilter(dateRange);

  return (
    <Card className="surface-card overflow-hidden rounded-xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                {isFiltered ? (
                  <Search className="size-4" aria-hidden />
                ) : (
                  <UsersRound className="size-4" aria-hidden />
                )}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {isFiltered ? "Filtered customer view" : "Customer snapshot"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {headlineDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">
                {headlineTitle}
              </p>
              <p className="text-3xl font-bold tabular-nums leading-none text-foreground">
                {headlineValue}
              </p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-lg bg-background text-primary shadow-sm ring-1 ring-border/60">
              <Users className="size-5" aria-hidden />
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2 xl:grid-cols-4">
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
