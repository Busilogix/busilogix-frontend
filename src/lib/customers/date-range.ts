import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export function formatDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function dateRangeToQueryParams(range?: DateRange): {
  startDate?: string;
  endDate?: string;
} {
  if (!range?.from) {
    return {};
  }

  return {
    startDate: formatDateParam(range.from),
    ...(range.to ? { endDate: formatDateParam(range.to) } : {}),
  };
}

export function hasDateRangeFilter(range?: DateRange): boolean {
  return Boolean(range?.from && range?.to);
}
