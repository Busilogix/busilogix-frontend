"use client";

import { startOfMonth, startOfYear, subDays } from "date-fns";
import { Download, Plus, Search, Users, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { FormMessage } from "@/components/auth/form-message";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { customerService } from "@/lib/api/customer.service";
import { isApiError } from "@/lib/api/errors";
import type { CustomerListResult } from "@/lib/api/types/customer.types";
import type { CustomerCatalogStats } from "@/lib/api/types/customer.types";
import { CUSTOMERS_PAGE_SIZE } from "@/lib/customers/constants";
import {
  dateRangeToQueryParams,
  hasDateRangeFilter,
} from "@/lib/customers/date-range";
import {
  getCustomerDisplayName,
  mapApiCustomerToRecord,
} from "@/lib/customers/map-api-customer";
import { downloadCsv } from "@/lib/export/csv";

import { CustomerPagination } from "./customer-pagination";
import type { CustomerDatePreset } from "./customers-overview-cards";
import { CustomersPageHeader } from "./customers-page-header";
import { CustomersTable } from "./customers-table";
import { CustomersTableSkeleton } from "./customers-table-skeleton";

const DEBOUNCE_MS = 300;

const emptyResult: CustomerListResult = {
  items: [],
  page: 1,
  pageSize: CUSTOMERS_PAGE_SIZE,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

export function CustomersList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CUSTOMERS_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [result, setResult] = useState<CustomerListResult>(emptyResult);
  const [catalogStats, setCatalogStats] = useState<CustomerCatalogStats | null>(
    null,
  );
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [datePreset, setDatePreset] = useState<CustomerDatePreset>("all");

  const dateQuery = useMemo(
    () => dateRangeToQueryParams(dateRange),
    [dateRange],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [dateRange]);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await customerService.list({
        page: page - 1,
        size: pageSize,
        search: debouncedSearch,
        ...dateQuery,
      });

      setResult(response);
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to load customers. Please try again.";
      setFetchError(message);
      setResult({ ...emptyResult, pageSize });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, dateQuery, page, pageSize]);

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  const isFiltered =
    debouncedSearch.trim().length > 0 || hasDateRangeFilter(dateRange);

  const refreshCatalogStats = useCallback(async () => {
    setIsStatsLoading(true);

    try {
      const stats = await customerService.getStats();
      setCatalogStats(stats);
    } catch {
      setCatalogStats(null);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCatalogStats();
  }, [refreshCatalogStats]);

  useEffect(() => {
    if (isFiltered) {
      return;
    }

    void refreshCatalogStats();
  }, [isFiltered, result.totalItems, refreshCatalogStats]);

  const customers = useMemo(
    () => result.items.map(mapApiCustomerToRecord),
    [result.items],
  );

  const hasCustomers = result.totalItems > 0;
  const isEmptySearch = isFiltered && !hasCustomers;
  const isEmptyDatabase = !isFiltered && !hasCustomers;

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setDateRange(undefined);
    setDatePreset("all");
    setPage(1);
  }

  function handleDatePresetChange(preset: CustomerDatePreset) {
    setDatePreset(preset);
    setSearch("");
    setDebouncedSearch("");

    if (preset === "all") {
      setDateRange(undefined);
    } else if (preset === "year") {
      setDateRange({
        from: startOfYear(new Date()),
        to: new Date(),
      });
    } else if (preset === "month") {
      setDateRange({
        from: startOfMonth(new Date()),
        to: new Date(),
      });
    } else {
      setDateRange({
        from: subDays(new Date(), 7),
        to: new Date(),
      });
    }

    setPage(1);
  }

  function handleDateRangeChange(range: DateRange | undefined) {
    setDateRange(range);

    if (!hasDateRangeFilter(range)) {
      setDatePreset("all");
    }
  }

  async function handleExportCustomers() {
    try {
      const exportResult = await customerService.list({
        page: 0,
        size: result.totalItems || pageSize,
        search: debouncedSearch,
        ...dateQuery,
      });

      const rows = exportResult.items.map(mapApiCustomerToRecord);

      downloadCsv(
        "busilogix-customers.csv",
        rows.map((customer) => ({
          name: getCustomerDisplayName(customer),
          email: customer.email,
          mobile: customer.phone,
          address: customer.address,
          created_at: customer.created_at,
        })),
      );
    } catch (error) {
      const message = isApiError(error)
        ? error.message
        : "Unable to export customers. Please try again.";
      setFetchError(message);
    }
  }

  return (
    <div className="space-y-6">
      <CustomersPageHeader
        stats={catalogStats}
        isStatsLoading={isStatsLoading}
        isFiltered={isFiltered}
        matchingCount={result.totalItems}
        search={debouncedSearch}
        dateRange={dateRange}
        activeDatePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
      />

      <div className="surface-card rounded-xl p-4 sm:p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Search & filters
        </p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search customers..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 bg-background/80 pl-9"
              aria-label="Search customers"
            />
          </div>

          <DateRangePicker
            id="customer-date-range"
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Dates"
          />

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {isFiltered ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-4" aria-hidden />
                Clear
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleExportCustomers()}
              disabled={!hasCustomers || isLoading}
            >
              <Download className="size-4" aria-hidden />
              Export CSV
            </Button>
            <Button
              size="sm"
              render={<Link href="/customers/new" />}
              className="shadow-sm"
            >
              <Plus className="size-4" aria-hidden />
              Add customer
            </Button>
          </div>
        </div>
      </div>

      {fetchError ? (
        <FormMessage
          type="error"
          title="Unable to load customers"
          message={fetchError}
        />
      ) : null}

      {isLoading ? (
        <CustomersTableSkeleton />
      ) : isEmptyDatabase ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start creating invoices and tracking billing."
          action={{ label: "Add customer", href: "/customers/new" }}
        />
      ) : isEmptySearch ? (
        <EmptyState
          icon={Search}
          title="No matching customers"
          description="No results match your current filters. Try adjusting search or date range."
          action={{
            label: "Clear filters",
            onClick: clearFilters,
          }}
        />
      ) : (
        <div className="space-y-4">
          <CustomersTable
            customers={customers}
            totalItems={result.totalItems}
          />
          <CustomerPagination
            page={result.page}
            totalPages={result.totalPages}
            totalItems={result.totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
