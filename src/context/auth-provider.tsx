"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useHasAccessToken } from "@/hooks/use-has-access-token";
import { authService } from "@/lib/api/auth.service";
import { subscribeToAuthChanges } from "@/lib/api/token-storage";

const USER_EMAIL_KEY = "busilogix_user_email";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getStoredUserEmail(): string | null {
  if (!isBrowser()) {
    return null;
  }
  return localStorage.getItem(USER_EMAIL_KEY);
}

function setStoredUserEmail(email: string): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(USER_EMAIL_KEY, email);
}

function clearStoredUserEmail(): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.removeItem(USER_EMAIL_KEY);
}

type AuthContextValue = {
  isAuthenticated: boolean;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const isAuthenticated = useHasAccessToken();

  useEffect(() => {
    setUserEmailState(getStoredUserEmail());

    return subscribeToAuthChanges(() => {
      setUserEmailState(getStoredUserEmail());
    });
  }, []);

  const setUserEmail = useCallback((email: string) => {
    setStoredUserEmail(email);
    setUserEmailState(email);
  }, []);

  const logout = useCallback(() => {
    clearStoredUserEmail();
    setUserEmailState(null);
    authService.logout();

    const loginPath = `${window.location.origin}/login`;
    window.location.href = loginPath;
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userEmail,
      setUserEmail,
      logout,
    }),
    [isAuthenticated, userEmail, setUserEmail, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
