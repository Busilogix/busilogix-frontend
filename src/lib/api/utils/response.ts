import type { AxiosResponse } from "axios";

import { ApiError } from "../errors";
import type { ApiResponse } from "../types/api.types";

export function unwrapApiResponse<T>(
  response: AxiosResponse<ApiResponse<T>>,
): T {
  const { meta, data } = response.data;

  if (meta.status === "error") {
    throw new ApiError(meta.message ?? "Request failed", {
      statusCode: meta.code ?? response.status,
      errorCode: meta.errorCode ?? "API_ERROR",
      meta,
    });
  }

  return data;
}
