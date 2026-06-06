import type { AxiosResponse } from "axios";

import { ApiError } from "../errors";
import type { BackendEnvelope } from "../types/auth.types";

function isErrorStatus(status: string): boolean {
  return /^(4|5)\d{2}/.test(status);
}

export function parseAuthResponse<T>(
  response: AxiosResponse<BackendEnvelope<T>>,
): { message: string; data: T | undefined } {
  const body = response.data;

  if (isErrorStatus(body.status)) {
    throw new ApiError(body.message ?? "Request failed", {
      statusCode: response.status,
      errorCode: "API_ERROR",
    });
  }

  return {
    message: body.message,
    data: body.data,
  };
}
