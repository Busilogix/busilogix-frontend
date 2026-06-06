import type { AuthTokenResponse, LoginTokenData } from "../types/auth.types";
import type { AuthTokens } from "../token-storage";

export function mapTokenResponse(tokens: AuthTokenResponse): AuthTokens {
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  };
}

export function mapLoginTokenData(tokens: LoginTokenData): AuthTokens {
  return {
    accessToken: tokens.accessToken,
  };
}
