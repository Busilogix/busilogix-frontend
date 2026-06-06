import type { CustomerListParams } from "../types/customer.types";

export function buildCustomerListQuery(
  params: CustomerListParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  if (params.page !== undefined) {
    query.page = params.page;
  }

  if (params.size !== undefined) {
    query.size = params.size;
  }

  const search = params.search?.trim();
  if (search) {
    query.search = search;
  }

  if (params.startDate) {
    query.startDate = params.startDate;
  }

  if (params.endDate) {
    query.endDate = params.endDate;
  }

  return query;
}
