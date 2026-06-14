import { apiClient } from "./api";
import type { BackendEnvelope } from "./types/auth.types";
import type {
  SupportMutationResponse,
  SupportRequestPayload,
} from "./types/support.types";
import { parseAuthResponse } from "./utils/auth-response";

const SUPPORT_BASE = "/support";

class SupportService {
  async submitSupportRequest(
    payload: SupportRequestPayload,
    file?: File,
  ): Promise<SupportMutationResponse> {
    const formData = new FormData();

    formData.append(
      "request",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    if (file) {
      formData.append("file", file);
    }

    const response = await apiClient.post<BackendEnvelope>(
      SUPPORT_BASE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }
}

export const supportService = new SupportService();
