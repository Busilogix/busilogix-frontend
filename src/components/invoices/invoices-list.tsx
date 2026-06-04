"use client";

import { Download, FileText, Filter, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  duplicateInvoice,
  INVOICES_PAGE_SIZE,
  INVOICE_STATUS_OPTIONS,
  queryInvoices,
  updateInvoiceStatus,
} from "@/lib/invoices/mock-store";
import type {
  InvoiceListRecord,
  InvoiceStatusFilter,
} from "@/lib/invoices/types";
import { downloadCsv } from "@/lib/export/csv";

import { InvoicePagination } from "./invoice-pagination";
import { InvoicesTable, type InvoiceAction } from "./invoices-table";
import { InvoicesTableSkeleton } from "./invoices-table-skeleton";

const LOAD_DELAY_MS = 700;
const ACTION_DELAY_MS = 900;

type ActionFeedback = {
  type: "success" | "error";
  title: string;
  message: string;
};

export function InvoicesList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(
    null,
  );
  const [result, setResult] = useState(() =>
    queryInvoices({
      search: "",
      status: "all",
      page: 1,
      pageSize: INVOICES_PAGE_SIZE,
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const fetchInvoices = useCallback(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setResult(
        queryInvoices({
          search: debouncedSearch,
          status: statusFilter,
          page,
          pageSize: INVOICES_PAGE_SIZE,
        }),
      );
      setIsLoading(false);
    }, LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    const cleanup = fetchInvoices();
    return cleanup;
  }, [fetchInvoices]);

  const hasActiveFilters = debouncedSearch.length > 0 || statusFilter !== "all";
  const hasInvoices = result.totalItems > 0;
  const isEmptyFiltered = hasActiveFilters && !hasInvoices;
  const isEmptyAll = !hasActiveFilters && !hasInvoices;

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  function refreshInvoices() {
    setResult(
      queryInvoices({
        search: debouncedSearch,
        status: statusFilter,
        page,
        pageSize: INVOICES_PAGE_SIZE,
      }),
    );
  }

  function handleExportInvoices() {
    downloadCsv(
      "busilogix-invoices.csv",
      result.items.map((invoice) => ({
        invoice_number: invoice.invoice_number,
        customer_name: invoice.customer_name,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        amount: invoice.total_amount,
        status: invoice.status,
      })),
    );
  }

  async function handleAction(
    action: InvoiceAction,
    invoice: InvoiceListRecord,
  ) {
    if (action === "view") {
      router.push(`/invoices/${invoice.id}`);
      return;
    }

    setActionFeedback(null);
    setPendingActionId(invoice.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, ACTION_DELAY_MS));

      if (action === "mark-paid") {
        updateInvoiceStatus(invoice.id, "paid");
        refreshInvoices();
        setActionFeedback({
          type: "success",
          title: "Invoice marked as paid",
          message: `${invoice.invoice_number} is now included in total revenue.`,
        });
        return;
      }

      if (action === "duplicate") {
        const copy = duplicateInvoice(invoice.id);
        refreshInvoices();
        setActionFeedback({
          type: copy ? "success" : "error",
          title: copy ? "Invoice duplicated" : "Duplicate failed",
          message: copy
            ? `${invoice.invoice_number} was copied as ${copy.invoice_number}.`
            : "Unable to duplicate this invoice. Please try again.",
        });
        return;
      }

      const messages: Record<
        Exclude<InvoiceAction, "view" | "mark-paid" | "duplicate">,
        ActionFeedback
      > = {
        download: {
          type: "success",
          title: "PDF download",
          message: `${invoice.invoice_number}.pdf — download will start here when PDF generation is connected.`,
        },
        email: {
          type: "success",
          title: "Email sent (preview)",
          message: `Invoice ${invoice.invoice_number} would be emailed to ${invoice.customer_name}. API integration pending.`,
        },
      };

      setActionFeedback(messages[action]);
    } catch {
      setActionFeedback({
        type: "error",
        title: "Action failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setPendingActionId(null);
    }
  }

  return (
    <div className="space-y-6">
      {actionFeedback ? (
        <FormMessage
          type={actionFeedback.type}
          title={actionFeedback.title}
          message={actionFeedback.message}
        />
      ) : null}

      <div className="surface-card flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:flex-initial">
          <div className="space-y-2">
            <p className="text-sm font-medium">Find an invoice</p>
            <div className="relative flex-1 sm:w-80">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                placeholder="Search invoice # or customer..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 bg-background/80 pl-9"
                aria-label="Search invoices"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Filter status</p>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as InvoiceStatusFilter)
              }
            >
              <SelectTrigger
                className="h-10 w-full bg-background/80 sm:w-44"
                aria-label="Filter by status"
              >
                <Filter className="size-4 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {INVOICE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="shrink-0"
            >
              <X className="size-4" aria-hidden />
              Clear filters
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleExportInvoices}
            disabled={!hasInvoices}
            className="shrink-0"
          >
            <Download className="size-4" aria-hidden />
            Export CSV
          </Button>
          <Button
            render={<Link href="/invoices/new" />}
            className="shrink-0 shadow-sm"
          >
            <Plus className="size-4" aria-hidden />
            Create invoice
          </Button>
        </div>
      </div>

      {isLoading ? (
        <InvoicesTableSkeleton />
      ) : isEmptyAll ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments and sending bills to customers."
        />
      ) : isEmptyFiltered ? (
        <EmptyState
          icon={Search}
          title="No matching invoices"
          description="Try adjusting your search or status filter to find what you're looking for."
          action={{
            label: "Clear filters",
            onClick: clearFilters,
          }}
        />
      ) : (
        <>
          <InvoicesTable
            invoices={result.items}
            onAction={handleAction}
            pendingActionId={pendingActionId}
          />
          <InvoicePagination
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
