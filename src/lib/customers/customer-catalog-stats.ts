import { format } from "date-fns";

export function formatCustomerDateRangeLabel(
  from?: Date,
  to?: Date,
): string | null {
  if (!from || !to) {
    return null;
  }

  return `${format(from, "dd MMM yyyy")} – ${format(to, "dd MMM yyyy")}`;
}
