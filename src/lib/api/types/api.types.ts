export type ApiResultStatus = "success" | "error";

export type ApiMeta = {
  status: ApiResultStatus;
  code?: number;
  message?: string;
  errorCode?: string;
  correlationId?: string;
};

export type ApiResponse<T> = {
  meta: ApiMeta;
  data: T;
};

export type ApiErrorBody = {
  meta: ApiMeta;
  data: null;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedApiResponse<T> = {
  meta: ApiMeta & { pagination: PaginationMeta };
  data: T[];
};

export type ListQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
