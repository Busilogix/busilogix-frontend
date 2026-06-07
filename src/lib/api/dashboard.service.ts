import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type { ApiDashboardData } from "./types/dashboard.types";
import { parseAuthResponse } from "./utils/auth-response";

const DASHBOARD_BASE = "/reporting/dashboard";

class DashboardService {
  async getDashboardData(): Promise<ApiDashboardData> {
    const response = await apiClient.get<BackendEnvelope<ApiDashboardData>>(
      DASHBOARD_BASE,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Dashboard response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }
}

export const dashboardService = new DashboardService();
