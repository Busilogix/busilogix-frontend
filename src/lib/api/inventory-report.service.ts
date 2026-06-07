import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type { InventoryReportData, InventoryReportParams } from "./types/inventory-report.types";
import { parseAuthResponse } from "./utils/auth-response";

const INVENTORY_REPORT_BASE = "/reporting/inventory";

class InventoryReportService {
  async getInventoryReport(params: InventoryReportParams = {}): Promise<InventoryReportData> {
    const response = await apiClient.get<BackendEnvelope<InventoryReportData>>(
      INVENTORY_REPORT_BASE,
      { params },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Inventory report response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async exportInventoryReport(params: InventoryReportParams & { format: "CSV" | "PDF" }): Promise<Blob> {
    const response = await apiClient.get(
      `${INVENTORY_REPORT_BASE}/export`,
      {
        params,
        responseType: "blob",
      },
    );
    return response.data;
  }
}

export const inventoryReportService = new InventoryReportService();
