import { apiClient } from "./api";
import { clearTokens, setTokens } from "./token-storage";
import type { ApiResponse } from "./types/api.types";
import type {
  AuthUser,
  BackendEnvelope,
  LoginRequest,
  LoginResponse,
  LoginTokenData,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
} from "./types/auth.types";
import { parseAuthResponse } from "./utils/auth-response";
import { unwrapApiResponse } from "./utils/response";
import { mapLoginTokenData, mapTokenResponse } from "./utils/tokens";

const AUTH_BASE = "/auth";

class AuthService {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<BackendEnvelope<LoginTokenData>>(
      `${AUTH_BASE}/login`,
      payload,
    );

    const { message, data } = parseAuthResponse(response);

    if (!data?.accessToken) {
      throw new Error("Login response did not include an access token.");
    }

    setTokens(mapLoginTokenData(data));

    return { message, tokens: data };
  }

  async signup(payload: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<BackendEnvelope>(
      `${AUTH_BASE}/signup`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  logout(): void {
    clearTokens();

    void apiClient
      .post(`${AUTH_BASE}/logout`, undefined, { timeout: 3_000 })
      .catch(() => undefined);
  }

  async refreshToken(
    payload: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      `${AUTH_BASE}/refresh`,
      payload,
    );

    const data = unwrapApiResponse(response);
    setTokens(mapTokenResponse(data));
    return data;
  }

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<BackendEnvelope<AuthUser>>(
      "/users/me",
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new Error("User profile response did not include data.");
    }

    return data;
  }
}

export const authService = new AuthService();
