import { apiClient } from "./api";
import { clearTokens, setTokens } from "./token-storage";
import type { ApiResponse } from "./types/api.types";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
} from "./types/auth.types";
import { unwrapApiResponse } from "./utils/response";
import { mapTokenResponse } from "./utils/tokens";

const AUTH_BASE = "/auth";

class AuthService {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      `${AUTH_BASE}/login`,
      payload,
    );

    const data = unwrapApiResponse(response);
    setTokens(mapTokenResponse(data.tokens));
    return data;
  }

  async signup(payload: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<ApiResponse<SignupResponse>>(
      `${AUTH_BASE}/signup`,
      payload,
    );

    const data = unwrapApiResponse(response);
    setTokens(mapTokenResponse(data.tokens));
    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${AUTH_BASE}/logout`);
    } finally {
      clearTokens();
    }
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
    const response = await apiClient.get<ApiResponse<AuthUser>>(
      `${AUTH_BASE}/me`,
    );

    return unwrapApiResponse(response);
  }
}

export const authService = new AuthService();
