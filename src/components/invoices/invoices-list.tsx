"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { ListPageHeader } from "@/components/layout/list-page-header";
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
import { formatCurrency } from "@/lib/invoices/format";
import {
  duplicateInvoice,
  getInvoiceStats,
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

const LOAD_DELAY_MS = 500;
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
  const [stats, setStats] = useState(() => getInvoiceStats());
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
      setStats(getInvoiceStats());
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

  const exportRows = useMemo(
    () =>
      queryInvoices({
        search: debouncedSearch,
        status: statusFilter,
        page: 1,
        pageSize: result.totalItems || INVOICES_PAGE_SIZE,
      }).items,
    [debouncedSearch, statusFilter, result.totalItems],
  );

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
    setStats(getInvoiceStats());
  }

  function handleExportInvoices() {
    downloadCsv(
      "busilogix-invoices.csv",
      exportRows.map((invoice) => ({
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
      <ListPageHeader
        title="Invoices"
        description="Create, review, send, and track invoices from one billing workspace."
        action={{
          label: "Create invoice",
          href: "/invoices/new",
          icon: Plus,
        }}
        metrics={[
          {
            title: "Total invoices",
            value: stats.total.toLocaleString(),
            description: "All billing records",
            icon: FileText,
            tone: "violet",
          },
          {
            title: "Paid invoices",
            value: stats.paidCount.toLocaleString(),
            description: "Included in revenue",
            icon: CheckCircle2,
            tone: "emerald",
          },
          {
            title: hasActiveFilters ? "Matching results" : "Outstanding",
            value: hasActiveFilters
              ? result.totalItems.toLocaleString()
              : formatCurrency(stats.pendingAmount, stats.currency),
            description: hasActiveFilters
              ? "Invoices matching filters"
              : "Sent and overdue balances",
            icon: hasActiveFilters ? Filter : AlertCircle,
            tone: "amber",
          },
        ]}
      />

      {actionFeedback ? (
        <FormMessage
          type={actionFeedback.type}
          title={actionFeedback.title}
          message={actionFeedback.message}
        />
      ) : null}

      <div className="surface-card rounded-xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
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
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as InvoiceStatusFilter)
            }
          >
            <SelectTrigger
              className="h-10 w-full bg-background/80 lg:w-44"
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
          <div className="flex flex-wrap items-center gap-2">
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-4" aria-hidden />
                Clear
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportInvoices}
              disabled={!hasInvoices}
            >
              <Download className="size-4" aria-hidden />
              Export CSV
            </Button>
            <Button
              size="sm"
              render={<Link href="/invoices/new" />}
              className="shadow-sm"
            >
              <Plus className="size-4" aria-hidden />
              Create invoice
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <InvoicesTableSkeleton />
      ) : isEmptyAll ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments and sending bills to customers."
          action={{ label: "Create invoice", href: "/invoices/new" }}
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
        <div className="space-y-4">
          <InvoicesTable
            invoices={result.items}
            totalItems={result.totalItems}
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
        </div>
      )}
    </div>
  );
}
