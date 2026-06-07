import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type { ProductReportData, ProductReportParams } from "./types/product-report.types";
import { parseAuthResponse } from "./utils/auth-response";

const PRODUCT_REPORT_BASE = "/reporting/products";

class ProductReportService {
  async getProductReport(params: ProductReportParams): Promise<ProductReportData> {
    const response = await apiClient.get<BackendEnvelope<ProductReportData>>(
      PRODUCT_REPORT_BASE,
      { params },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Product report response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async exportProductReport(params: ProductReportParams & { format: "CSV" | "PDF" }): Promise<Blob> {
    const response = await apiClient.get(
      `${PRODUCT_REPORT_BASE}/export`,
      {
        params,
        responseType: "blob",
      },
    );
    return response.data;
  }
}

export const productReportService = new ProductReportService();
