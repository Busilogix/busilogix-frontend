const ACCESS_TOKEN_KEY = "busilogix_access_token";
const REFRESH_TOKEN_KEY = "busilogix_refresh_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export function getAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function clearTokens(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}
