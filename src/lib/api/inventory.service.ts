import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type {
  InventoryLogListPage,
  InventoryLogListParams,
  InventoryLogListResult,
  InventorySummaryData,
} from "./types/inventory.types";
import { parseAuthResponse } from "./utils/auth-response";

const INVENTORY_BASE = "/inventory";

class InventoryService {
  async getLogs(params: InventoryLogListParams = {}): Promise<InventoryLogListResult> {
    const page = params.page ? params.page - 1 : 0; // Backend is 0-indexed
    const size = params.size ?? 50;

    const response = await apiClient.get<BackendEnvelope<InventoryLogListPage>>(
      `${INVENTORY_BASE}/logs`,
      {
        params: {
          page,
          size,
        },
      },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Inventory logs response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return {
      items: data.content,
      page: data.page + 1,
      pageSize: data.size,
      totalItems: data.totalElements,
      totalPages: Math.max(1, data.totalPages),
      hasNext: data.hasNext,
      hasPrevious: data.hasPrevious,
    };
  }

  async getSummary(): Promise<InventorySummaryData> {
    const response = await apiClient.get<BackendEnvelope<InventorySummaryData>>(
      `${INVENTORY_BASE}/summary`,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Inventory summary response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }
}

export const inventoryService = new InventoryService();
