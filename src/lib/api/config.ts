const DEFAULT_API_BASE_URL = "http://localhost:8080/api/v1";

function resolveApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Busilogix API] NEXT_PUBLIC_API_BASE_URL is not set. Using default:",
        DEFAULT_API_BASE_URL,
      );
    }
    return DEFAULT_API_BASE_URL;
  }

  return url.replace(/\/$/, "");
}

export const apiConfig = {
  baseURL: resolveApiBaseUrl(),
  timeoutMs: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;
