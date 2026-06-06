import type { AxiosError } from "axios";

import type { ApiErrorBody, ApiMeta } from "./types/api.types";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly meta?: ApiMeta;

  constructor(
    message: string,
    options: {
      statusCode: number;
      errorCode: string;
      meta?: ApiMeta;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.statusCode = options.statusCode;
    this.errorCode = options.errorCode;
    this.meta = options.meta;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type BackendErrorBody = {
  message?: string;
};

export function normalizeAxiosError(error: AxiosError<ApiErrorBody>): ApiError {
  const statusCode = error.response?.status ?? 0;
  const body = error.response?.data;
  const meta = body?.meta;
  const backendMessage = (body as BackendErrorBody | undefined)?.message;

  const message =
    meta?.message ??
    backendMessage ??
    error.message ??
    "An unexpected error occurred. Please try again.";

  const errorCode = meta?.errorCode ?? mapStatusToErrorCode(statusCode);

  return new ApiError(message, {
    statusCode,
    errorCode,
    meta,
    cause: error,
  });
}

function mapStatusToErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMITED";
    case 503:
      return "SERVICE_UNAVAILABLE";
    default:
      return statusCode >= 500 ? "INTERNAL_ERROR" : "UNKNOWN_ERROR";
  }
}
