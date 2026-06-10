"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const INVOICES_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

type InvoicePaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: readonly number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
};

export function InvoicePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = INVOICES_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  className,
}: InvoicePaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={cn(
        "surface-card flex flex-col gap-4 rounded-xl px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      )}
    >
      <div className="flex items-center justify-between sm:contents">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {start}–{end}
          </span>{" "}
          of <span className="font-semibold text-foreground">{totalItems}</span>{" "}
          <span className="hidden xs:inline">invoices</span>
        </p>

        <div className="flex items-center gap-2 sm:hidden">
          <span className="text-xs text-muted-foreground">Rows</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              size="sm"
              className="h-8 min-w-14 bg-background/80 text-xs px-2"
              aria-label="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger
              size="sm"
              className="h-9 min-w-16 bg-background/80"
              aria-label="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto border-t pt-3.5 sm:border-t-0 sm:pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm shadow-sm"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </Button>
          <span className="min-w-20 text-center text-xs sm:text-sm text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="flex-1 sm:flex-none h-8 sm:h-9 text-xs sm:text-sm shadow-sm"
          >
            Next
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
