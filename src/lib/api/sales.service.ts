import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type { SalesReportData, SalesReportParams } from "./types/sales.types";
import { parseAuthResponse } from "./utils/auth-response";

const SALES_REPORT_BASE = "/reporting/sales";

class SalesService {
  async getSalesReport(params: SalesReportParams): Promise<SalesReportData> {
    const response = await apiClient.get<BackendEnvelope<SalesReportData>>(
      SALES_REPORT_BASE,
      { params },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Sales report response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async exportSalesReport(params: SalesReportParams & { format: "CSV" | "PDF" }): Promise<Blob> {
    const response = await apiClient.get(
      `${SALES_REPORT_BASE}/export`,
      {
        params,
        responseType: "blob",
      },
    );
    return response.data;
  }
}

export const salesService = new SalesService();
