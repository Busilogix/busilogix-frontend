"use client";

import {
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

import { toast } from "sonner";
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
const INVOICES_PAGE_SIZE = 10;

const INVOICE_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;
import type {
  InvoiceListRecord,
  InvoiceStatusFilter,
} from "@/lib/invoices/types";
import { invoiceService } from "@/lib/api/invoice.service";
import { downloadCsv } from "@/lib/export/csv";
import { triggerFileDownload } from "@/lib/utils";

import { InvoicePagination } from "./invoice-pagination";
import { InvoicesTable, type InvoiceAction } from "./invoices-table";
import { InvoicesTableSkeleton } from "./invoices-table-skeleton";

const LOAD_DELAY_MS = 500;
const ACTION_DELAY_MS = 900;

// ActionFeedback type removed; using Sonner toast

export function InvoicesList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(INVOICES_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    items: InvoiceListRecord[];
    totalItems: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>(() => ({
    items: [],
    totalItems: 0,
    totalPages: 1,
    page: 1,
    pageSize: INVOICES_PAGE_SIZE,
  }));

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

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

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiStatus = statusFilter === "all" ? undefined : (statusFilter as any);
      const res = await invoiceService.list({
        search: debouncedSearch || undefined,
        status: apiStatus,
        page,
        size: pageSize,
      });

      const mappedItems: InvoiceListRecord[] = res.items.map((inv) => {
        const status = inv.status as any;

        return {
          id: inv.id,
          invoice_number: inv.invoiceNumber,
          customer_id: inv.customer?.id || "",
          customer_name: inv.customer?.name || "Walk-in Customer",
          status,
          issue_date: inv.createdAt,
          due_date: inv.createdAt,
          currency: "INR",
          total_amount: inv.netAmount,
          created_at: inv.createdAt,
          updated_at: inv.createdAt,
        };
      });

      setResult({
        items: mappedItems,
        totalItems: res.totalItems,
        totalPages: res.totalPages,
        page: res.page,
        pageSize: res.pageSize,
      });
    } catch (err) {
      console.error("Failed to fetch invoices from backend:", err);
      toast.error("Failed to fetch invoices from server.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, page, pageSize]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const hasActiveFilters = debouncedSearch.length > 0 || statusFilter !== "all";
  const hasInvoices = result.totalItems > 0;
  const isEmptyFiltered = hasActiveFilters && !hasInvoices;
  const isEmptyAll = !hasActiveFilters && !hasInvoices;

  const exportRows = result.items;

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  function refreshInvoices() {
    void fetchInvoices();
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

  async function performMarkPaid(invoice: InvoiceListRecord) {
    await invoiceService.update(invoice.id, { status: "PAID" });
    refreshInvoices();
    toast.success("Invoice marked as paid", { description: `${invoice.invoice_number} is now included in total revenue.` });
  }

  async function performDownloadPdf(invoice: InvoiceListRecord) {
    const blob = await invoiceService.downloadPdf(invoice.id);
    triggerFileDownload(blob, `${invoice.invoice_number}.pdf`);
    toast.success("PDF downloaded", { description: `${invoice.invoice_number}.pdf downloaded successfully.` });
  }

  function performDuplicate() {
    toast.error("Duplicate failed", { description: "Duplication is not supported." });
  }

  async function performEmailInvoice(invoice: InvoiceListRecord) {
    await invoiceService.send(invoice.id);
    toast.success("Email sent successfully", {
      description: `Invoice ${invoice.invoice_number} has been emailed to ${invoice.customer_name}.`,
    });
  }

  async function handleAction(
    action: InvoiceAction,
    invoice: InvoiceListRecord,
  ) {
    if (action === "view") {
      router.push(`/invoices/${invoice.id}`);
      return;
    }

    setPendingActionId(invoice.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, ACTION_DELAY_MS));

      switch (action) {
        case "mark-paid":
          await performMarkPaid(invoice);
          break;
        case "download":
          await performDownloadPdf(invoice);
          break;
        case "duplicate":
          performDuplicate();
          break;
        case "email":
          await performEmailInvoice(invoice);
          break;
      }
    } catch (err: unknown) {
      console.error(`Action ${action} failed:`, err);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Action failed", {
        description: msg,
      });
    } finally {
      setPendingActionId(null);
    }
  }

  const headerActions = (
    <>
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
    </>
  );

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Invoices"
        description="Create, review, send, and track invoices from one billing workspace."
        actions={headerActions}
      />

      {/* Toast notifications are displayed via Sonner; no UI block needed here */}

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
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
