"use client";

import { Download, Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CUSTOMERS_PAGE_SIZE,
  deleteCustomer,
  queryCustomers,
} from "@/lib/customers/mock-store";
import type { CustomerRecord } from "@/lib/customers/types";
import { downloadCsv } from "@/lib/export/csv";

import { CustomerPagination } from "./customer-pagination";
import { CustomersTable } from "./customers-table";
import { CustomersTableSkeleton } from "./customers-table-skeleton";

const LOAD_DELAY_MS = 700;

export function CustomersList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(() =>
    queryCustomers({
      search: "",
      page: 1,
      pageSize: CUSTOMERS_PAGE_SIZE,
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchCustomers = useCallback(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setResult(
        queryCustomers({
          search: debouncedSearch,
          page,
          pageSize: CUSTOMERS_PAGE_SIZE,
        }),
      );
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [debouncedSearch, page]);

  useEffect(() => {
    const cleanup = fetchCustomers();
    return cleanup;
  }, [fetchCustomers]);

  const hasCustomers = result.totalItems > 0;
  const isEmptySearch = debouncedSearch.length > 0 && !hasCustomers;
  const isEmptyDatabase = debouncedSearch.length === 0 && !hasCustomers;

  function refreshCustomers(nextPage = page) {
    setResult(
      queryCustomers({
        search: debouncedSearch,
        page: nextPage,
        pageSize: CUSTOMERS_PAGE_SIZE,
      }),
    );
  }

  function handleDeleteCustomer(customer: CustomerRecord) {
    const confirmed = window.confirm(
      `Delete ${customer.name}? This will remove the customer from the mock list.`,
    );

    if (!confirmed) {
      return;
    }

    deleteCustomer(customer.id);
    refreshCustomers();
  }

  function handleExportCustomers() {
    downloadCsv(
      "busilogix-customers.csv",
      result.items.map((customer) => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      })),
    );
  }

  return (
    <div className="space-y-6">
      <div className="surface-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium">Find a customer</p>
          <div className="relative flex-1 sm:w-96">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 bg-background/80 pl-9"
              aria-label="Search customers"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Add customers first, then create invoices faster.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleExportCustomers}
            disabled={!hasCustomers}
          >
            <Download className="size-4" aria-hidden />
            Export CSV
          </Button>
          <Button render={<Link href="/customers/new" />} className="shadow-sm">
            <Plus className="size-4" aria-hidden />
            Add customer
          </Button>
        </div>
      </div>

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
          description={`No results for "${debouncedSearch}". Try a different search term.`}
          action={{
            label: "Clear search",
            onClick: () => setSearch(""),
          }}
        />
      ) : (
        <>
          <CustomersTable
            customers={result.items}
            onDeleteCustomer={handleDeleteCustomer}
          />
          <CustomerPagination
            page={result.page}
            totalPages={result.totalPages}
            totalItems={result.totalItems}
            pageSize={result.pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
