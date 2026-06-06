import { apiClient } from "./api";
import type { BackendEnvelope } from "./types/auth.types";
import { ApiError } from "./errors";
import type {
  ApiStore,
  CreateStoreRequest,
  StoreMutationResponse,
  UpdatePaymentInfoRequest,
  UpdateStoreRequest,
} from "./types/store.types";
import { parseAuthResponse } from "./utils/auth-response";

const STORES_BASE = "/stores";

class StoreService {
  async getMe(): Promise<ApiStore> {
    const response = await apiClient.get<BackendEnvelope<ApiStore>>(
      `${STORES_BASE}/me`,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Store response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async create(payload: CreateStoreRequest): Promise<StoreMutationResponse> {
    const response = await apiClient.post<BackendEnvelope>(
      `${STORES_BASE}/create`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async update(payload: UpdateStoreRequest): Promise<StoreMutationResponse> {
    const response = await apiClient.put<BackendEnvelope>(
      `${STORES_BASE}/update`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async updatePaymentInfo(
    payload: UpdatePaymentInfoRequest,
  ): Promise<StoreMutationResponse> {
    const response = await apiClient.put<BackendEnvelope>(
      `${STORES_BASE}/payment-info`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }
}

export const storeService = new StoreService();
