const ACCESS_TOKEN_KEY = "busilogix_access_token";
const REFRESH_TOKEN_KEY = "busilogix_refresh_token";

type AuthChangeListener = () => void;
const authChangeListeners = new Set<AuthChangeListener>();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyAuthChanges(): void {
  authChangeListeners.forEach((listener) => listener());
}

export function subscribeToAuthChanges(
  listener: AuthChangeListener,
): () => void {
  authChangeListeners.add(listener);
  return () => authChangeListeners.delete(listener);
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

  notifyAuthChanges();
}

export function clearTokens(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  notifyAuthChanges();
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

export function saveToken(token: string): void {
  setTokens({ accessToken: token });
}

export function getToken(): string | null {
  return getAccessToken();
}

export function removeToken(): void {
  clearTokens();
}

export function isAuthenticated(): boolean {
  return hasAccessToken();
}

