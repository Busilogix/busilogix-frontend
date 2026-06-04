import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { apiConfig } from "./config";
import { normalizeAxiosError } from "./errors";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token-storage";
import type { ApiErrorBody, ApiResponse } from "./types/api.types";
import type { RefreshTokenResponse } from "./types/auth.types";
import { mapTokenResponse } from "./utils/tokens";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

function attachAccessToken(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
      `${apiConfig.baseURL}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: apiConfig.headers,
        timeout: apiConfig.timeoutMs,
      },
    );

    const tokens = mapTokenResponse(response.data.data);
    setTokens(tokens);
    return tokens.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

function queueTokenRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeoutMs,
    headers: apiConfig.headers,
  });

  client.interceptors.request.use(
    (config) => attachAccessToken(config),
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorBody>) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;
      const isUnauthorized = error.response?.status === 401;
      const isRefreshEndpoint = originalRequest?.url?.includes("/auth/refresh");

      if (
        isUnauthorized &&
        originalRequest &&
        !originalRequest._retry &&
        !isRefreshEndpoint
      ) {
        originalRequest._retry = true;

        const newAccessToken = await queueTokenRefresh();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        }
      }

      return Promise.reject(normalizeAxiosError(error));
    },
  );

  return client;
}

export const apiClient = createApiClient();

export { apiConfig };
