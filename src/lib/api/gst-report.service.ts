import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type { GstReportData, GstReportParams } from "./types/gst-report.types";
import { parseAuthResponse } from "./utils/auth-response";

const GST_REPORT_BASE = "/reporting/gst";

class GstReportService {
  async getGstReport(params: GstReportParams): Promise<GstReportData> {
    const response = await apiClient.get<BackendEnvelope<GstReportData>>(
      GST_REPORT_BASE,
      { params },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("GST report response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async exportGstReport(params: GstReportParams & { format: "CSV" | "PDF" }): Promise<Blob> {
    const response = await apiClient.get(
      `${GST_REPORT_BASE}/export`,
      {
        params,
        responseType: "blob",
      },
    );
    return response.data;
  }
}

export const gstReportService = new GstReportService();
